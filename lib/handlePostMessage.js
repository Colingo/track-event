var window = require("global/window")
var ReadySignal = require("ready-signal")
var uuid = require("node-uuid")

var slice = Array.prototype.slice
var prefix = "~track-event/lib/handlePostMessage~"
var functionHash = {}

/* Custom RPC over postMessage >_<

In future write postMessage stream and use dnode.
*/
module.exports = handlePostMessage

function handlePostMessage(options, onCommand) {
    var functionHash = {}
    var onMessageOptions = options.onMessage
    var postMessageOptions = options.postMessage
    if (onMessageOptions || postMessageOptions) {
        var origin = extractOrigin(onMessageOptions, postMessageOptions)

        setupMessage(origin, onCommand)
    }

    if (postMessageOptions) {
        return setupPostMessage(postMessageOptions)
    }
}

function extractOrigin(onMessageOptions, postMessageOptions) {
    if (Array.isArray(onMessageOptions)) {
        onMessageOptions = { origin: onMessageOptions }
    } else if (typeof onMessageOptions === "string") {
        onMessageOptions = { origin: [onMessageOptions] }
    } else if (!onMessageOptions) {
        onMessageOptions = { origin: [] }
    }

    var origin = onMessageOptions.origin
    if (postMessageOptions) {
        origin = origin.concat(postMessageOptions.origin)
    }

    return origin
}

function setupMessage(origin, onCommand) {
    var allowAll = origin.indexOf("*") !== -1

    window.addEventListener("message", function (ev) {
        if (!allowAll && origin.indexOf(ev.origin) === -1) {
            return
        }

        var command = unpack(ev)

        if (command === null) {
            return
        }

        var functionName = command.functionName
        var args = command.args
        var func = functionHash[functionName]

        func ? func.apply(null, args) : onCommand(functionName, args)
    })
}

function unpack(ev) {
    var command = parse(ev.data)

    if (!command || command.type !== "track-event~message") {
        return null
    }

    var functionName = command.functionName

    var args = command.args.map(function (arg) {
        if (!arg || (arg.indexOf && arg.indexOf(prefix) !== 0)) {
            return arg
        }

        var functionId = arg

        return proxy

        function proxy() {
            var args = slice.call(arguments)
            ev.source.postMessage(pack(functionId, args), ev.origin)
        }
    })

    return { functionName: functionName, args: args }
}

function setupPostMessage(postMessageOptions) {
    var ready = ReadySignal()
    var iframe = postMessageOptions.iframe
    var targetOrigin = postMessageOptions.origin

    iframe.addEventListener("load", ready)

    return callPostMessage

    function callPostMessage(functionName, args) {
        ready(function (ev) {
            var target = iframe.contentWindow

            target.postMessage(pack(functionName, args), targetOrigin)
        })
    }
}

function pack(functionName, args) {
    args = args.map(function (arg) {
        if (typeof arg !== "function") {
            return arg
        }

        var id = prefix + uuid()
        functionHash[id] = arg
        return id
    })

    return JSON.stringify({
        functionName: functionName
        , args: args
        , type: "track-event~message"
    })
}

function parse(x) {
    var json
    try {
        json = JSON.parse(x)
    } catch (err) {
        return null
    }

    return json
}

var mixpanel = require("mixpanel-browserify")
var ga = require("ga-browserify")
var uuid = require("node-uuid")
var xhr = require("xhr")
var ever = require("ever")
var window = require("global/window")
var ReadySignal = require("ready-signal")

module.exports = Client

var methods = require("./index")

function Client(options) {
    options = options || {}
    var client = {}
    setupMixpanel(client, options)
    setupXHR(client, options)
    setupMessage(client, options)
    setupPostMessage(client, options)

    var gaOptions = options.ga

    if (gaOptions) {
        client.tracker = ga(gaOptions)
    }

    return client
}

function setupMixpanel(client, options) {
    var mixpanelOptions = options.mixpanel

    if (!mixpanelOptions) {
        return
    }

    if (typeof mixpanelOptions === "string") {
        mixpanelOptions = { token: mixpanelOptions }
    }

    var randomName = uuid()
    mixpanel.init(mixpanelOptions.token, mixpanelOptions, randomName)
    client.mixpanel = mixpanel[randomName]
}

function setupXHR(client, options) {
    var xhrOptions = options.xhr

    if (!xhrOptions) {
        return
    }

    if (typeof xhrOptions === "string") {
        xhrOptions = { uri: xhrOptions }
    }

    var uri = xhrOptions.uri

    client.xhr = callXHR

    function callXHR(data, callback) {
        xhr({
            method: "POST"
            , uri: uri
            , data: JSON.stringify(data)
            , headers: {
                "content-type": "application/json"
            }
        }, callback)
    }
}

function setupMessage(client, options) {
    var onMessage = options.onMessage

    if (!onMessage) {
        return
    }

    if (Array.isArray(onMessage)) {
        onMessage = { origin: onMessage }
    }

    var origin = onMessage.origin

    window.addEventListener("message", function (ev) {
        if (origin !== "*" && origin.indexOf(ev.origin) === -1) {
            return
        }

        var command = JSON.parse(ev.data)
        var args = command.args
        args.unshift(client)

        methods[command.functionName].apply(null, args)
    })
}

function setupPostMessage(client, options) {
    var postMessageOptions = options.postMessage

    if (!postMessageOptions) {
        return
    }

    var ready = ReadySignal()
    var iframe = postMessageOptions.iframe
    var targetOrigin = postMessageOptions.origin

    iframe.addEventListener("load", ready)

    client.postMessage = callPostMessage

    function callPostMessage(functionName, args) {
        ready(function (ev) {
            var target = iframe.contentWindow
            var command = { functionName: functionName, args: args }
            target.postMessage(JSON.stringify(command), targetOrigin)
        })
    }
}

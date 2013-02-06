var mixpanel = require("mixpanel-browserify")
var ga = require("ga-browserify")
var uuid = require("node-uuid")
var xhr = require("xhr")
var ever = require("ever")
var window = require("global/window")
var ReadySignal = require("ready-signal")

var handlePostMessage = require("./lib/handlePostMessage")

module.exports = Client

var methods = require("./index")

function Client(options) {
    options = options || {}
    var client = {}
    setupMixpanel(client, options)
    setupXHR(client, options)
    client.postMessage = handlePostMessage(options, onMessage)

    var gaOptions = options.ga

    if (gaOptions) {
        client.tracker = ga(gaOptions)
    }

    return client

    function onMessage(method, args) {
        args.unshift(client)
        methods[method].apply(null, args)
    }
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

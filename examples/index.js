var console = require("console")
var document = require("global/document")
var ever = require("ever")

var Client = require("../client")
var track = require("../track")
var trackEvent = require("../trackEvent")
var xhr = require("../xhr")
var postMessage = require("../postMessage")

console.log("test")

var iframe = document.createElement("iframe")

var client = Client({
    mixpanel: {
        token: "dc638079ef976b94fefee02cf55f338a"
        , debug: true
        , test: true
        , verbose: true
    }
    , ga: "UA-25222034-1"
    , xhr: "http://localhost:2043/track"
    , postMessage: {
        iframe: iframe
        , origin: "http://localhost:2043"
    }
})

iframe.src = "http://localhost:2043/iframe"
document.body.appendChild(iframe)

track(client, "some event", {
    "some": "property"
})
var tracker = client.tracker
tracker._setDomainName("none")
tracker._trackPageview()

trackEvent(client, "some category", "some label")

xhr(client, { some: "data" }, function (err, result) {
    console.log("GOT RESULT", arguments)
})

postMessage(client, "track", ["some event iframe", {
    "some iframe": "property"
}])

postMessage(client, "distinctId", [function (err, result) {
    console.log("Mixpanel's distinctId", result)
}])

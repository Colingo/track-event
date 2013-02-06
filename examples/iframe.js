var console = require("console")

var Client = require("../client")
var distinctId = require("../distinctId")

var client = Client({
    mixpanel: {
        token: "dc638079ef976b94fefee02cf55f338a"
        , debug: true
        , test: true
        , verbose: true
    }
    , onMessage: {
        origin: ["http://localhost:9966"]
    }
})

console.log("in iframe")

distinctId(client, function (err, result) {
    console.log("Mixpanel's (iframe) distinctId", result)
})

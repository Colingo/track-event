var test = require("tape")
var Client = require("../client")

test("can create client", function (assert) {
    var client = Client({
        mixpanel: "dc638079ef976b94fefee02cf55f338a"
    })

    assert.ok(client)
    assert.end()
})

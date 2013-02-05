var http = require("http")
var path = require("path")
var console = require("console")
var bundle = require("browserify-server")

var jsPath = path.join(__dirname, "./iframe.js")

http.createServer(function (req, res) {
    addCrossDomainHeaders(req, res)
    if (req.url === "/track" && req.method === "POST") {
        var b = ""

        req.on("data", function (c) {
            b += String(c)
        })

        req.on("end", function (chunk) {
            if (chunk) {
                b += String(chunk)
            }

            res.end(b)
        })
    } else if (req.url === "/iframe") {
        var iframeJs = bundle(jsPath, { debug: true })
        var html = "<html><body><script>" + iframeJs + "</script></body></html>"
        res.setHeader("content-type", "text/html")
        res.end(html)
    } else {
        res.end()
    }
}).listen(2043, function () {
    console.log("example server listening on 2043")
})

function addCrossDomainHeaders(req, res) {
    var origin = req.headers.origin
    res.setHeader("Access-Control-Allow-Origin", origin)
    res.setHeader("Access-Control-Allow-Methods"
        , "POST, GET, PUT, DELETE, OPTIONS, XMODIFY")
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Max-Age", '86400')
    res.setHeader("Access-Control-Allow-Headers"
        , "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept")
}

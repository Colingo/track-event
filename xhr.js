var console = require("console")

module.exports = xhr

function xhr(client, data, callback) {
    client.xhr(data, callback || (client.loggingEnabled ? log : noop))

    function log(error) {
        if (error) {
            console.error("track-event/xhr error", error, error.stack
                , "failed to send", data)
        }
    }
}

function noop() {}

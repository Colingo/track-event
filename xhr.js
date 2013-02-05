module.exports = xhr

function xhr(client, data, callback) {
    client.xhr(data, callback || noop)
}

function noop() {}

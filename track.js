module.exports = track

function track(client, eventName, properties, callback) {
    properties = properties || {}
    callback = callback || noop

    client.mixpanel.track(eventName, properties, callback)
}

function noop() {}

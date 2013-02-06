module.exports = distinctId

function distinctId(client, callback) {
    callback(null, client.mixpanel.get_distinct_id())
}

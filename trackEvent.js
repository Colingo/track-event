module.exports = trackEvent

function trackEvent(client, category, action, label, value, noninteraction) {
    client.tracker._trackEvent(category, action, label, value, noninteraction)
}

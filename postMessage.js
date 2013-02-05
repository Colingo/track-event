module.exports = postMessage

function postMessage(client, functionName, args) {
    client.postMessage(functionName, args)
}

# track-event

<!-- [![build status][1]][2] -->

[![dependency status][3]][4]

<!-- [![browser support][5]][6] -->

Track events to multiple destinations

## Example (mixpanel)

```js
var Client = require("track-event/client")
var track = require("track-event/track")

var client = Client({
    mixpanel: {
        token: "mixpanel_key"
    }
})

track(client, "event name", {
    "some properties": "go here"
}, function (err, res) {
    /* ... */
})

var mixpanel = client.mixpanel
// do custom stuff with mixpanel client directly.
```

## Example (GA)

```js
var Client = require("track-event/client")
var trackEvent = require("track-event/trackEvent")

var client = Client({
    ga: "UA-XXX"
})

trackEvent(client, "some category", "some label")

var tracker = client.tracker
tracker._trackPageview()
// do custom stuff with GA tracker
```

## Example (AJAX Back end)

```js
var Client = require("track-event/client")
var xhr = require("track-event/xhr")

var client = Client({
    xhr: "http://example.com/track"
})

xhr(client, { "send arbitary": "json data"}, function (err, res) {
    /* ... */
})
```

## Example (postMessage)

You want to use postMessage if you want to use say mixpanel's API
    from your own domain on a seperate site. So you embed an iframe
    to your own site on the third party domain and use postMessage
    to send track events

### postMessage code

Use `postMessage(client, method, args)` to effectively make an
    RPC call on the `client` created within the iframe.

```js
// on http://third-party.com
var Client = require("track-event/client")
var postMessage = require("track-event/postMessage")

var iframe = document.createElement("iframe")
iframe.src = "http://example.com/tracking-iframe"
document.body.appendChild(iframe)

var client = Client({
    postMessage: {
        iframe: iframe
        , origin: "http://example.com"
    }
})

// use `"track"`, `"trackEvent"`, etc to send arbitary data.
// You can't send callbacks currently
postMessage(client, "track", ["track some mixpanel event", {
    "with some arbitary": "properties etc."
}])
```

### iframe page code

Just instantiate a client and tell it to handle `onMessage` and
    whitelist the third party domain you want to accept incoming
    RPC calls from.

```js
// on http://example/com/tracking-iframe
var Client = require("track-event/client")

var client = Client({
    mixpanel: {
        token: "some mixpanel token"
    }
    , onMessage: {
        origin: ["http://third-party.com"]
    }
})
```


## Installation

`npm install track-event`

## Contributors

 - Raynos

## MIT Licenced

  [1]: https://secure.travis-ci.org/Colingo/track-event.png
  [2]: http://travis-ci.org/Colingo/track-event
  [3]: http://david-dm.org/Colingo/track-event/status.png
  [4]: http://david-dm.org/Colingo/track-event
  [5]: http://ci.testling.com/Colingo/track-event.png
  [6]: http://ci.testling.com/Colingo/track-event

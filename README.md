To reproduce the issue, [the demo page](https://murillo128.github.io/getdisplaymedia-motion-issue/)

Click on "click to start", this will open a new page with a static content.

Focus back on the original tab and select the new open on the sharing dialog.

The capture tab stream will be sent over a local peerconnection and rendered back, displaying the stats for the stream:

```
{
  "frameWidth": 316,
  "frameHeight": 180,
  "framesPerSecond": 31,
  "qualityLimitationReason": "bandwidth",
  "qualityLimitationDurations": {
    "other": 0,
    "cpu": 0,
    "bandwidth": 9979,
    "none": 29
  },
  "qualityLimitationResolutionChanges": 0,
  "encoderImplementation": "libvpx",
  "firCount": 0,
  "pliCount": 0,
  }
```

If you click "play" on the tab a youtube will be played, but the stream is still at 180P

If you click on "replace track" to replace the track on the rtp sender with the same track object, the stream is received at 720P

chromium issue: [https://bugs.chromium.org/p/chromium/issues/detail?id=1280210](https://bugs.chromium.org/p/chromium/issues/detail?id=1280210)


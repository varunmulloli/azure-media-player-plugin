var express = require('express'),
  cors = require('cors'),
  app = express(),
  port = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  function calculateHighestBitrate(videoWidth, videoHeight, tracks) {
    if(Array.isArray(tracks)) {
      const highestBitrate = tracks.reduce((agg, next) => {
        const trackVideoWidth = next._width;
        const trackVideoHeight = next._height;
        const trackBitrate = next._bitrate;

        if(trackVideoWidth > agg.width && trackVideoWidth <= videoWidth && trackVideoHeight > agg.height && trackVideoHeight <= videoHeight) {
          return {
            width: trackVideoWidth,
            height: trackVideoHeight,
            bitrate: trackBitrate,
          }
        } else {
          return agg;
        }
      }, { width: 0, height: 0, bitrate: 0 });
      return highestBitrate.bitrate;
    } else {
      return 0;
    }
  }

  app.post('/event', (req, res) => {
    var body = req.body;
    const highestBitrate = calculateHighestBitrate(body.width, body.height, body.availableTracks);
    res.send({ 
      "HIGHEST_BITRATE_POSSIBLE": {
        "bitrate": highestBitrate,
        "possible": highestBitrate > body.currentBitrate
      }
    });
  })
  
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
  })
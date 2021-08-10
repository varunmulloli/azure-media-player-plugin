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

  function calculateTooManyBitrateSwitches(bitrateSwitchEvents) {
    if(Array.isArray(bitrateSwitchEvents) && bitrateSwitchEvents.length > 1) {
      bitrateSwitchEvents.reverse();
      const lastSwitchTimestamp = !!bitrateSwitchEvents[0] ? bitrateSwitchEvents[0].timestamp : 0;
      const validatedTimestamp = !!lastSwitchTimestamp ? lastSwitchTimestamp : Date.now();
      const tenSecondsBefore = validatedTimestamp - 10000;
      const eventsInTenSecondRange = bitrateSwitchEvents.filter(event => event.timestamp > tenSecondsBefore);
      if(eventsInTenSecondRange.length > 2) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  function calculateTooManyBuffering(bufferingEvents) {
    if(Array.isArray(bufferingEvents) && bufferingEvents.length > 0) {
      const eventLongerThanOneSecond = bufferingEvents.find(event => event.duration > 1000);
      if(!!eventLongerThanOneSecond) {
        return true;
      } else {
        bufferingEvents.reverse();
        const lastSwitchTimestamp = !!bitrateSwitchEvents[0] ? bitrateSwitchEvents[0].timestamp : 0;
        const validatedTimestamp = !!lastSwitchTimestamp ? lastSwitchTimestamp : Date.now();
        const thirtySecondsBefore = validatedTimestamp - 30000; 
        const eventsInThirtySecondRange = bitrateSwitchEvents.filter(event => event.timestamp > thirtySecondsBefore);
        if(eventsInThirtySecondRange.length > 3) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  app.post('/event', (req, res) => {
    var body = req.body;
    const highestBitrate = calculateHighestBitrate(body.width, body.height, body.availableTracks);
    const tooManyBitrateSwitches = calculateTooManyBitrateSwitches(body.bitrateSwitchEvents);
    const tooManyBuffering = calculateTooManyBuffering(body.bufferingEvents);
    res.send({ 
      "HIGHEST_BITRATE_POSSIBLE": highestBitrate,
      "TOO_MANY_BITRATE_SWITCHES": tooManyBitrateSwitches,
      "TOO_MANY_BUFFERING": tooManyBuffering,
    });
  })
  
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
  })
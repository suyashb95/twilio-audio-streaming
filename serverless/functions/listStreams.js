const twilio = require('twilio');

exports.handler = async function(context, event, callback) {
  const twilioClient = context.getTwilioClient();

  // Get a list of the current media processors
  const mediaProcessorList = await twilioClient.media.mediaProcessor.list({status: 'started'});

  // Filter them by which ones are audio only
  const audioLivestreams = mediaProcessorList.filter(mp => mp.extension === 'audio-mixer-v1');

  let streamList = [];

  for (let stream of audioLivestreams) {
    const extensionContext = JSON.parse(stream.extensionContext);
    const playerStreamerId = extensionContext.outputs[0];
    const roomId = extensionContext.room.name;
    const room = await twilioClient.video.rooms(roomId).fetch();
    const streamName = room.uniqueName;

    const streamDetails = {
      streamName,
      playerStreamerId
    }

    streamList.push(streamDetails)
  }

  return callback(null, {
    streamList
  });
}
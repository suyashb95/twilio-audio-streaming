const twilio = require('twilio');

exports.handler = async function(context, event, callback) {
  if (!event.streamDetails) {
    const response = new twilio.Response();
    response.setStatusCode(401);
    response.setBody({
      message: 'Missing stream details',
    });
    return callback(null, response);
  }

  const streamName  = event.streamDetails.streamName;
  const roomId  = event.streamDetails.roomId;
  const playerStreamerId = event.streamDetails.playerStreamerId;
  const mediaProcessorId = event.streamDetails.mediaProcessorId;

  const twilioClient = context.getTwilioClient();

  // End the player streamer, media processor, and video room
  await twilioClient.media.mediaProcessor(mediaProcessorId).update({status: 'ended'});
  await twilioClient.media.playerStreamer(playerStreamerId).update({status: 'ended'});
  await twilioClient.video.rooms(roomId).update({status: 'completed'});

  return callback(null, {
    message: `Successfully ended stream ${streamName}`
  });
}
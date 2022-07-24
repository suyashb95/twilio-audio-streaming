const twilio = require('twilio');

exports.handler = async function(context, event, callback) {
  if (!event.streamName) {
    const response = new twilio.Response();
    response.setStatusCode(401);
    response.setBody({
      message: 'Missing stream name',
    });
    return callback(null, response);
  }

  if (!event.username) {
    const response = new twilio.Response();
    response.setStatusCode(401);
    response.setBody({
      message: 'Missing user identity',
    });
    return callback(null, response);
  }

  const twilioClient = context.getTwilioClient();

  // Create the video room, player streamer, and audio mixer
  let room;
  try {
    room = await twilioClient.video.rooms.create({
      uniqueName: event.streamName,
      audioOnly: true,
      type: 'group'
    });

  } catch (error) {
    const response = new twilio.Response();
    response.setStatusCode(400);
    response.setBody({
      message: 'Cannot create room',
      error: error
    });
    return callback(null, response);
  }

  const playerStreamer = await twilioClient.media.playerStreamer.create({video: false});

  const mediaProcessor = await twilioClient.media.mediaProcessor.create({
    extension: 'audio-mixer-v1',
    extensionContext: JSON.stringify({
      identity: 'audio-mixer-v1',
      room: {
        name: room.sid
      },
      outputs: [
        playerStreamer.sid
      ],
    })
  });

  // Create an access token
  const token = new twilio.jwt.AccessToken(context.ACCOUNT_SID, context.API_KEY_SID, context.API_KEY_SECRET);

  // Create a video grant
  const videoGrant = new twilio.jwt.AccessToken.VideoGrant({
    room: event.streamName
  });

  // Add the video grant and the user's identity to the token
  token.addGrant(videoGrant);
  token.identity = event.username;

  return callback(null, {
    streamDetails : {
      roomId: room.sid,
      streamName: event.streamName,
      playerStreamerId: playerStreamer.sid,
      mediaProcessorId: mediaProcessor.sid
    },
    token: token.toJwt()
  });
}
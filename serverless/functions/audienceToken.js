const twilio = require('twilio');

exports.handler = async function(context, event, callback) {
  if (!event.username) {
    const response = new twilio.Response();
    response.setStatusCode(401);
    response.setBody({
      message: 'Missing user identity',
    });
    return callback(null, response);
  }

  if (!event.playerStreamerId) {
    const response = new twilio.Response();
    response.setStatusCode(401);
    response.setBody({
      message: 'Missing stream details',
    });
    return callback(null, response);
  }

  const twilioClient = context.getTwilioClient();

  // Create an access token
  const token = new twilio.jwt.AccessToken(context.ACCOUNT_SID, context.API_KEY_SID, context.API_KEY_SECRET);

  // Create a playback grant and attach it to the access token
  const playbackGrant = await twilioClient.media.playerStreamer(event.playerStreamerId).playbackGrant().create({ttl: 60});

  const wrappedPlaybackGrant = new twilio.jwt.AccessToken.PlaybackGrant({
    grant: playbackGrant.grant
  });

  token.addGrant(wrappedPlaybackGrant);
  token.identity = event.username;

  return callback(null, {
    token: token.toJwt(),
  });
}
import { useState } from 'react';

import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { Input } from '@twilio-paste/core/input';
import { Flex } from '@twilio-paste/core/flex';
import { Heading } from '@twilio-paste/heading';
import { Card } from '@twilio-paste/core/card';
import { Column, Grid } from '@twilio-paste/core/grid';
import { Label } from '@twilio-paste/core/label';
import { Badge } from '@twilio-paste/core/badge';

import { connect } from 'twilio-video';
import VideoRoom from './VideoRoom';

const ManageStream = ({username, setError}) => {
  const [room, setRoom] = useState(null);
  const [streamDetails, setStreamDetails] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startStream = async (event) => {
    // Call to the backend to create all the resources and start the stream (audio only)
    event.preventDefault();

    const streamName = event.target.streamName.value;

    // While waiting for the API response, setting isLoading to true disables the button
    setIsLoading(true);

    try {
      const response = await fetch('/startStream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          streamName: streamName,
          username: username
        })
      });

      const result = await response.json();

      // Get the details back from the server and the token for the video room
      setStreamDetails(result.streamDetails);

      // Join the video room with audio only
      const videoRoom = await connect(result.token, {
        name: result.streamDetails.roomId,
        audio: true
      });

      setRoom(videoRoom);
      setIsLive(true);
      setIsLoading(false);

    } catch (error) {
      console.log(error)
      setError(error);
    }
  }

  const endStream = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Disconnect from the video room
    room.disconnect();

    // Call to the backend to end all the resources and stop the stream
    try {
      const response = await fetch('/endStream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          streamDetails: streamDetails
        })
      });

      const result = await response.json();
      setIsLive(false);
      setStreamDetails(null);
      setIsLoading(false);

    } catch (error) {
      console.log(error)
      setError(error);
    }
  };


  return (
    <Card padding='space70'>
      <Grid gutter='space30'>
        <Column span={8}>
          {!isLive &&
            <Box>
              <form onSubmit={startStream}>
                <Heading as='h4' variant='heading30'>Create a Stream</Heading>
                <Label htmlFor='streamName' required>Name your stream</Label>
                  <Input
                    aria-describedby='stream_name_help_text'
                    id='streamName'
                    name='streamName'
                    type='text'
                    placeholder='My first livestream'
                    required/>
                  <Button variant='primary' type='submit' disabled={isLoading}>Start Stream</Button>
              </form>
            </Box>
          }
          {isLive &&
            <Card>
              <Flex display='inline-flex'>
              <Heading as='h4' variant='heading30'>
                {streamDetails.streamName}
                <Badge variant='default' as='span'>LIVE</Badge>
              </Heading>
              </Flex>
              <VideoRoom streamDetails={streamDetails} room={room} />
              <form onSubmit={endStream}>
                <Button variant='destructive' type='submit' disabled={isLoading}>End Stream</Button>
              </form>
            </Card>
          }
        </Column>
      </Grid>
    </Card>
  )
}

export default ManageStream;
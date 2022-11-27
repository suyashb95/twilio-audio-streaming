import { useState, useEffect } from 'react';
import { Player } from '@twilio/live-player-sdk';

import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { Flex } from '@twilio-paste/core/flex';
import { Heading } from '@twilio-paste/heading';
import { PauseIcon } from '@twilio-paste/icons/esm/PauseIcon';
import { PlayIcon } from '@twilio-paste/icons/esm/PlayIcon';
import { VolumeOnIcon } from '@twilio-paste/icons/esm/VolumeOnIcon';
import { VolumeOffIcon } from '@twilio-paste/icons/esm/VolumeOffIcon';

const StreamPlayer = ({username, streamDetails, setError, setInfo}) => {
  const [player, setPlayer] = useState(null);
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (player != null) {
      player.setVolume(volume/100);
    }

  }, [volume, player]);

  const getToken = async () => {
    try {
      const response = await fetch('/audienceToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          playerStreamerId: streamDetails.playerStreamerId
        })
      });

      const data = await response.json();
      return data.token

    } catch (error) {
      setError('Unable to get token');
    }
  }

  const playStream = async () => {
    setIsLoading(true)
    const accessToken = await getToken();

    try {
      const {
        host,
        protocol,
      } = window.location;

      const livePlayer = await Player.connect(accessToken, {playerWasmAssetsPath: `${protocol}//${host}/livePlayer`});

      livePlayer.play();

      livePlayer.on(Player.Event.StateChanged, (state) => {
        if (state === Player.State.Ended) {
          setIsPlaying(false);
          setInfo(`Stream has ended — please refresh the stream list`);
        }
      })

      setPlayer(livePlayer);
      setIsPlaying(true);
      setIsLoading(false);

    } catch (error) {
      console.log(error);
      setError('Unable to connect to livestream');
    }
  }

  const pauseStream = () => {
    player.disconnect();
    setIsPlaying(false);
  }

  return (
    <Box backgroundColor='#e6edf7' padding='space60' marginBottom='space70'>
      <Heading as='h4'>{streamDetails.streamName}</Heading>
      {isPlaying ?
        <Box>
          <Box>
            {player.audioElement}
          </Box>
          <Flex>
            <VolumeOffIcon decorative={false} title='Pause stream button' />
            <input type='range' min='1' max='100' onChange={(e) => setVolume(e.target.value)}/>
            <VolumeOnIcon decorative={false} title='Pause stream button' />
          </Flex>
          <Button onClick={pauseStream}>
            <PauseIcon decorative={false} title='Pause stream button' />
            Pause Stream
          </Button>
        </Box>
        :
        <Button onClick={playStream}>
          <PlayIcon decorative={false} title='Play stream button' disabled={isLoading}/>
          Play Stream
        </Button>
      }
    </Box>
  )
}

export default StreamPlayer;
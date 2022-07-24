import { useState, useEffect, useRef} from 'react';
import { Box } from '@twilio-paste/core/box';

const Participant = ({ participant }) => {
  const [audioTracks, setAudioTracks] = useState([]);
  const audioRef = useRef();

  const trackpubsToTracks = (trackMap) => {
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);
  }

  useEffect(() => {
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {
      setAudioTracks((audioTracks) => [...audioTracks, track]);
    };

    const trackUnsubscribed = (track) => {
      setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
    };

    participant.on('trackSubscribed', trackSubscribed);
    participant.on('trackUnsubscribed', trackUnsubscribed);

    return () => {
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    if (audioTracks != null) {
      const audioTrack = audioTracks[0];
      if (audioTrack) {
        audioTrack.attach(audioRef.current);
        return () => {
          audioTrack.detach();
        };
      }
    }
  }, [audioTracks]);

  return (
    <Box className='participant'>
      <audio ref={audioRef} autoPlay={true} muted={true} />
    </Box>
  );
};

export default Participant;
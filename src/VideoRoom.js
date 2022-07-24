import { useState, useEffect } from 'react';

import { Box } from '@twilio-paste/box';
import Participant from './Participant';

const VideoRoom = ({ room }) => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const participantConnected = participant => {
      setParticipants(previousParticipants => [...previousParticipants, participant]);
    };

    const participantDisconnected = participant => {
      setParticipants(previousParticipants =>
        previousParticipants.filter(p => p !== participant)
      );
    }

    room.on('participantConnected', participantConnected);
    room.on('participantDisconnected', participantDisconnected);
    room.participants.forEach(participantConnected);

  }, [room]);

  return (
    <Box className='room'>
      <Box className='participants'>
        <Participant
          key={room.localParticipant.identity}
          participant={room.localParticipant} />
        { participants.map((participant) =>
            <Participant
              key={participant.identity}
              participant={participant} />
          )
        }
      </Box>
    </Box>
  );
}

export default VideoRoom;
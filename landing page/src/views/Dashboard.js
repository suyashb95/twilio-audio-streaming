import { useState, useEffect } from 'react';

import  Alert  from '@mui/material/Alert';
import StreamPlayer from './StreamPlayer';
import ManageStream from './ManageStream';
import Button  from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import './index.css';


const styl = {
  margin: '20px',
  color: 'white',
}



const Dashboard = ({username, setUsername}) => {
  const [streamList, setStreamList] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);

  const getStreamList = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/listStreams', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      setStreamList(result.streamList);
      setIsLoading(false);

    } catch (error) {
      console.log(error)
      setError(`Unable to get stream list`);
    }
  }


  // When the component loads, get the list of ongoing streams
  useEffect(() => {
    getStreamList();
  }, []);

  return (
    <div>           
            <div className='button'>
              {!isStreaming &&
                
                <Fab variant='extended' color ='primary' onClick={() => setIsStreaming(true)}>
                  Start a new stream
                
                </Fab>
              }
              {isStreaming &&
                <Fab variant='extended' color ='primary' onClick={() => setIsStreaming(false)}>
                  Listen to a stream
                </Fab>
              }
           </div>
                   
          {error &&
            <Alert severity="error" onDismiss={() => setError(null)} variant='outlined' >
              {error}
            </Alert>
          }
          {info &&
            <Alert severity="info" onDismiss={() => setInfo(null)} variant='neutral'>
              {info}
            </Alert>
          }
          {isStreaming &&
            <ManageStream username={username} setError={setError} setInfo={setInfo}/>
          }
          {!isStreaming &&
            
              <div style={styl}>
                 Ongoing Streams
                <div style={styl}>
                {streamList.length} streams are live right now
                </div>
                {streamList.map((streamDetails) => {
                  return (
                    <StreamPlayer username={username} streamDetails={streamDetails} key={streamDetails.playerStreamerId} setError={setError} setInfo={setInfo}></StreamPlayer>
                  )
                })}

                <Button variant='contained' disabled={isLoading} onClick={getStreamList} style={{backgroundColor:'gray'}}>
                 
                  Refresh List
                </Button>
              </div>
              
          }
         
         
      
      
    </div>

    
    
      
    
  );
};

export default Dashboard;

import { useState } from 'react';

import { Theme } from '@twilio-paste/core/theme';
import { Box } from '@twilio-paste/core/box';
import { Grid, Column } from '@twilio-paste/core/grid';
import { Label } from '@twilio-paste/core/label';
import { Input } from '@twilio-paste/core/input';
import { Button } from '@twilio-paste/core/button';
import { Card } from '@twilio-paste/core/card';
import { Heading } from '@twilio-paste/core/heading';

import Dashboard from './Dashboard';

const App = () => {
  const [username, setUsername] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setUsername(event.target.username.value);
  }

  return (
    <Theme.Provider theme='default'>
      <Grid gutter='space30'>
        <Column span={10} offset={1}>
          {username ?
            <Dashboard username={username} setUsername={setUsername} />
          :
          <Box margin='space100'>
            <Card padding="space100">
              <form onSubmit={handleSubmit}>
                <Heading as='h2' variant='heading30'>Sign In</Heading>
                <Box marginBottom='space30'>
                  <Label htmlFor='username' required>Username</Label>
                  <Input
                    aria-describedby='username_help_text'
                    id='username'
                    name='username'
                    type='text'
                    placeholder='username123'
                    required/>
                </Box>
                <Button variant='primary' type='submit'>Sign In</Button>
              </form>
            </Card>
          </Box>
          }
        </Column>
      </Grid>
    </Theme.Provider>
  )
};

export default App;
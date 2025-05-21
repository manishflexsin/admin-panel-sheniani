"use client"
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface Profile {
  data: {
    firstName: string;
    lastName: string;
  };
  id: number;
  name: string;
  email: string;
  avatar?: string;
  timezone?: string;
}
 
interface AccountInfoProps {
  profile: Profile;
}
export function AccountInfo({ profile }: AccountInfoProps): React.JSX.Element {
  const name = `${profile.data.firstName} ${profile.data.lastName}`;
  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src='/assets/avatar.png' sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{name}</Typography>
            {/* <Typography color="text.secondary" variant="body2">
              {profile.city} {profile.country}
            </Typography> */}
            <Typography color="text.secondary" variant="body2">
              {profile.timezone}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
}

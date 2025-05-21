'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { headers } from 'next/headers';




export function ChangePasswordForm(): React.JSX.Element  {
   const searchParams = useSearchParams();
   let token=searchParams.get('token');

//    alert("the token is "+token);

if(!token){
      alert("invalid link");
}

React.useEffect(()=> { 
const fetchData = async () => {
    try{
        const response=await axios.post('http://localhost:3000/v1/admin/forgot-password', {
         headers: {
          'Authorization': `Bearer ${token}`,
        },
    })

    
    }
     catch(error){
console.log("error in fetchning the data",error)
     }
}},[]);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader subheader="Create new password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
            <FormControl fullWidth>
              <InputLabel>Password</InputLabel>
              <OutlinedInput label="Password" name="password" type="password" />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Confirm password</InputLabel>
              <OutlinedInput label="Confirm password" name="confirmPassword" type="password" />
            </FormControl>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">Update</Button>
        </CardActions>
      </Card>
    </form>
  );
}

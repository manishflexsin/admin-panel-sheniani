"use client"
import * as React from 'react';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useRouter } from 'next/navigation';
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';
import { PROFILE } from '@/constants';
import axios from 'axios';

interface Profile {
  data: Profile;
  id: number;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  avatar?: string;
  timezone?: string;
};

async function fetchProfile(authToken: string | null): Promise<Profile> {
  const response = await axios.get<Profile>(PROFILE, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    }
  });
  return response.data;
}

export default function Page(): React.JSX.Element {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async (): Promise<void> => {
      try {
        const authToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
        if (!authToken) {
          window.location.href = 'http://localhost:3001/auth/sign-in';
          return;
        }
        
        const data = await fetchProfile(authToken);
        // Combine first and last name if name isn't provided
        const profileData = {
          ...data,
          name: data.name || `${data.firstName} ${data.lastName}`
        };
        setProfile(profileData);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          // Clear auth token and redirect to login
          localStorage.removeItem('auth-token');
          const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
          window.location.href = `${BASE_URL}/auth/sign-in`;
          return;
        }
        
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    void loadProfile();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>No profile data available</div>;
  }

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Account</Typography>
      </div> 
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <AccountInfo profile={{ ...profile, name: profile.name || '' }} />
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          <AccountDetailsForm profile={profile.data} />
        </Grid>
      </Grid>
    </Stack>
  );
}
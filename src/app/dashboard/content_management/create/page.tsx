'use client';

import {
  Box, Button, TextField, Typography, Grid
} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title_en: '',
    title_ka: '',
    content_en: '',
    content_ka: '',
    meta_title_en: '',
    meta_title_ka: '',
    meta_desc_en: '',
    meta_desc_ka: '',
    meta_keywords_en: '',
    meta_keywords_ka: '',
    slug: ''
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    await axios.post('http://localhost:4000/api/v1/pages/create', form);
    router.push('/dashboard/content_management');
  };

  return (
    <Box p={4}>
      <Typography variant="h6" mb={3}>Create New Static Page</Typography>
      <Grid container spacing={2}>
        {Object.entries(form).map(([key, value]) => (
          <Grid item xs={12} key={key}>
            <TextField
              label={key.replace(/_/g, ' ').toUpperCase()}
              fullWidth
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
            />
          </Grid>
        ))}
      </Grid>
      <Box mt={3}>
        <Button variant="contained" onClick={handleSubmit}>Create Page</Button>
      </Box>
    </Box>
  );
}

'use client';

import {
  Box, Button, TextField, Typography, Grid
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

export default function EditPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    const res = await axios.get(`http://localhost:4000/api/v1/pages/${slug}`);
    setForm(res.data.data);
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleUpdate = async () => {
    await axios.put(`http://localhost:4000/api/v1/pages/${slug}`, form);
    router.push('/dashboard/content_management');
  };

  return (
    <Box p={4}>
      <Typography variant="h6" mb={3}>Edit Page: {slug}</Typography>
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
        <Button variant="contained" onClick={handleUpdate}>Save Changes</Button>
      </Box>
    </Box>
  );
}

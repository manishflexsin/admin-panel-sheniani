'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Box, Typography, TextField, Button } from '@mui/material';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name_en: '',
    name_ka: '',
    image_url: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await axios.post('http://localhost:4000/api/v1/categories', formData);
    router.push('/dashboard/category_management');
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4}>Create Category</Typography>

      <Box mb={4}>
        <Typography fontWeight="bold">Name (EN)</Typography>
        <TextField name="name_en" fullWidth onChange={handleChange} value={formData.name_en} />
      </Box>

      <Box mb={4}>
        <Typography fontWeight="bold">Name (KA)</Typography>
        <TextField name="name_ka" fullWidth onChange={handleChange} value={formData.name_ka} />
      </Box>

      <Box mb={4}>
        <Typography fontWeight="bold">Image URL</Typography>
        <TextField name="image_url" fullWidth onChange={handleChange} value={formData.image_url} />
      </Box>

      <Button variant="contained" onClick={handleSubmit}>Save Category</Button>
    </Box>
  );
}

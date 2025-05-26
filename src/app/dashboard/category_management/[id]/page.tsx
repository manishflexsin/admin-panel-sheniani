'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, TextField, Button } from '@mui/material';

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name_en: '',
    name_ka: '',
    image_url: '',
  });

  useEffect(() => {
    if (id) {
      fetchCategory(id as string);
    }
  }, [id]);

  const fetchCategory = async (id: string) => {
    const res = await axios.get(`http://localhost:4000/api/v1/categories/${id}`);
    setFormData(res.data.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await axios.put(`http://localhost:4000/api/v1/categories/${id}`, formData);
    router.push('/dashboard/category_management');
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4}>Edit Category</Typography>

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

      <Button variant="contained" onClick={handleSubmit}>Update Category</Button>
    </Box>
  );
}

"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import axios from 'axios';

interface Category {
  _id: string;
  name: string;
}

export default function FaqCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('http://localhost:4000/api/v1/faqs/categories').then((res) => {
      setCategories(res.data.data);
    });
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" mb={3}>FAQ Categories</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card onClick={() => router.push(`/dashboard/faq_management/global`)}>
            <CardContent>
              <Typography variant="h6">Global FAQs</Typography>
            </CardContent>
          </Card>
        </Grid>
        {categories.map((cat) => (
          <Grid item xs={12} sm={6} md={4} key={cat._id}>
            <Card onClick={() => router.push(`/dashboard/faq_management/${cat._id}`)}>
              <CardContent>
                <Typography variant="h6">{cat.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

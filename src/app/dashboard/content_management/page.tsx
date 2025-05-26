'use client';

import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableHead, TableRow,
  TableCell, TableBody
} from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface StaticPage {
  _id: string;
  title_en: string;
  slug: string;
}

export default function StaticPages() {
  const [pages, setPages] = useState<StaticPage[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    const res = await axios.get('http://localhost:4000/api/v1/pages/getAllPages');
    setPages(res.data.data);
  };

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Manage Static Pages</Typography>
        <Button variant="contained" onClick={() => router.push('/dashboard/content_management/create')}>
          Add Page
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title (EN)</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page._id}>
              <TableCell>{page.title_en}</TableCell>
              <TableCell>{page.slug}</TableCell>
              <TableCell>
                <Button onClick={() => router.push(`/dashboard/content_management/${page.slug}`)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface BlogFormProps {
  isEditMode: boolean;
  blogId?: string;
}

export default function BlogForm({ isEditMode, blogId }: BlogFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeyword, setMetaKeyword] = useState('');
  const [category, setCategory] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (isEditMode && blogId) {
      axios.get(`http://localhost:4000/api/v1/blogs/${blogId}`).then(res => {
        const blog = res.data;
        setTitle(blog.title);
        setContent(blog.content);
        setMetaTitle(blog.metaTitle);
        setMetaDescription(blog.metaDescription);
        setMetaKeyword(blog.metaKeyword);
        setCategory(blog.category);
      });
    }
  }, [isEditMode, blogId]);

  const handleSave = async () => {
    const payload = { title, content, metaTitle, metaDescription, metaKeyword, category };
    if (isEditMode) {
      await axios.put(`http://localhost:4000/api/v1/blogs/${blogId}`, payload);
    } else {
      await axios.post('http://localhost:4000/api/v1/blogs/create', payload);
    }
    router.push('/dashboard/blog_management');
  };

  return (
    <Box p={4}>
      {[
        { label: 'Title', value: title, setValue: setTitle },
        { label: 'Category', value: category, setValue: setCategory },
        { label: 'Meta Title', value: metaTitle, setValue: setMetaTitle },
        { label: 'Meta Description', value: metaDescription, setValue: setMetaDescription },
        { label: 'Meta Keyword', value: metaKeyword, setValue: setMetaKeyword },
      ].map(({ label, value, setValue }) => (
        <Box key={label} mb={6}>
          <Typography variant="subtitle1">{label}</Typography>
          <TextField fullWidth value={value} onChange={(e) => setValue(e.target.value)} />
        </Box>
      ))}

      <Box mb={6}>
        <Typography variant="subtitle1">Content</Typography>
        <JoditEditor value={content} onChange={setContent} />
      </Box>

      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
}

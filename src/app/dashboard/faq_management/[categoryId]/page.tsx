"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box, Typography, IconButton, Switch, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  isActive: boolean;
}

export default function CategoryFaqPage() {
  const { categoryId } = useParams();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/v1/faqs/category/${categoryId}`).then((res) => {
      setFaqs(res.data.data);
    });
  }, [categoryId]);

  const handleToggleStatus = async (faq: FAQ) => {
    const updatedStatus = !faq.isActive;
    try {
      await axios.put(`http://localhost:4000/api/v1/faqs/${faq._id}/status`, { isActive: updatedStatus });
      setFaqs((prev) => prev.map(f => f._id === faq._id ? { ...f, isActive: updatedStatus } : f));
      toast.success('Status updated successfully');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleEditSave = async () => {
    if (!editingFaq) return;
    try {
      await axios.put(`http://localhost:4000/api/v1/faqs/${editingFaq._id}`, editingFaq);
      setFaqs((prev) => prev.map(f => f._id === editingFaq._id ? editingFaq : f));
      toast.success('FAQ updated successfully');
      setOpen(false);
    } catch {
      toast.error('Failed to update FAQ');
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3}>Manage FAQs</Typography>
      {faqs.map(faq => (
        <Box key={faq._id} display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography fontWeight="bold">{faq.question}</Typography>
            <Typography>{faq.answer}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Switch
              checked={faq.isActive}
              onChange={() => handleToggleStatus(faq)}
            />
            <Button onClick={() => { setEditingFaq(faq); setOpen(true); }}>Edit</Button>
          </Box>
        </Box>
      ))}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Edit FAQ</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth label="Question" margin="normal"
            value={editingFaq?.question || ''}
            onChange={(e) => setEditingFaq(prev => prev && ({ ...prev, question: e.target.value }))}
          />
          <TextField
            fullWidth multiline rows={4} label="Answer" margin="normal"
            value={editingFaq?.answer || ''}
            onChange={(e) => setEditingFaq(prev => prev && ({ ...prev, answer: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

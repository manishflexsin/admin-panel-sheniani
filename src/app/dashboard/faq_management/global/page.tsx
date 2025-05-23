'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  isActive: boolean;
}

export default function GlobalFaqPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/faqs/global');
      setFaqs(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch FAQs');
    }
  };

  const handleToggleStatus = async (faq: FAQ) => {
    const updatedStatus = !faq.isActive;
    try {
      await axios.put(`http://localhost:4000/api/v1/faqs/${faq._id}/status`, {
        isActive: updatedStatus,
      });
      setFaqs((prev) =>
        prev.map((f) => (f._id === faq._id ? { ...f, isActive: updatedStatus } : f))
      );
      toast.success('Status updated successfully');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleEditSave = async () => {
    if (!editingFaq) return;
    try {
      await axios.put(`http://localhost:4000/api/v1/faqs/${editingFaq._id}`, editingFaq);
      setFaqs((prev) =>
        prev.map((f) => (f._id === editingFaq._id ? editingFaq : f))
      );
      toast.success('FAQ updated successfully');
      setOpen(false);
    } catch (err) {
      toast.error('Failed to update FAQ');
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Manage Global FAQs
      </Typography>

      {faqs.map((faq) => (
        <Box
          key={faq._id}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          p={2}
          border="1px solid #ccc"
          borderRadius={2}
        >
          <Box>
            <Typography fontWeight="bold">{faq.question}</Typography>
            <Typography color="text.secondary">{faq.answer}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Switch
              checked={faq.isActive}
              onChange={() => handleToggleStatus(faq)}
              color="primary"
            />
            <Button
              variant="outlined"
              onClick={() => {
                setEditingFaq(faq);
                setOpen(true);
              }}
            >
              Edit
            </Button>
          </Box>
        </Box>
      ))}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit FAQ</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Question"
            margin="normal"
            value={editingFaq?.question || ''}
            onChange={(e) =>
              setEditingFaq((prev) =>
                prev ? { ...prev, question: e.target.value } : prev
              )
            }
          />
          <TextField
            fullWidth
            label="Answer"
            multiline
            rows={4}
            margin="normal"
            value={editingFaq?.answer || ''}
            onChange={(e) =>
              setEditingFaq((prev) =>
                prev ? { ...prev, answer: e.target.value } : prev
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

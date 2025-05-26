'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button, Typography } from '@mui/material';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Category {
  _id: string;
  name_en: string;
  name_ka: string;
  image_url: string;
  status: 'active' | 'inactive';
}

export default function CategoryListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const fetchCategories = async () => {
    const res = await axios.get('http://localhost:4000/api/v1/categories');
    setCategories(res.data.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleStatus = async (id: string, status: 'active' | 'inactive') => {
    try {
      const newStatus = status === 'active' ? 'inactive' : 'active';
      await axios.patch(`http://localhost:4000/api/v1/categories/${id}/status`, { status: newStatus });
      toast.success('Status updated!');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const actionBodyTemplate = (rowData: Category) => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button variant="outlined" size="small" onClick={() => router.push(`/dashboard/category_management/${rowData._id}`)}>Edit</Button>
      <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(rowData._id)}>Delete</Button>
    </div>
  );

  const statusBodyTemplate = (rowData: Category) => (
    <Button
      variant="contained"
      color={rowData.status === 'active' ? 'success' : 'warning'}
      onClick={() => handleToggleStatus(rowData._id, rowData.status)}
    >
      {rowData.status}
    </Button>
  );

  return (
    <div style={{ padding: 24 }}>
      <ToastContainer />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography variant="h4">Manage Categories</Typography>
        <Button variant="contained" onClick={() => router.push('/dashboard/category_management/create')}>Add Category</Button>
      </div>
      <DataTable value={categories} paginator rows={5}>
        <Column field="name_en" header="Name (EN)" style={{ width: '20%' }} />
        <Column field="name_ka" header="Name (KA)" style={{ width: '20%' }} />
        <Column field="image_url" header="Image" body={(rowData: Category) => <img src={rowData.image_url} alt="category" width={60} />} />
        <Column header="Status" body={statusBodyTemplate} style={{ width: '15%' }} />
        <Column header="Actions" body={actionBodyTemplate} style={{ width: '20%' }} />
      </DataTable>
    </div>
  );
}

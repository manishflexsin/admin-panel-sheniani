// "use client";
// import { useState, useEffect, useRef } from 'react';
// import dynamic from 'next/dynamic';
// import axios from 'axios';
// import { Grid, TextField, Typography } from '@mui/material';
// import { Dialog } from 'primereact/dialog';
// import { Button } from 'primereact/button';
// import { Column } from 'primereact/column';
// import { DataTable } from 'primereact/datatable';
// import 'primereact/resources/themes/lara-light-indigo/theme.css';
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';

// const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

// interface Blog {
//     _id?: string;
//     title: string;
//     content: string;
// }

// export default function BlogAdmin() {
//     const [blogs, setBlogs] = useState<Blog[]>([]);
//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');
//     const [editingId, setEditingId] = useState<string | null>(null);
//     const [visible, setVisible] = useState(false);
//     const [isCreating, setIsCreating] = useState(false);

//     useEffect(() => {
//         fetchBlogs();
//     }, []);

//     const fetchBlogs = async () => {
//         const res = await axios.get('http://localhost:4000/api/v1/blogs/getAllBlogs');
//         console.log("res.data.blogs", res.data.data);
//         setBlogs(res.data.data);
//     };

//     const handleDelete = async (id: string | undefined) => {
//         if (!id) return;
//         try {
//             await axios.post(`http://localhost:4000/api/v1/blogs/${id}`);
//             fetchBlogs();
//         } catch (err) {
//             console.error('Failed to delete blog:', err);
//         }
//     };

//     const handleEdit = (blog: Blog) => {
//         setTitle(blog.title);
//         setContent(blog.content);
//         setEditingId(blog._id || null);
//         setIsCreating(false);
//         setVisible(true);
//     };

//     const handleAdd = () => {
//         setTitle('');
//         setContent('');
//         setEditingId(null);
//         setIsCreating(true);
//         setVisible(true);
//     };

//     const handleSave = async () => {
//         if (isCreating) {
//             await axios.post('http://localhost:4000/api/v1/blogs/create', { title, content });
//         } else if (editingId) {
//             await axios.put(`http://localhost:4000/api/v1/blogs/${editingId}`, { title, content });
//         }
//         setVisible(false);
//         setEditingId(null);
//         setTitle('');
//         setContent('');
//         fetchBlogs();
//     };

//     const actionColumnTemplate = (rowData: Blog) => {
//         return (
//             <div className="flex gap-2">
//                 <Button
//                     icon="pi pi-pencil"
//                     className="p-button-rounded p-button-text"
//                     onClick={() => handleEdit(rowData)}
//                 />
//                 <Button
//                     icon="pi pi-trash"
//                     className="p-button-rounded p-button-text p-button-danger"
//                     onClick={() => handleDelete(rowData._id)}
//                 />
//             </div >
//         );

//         // return (
//         //     <Button icon="pi pi-check" />
//         // )
//     };

//     // const actionColumnTemplate = (rowData: Blog) => <span>Edit</span>;

//     return (
//         <div className="p-6">
//             <div className="flex justify-between items-center mb-4">
//                 <h1 className="text-2xl font-bold">Manage Blogs</h1>
//                 <Button label="Add Blog" icon="pi pi-plus" className="p-button-success" onClick={handleAdd} />
//             </div>
//             <DataTable value={blogs}>
//                 <Column field="title" header="Title" style={{ width: '25%' }} />
//                 <Column field="content" header="Content" style={{ width: '60%' }} body={(rowData: Blog) => <div dangerouslySetInnerHTML={{ __html: rowData.content }} />} />
//                 <Column header="Actions" style={{ width: '15%' }} body={actionColumnTemplate} />
//             </DataTable>
//             <Dialog header={isCreating ? 'Add Blog' : 'Edit Blog'} visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
//                 <Grid container spacing={2} mb={2}>
//                     <Grid item xs={3}>
//                         <Typography fontWeight="bold" mt={1}>Title:</Typography>
//                     </Grid>
//                     <Grid item xs={9}>
//                         <TextField
//                             fullWidth
//                             variant="outlined"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                         />
//                     </Grid>

//                     <Grid item xs={3}>
//                         <Typography fontWeight="bold" mt={2}>Content:</Typography>
//                     </Grid>
//                     <Grid item xs={9}>
//                         <JoditEditor value={content} onChange={(newContent) => setContent(newContent)} />
//                     </Grid>
//                 </Grid>

//                 <div style={{ textAlign: 'right' }}>
//                     <Button label="Save" icon="pi pi-check" onClick={handleSave} autoFocus />
//                 </div>
//             </Dialog>
//         </div >
//     );
// }


"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface Blog {
  _id?: string;
  title: string;
  content: string;
}

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/blogs/getAllBlogs');
      setBlogs(res.data.data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    }
  };

  const handleEdit = (id: string | undefined) => {
    if (id) router.push(`/dashboard/blog_management/${id}`);
  };

  const handleAdd = () => {
    router.push('/dashboard/blog_management/create');
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    try {
      await axios.post(`http://localhost:4000/api/v1/blogs/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  const actionColumnTemplate = (rowData: Blog) => (
    <Box display="flex" gap={1}>
      <Button
        variant="outlined"
        size="small"
        onClick={() => handleEdit(rowData._id)}
      >
        Edit
      </Button>
      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={() => handleDelete(rowData._id)}
      >
        Delete
      </Button>
    </Box>
  );

  const contentColumnTemplate = (rowData: Blog) => (
    <div dangerouslySetInnerHTML={{ __html: rowData.content }} />
  );

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Manage Blogs
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add Blog
        </Button>
      </Box>

      <DataTable value={blogs} tableStyle={{ minWidth: '100%' }}>
        <Column field="title" header="Title" style={{ width: '25%' }} />
        <Column header="Content" style={{ width: '60%' }} body={contentColumnTemplate} />
        <Column header="Actions" style={{ width: '15%' }} body={actionColumnTemplate} />
      </DataTable>
    </Box>
  );
}

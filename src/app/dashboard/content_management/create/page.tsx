// 'use client';

// import {
//   Box, Button, TextField, Typography, Grid
// } from '@mui/material';
// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// export default function CreatePage() {
//   const router = useRouter();
//   const [form, setForm] = useState({
//     title_en: '',
//     title_ka: '',
//     content_en: '',
//     content_ka: '',
//     meta_title_en: '',
//     meta_title_ka: '',
//     meta_desc_en: '',
//     meta_desc_ka: '',
//     meta_keywords_en: '',
//     meta_keywords_ka: '',
//     slug: ''
//   });

//   const handleChange = (field: string, value: string) => {
//     setForm({ ...form, [field]: value });
//   };

//   const handleSubmit = async () => {
//     await axios.post('http://localhost:4000/api/v1/pages/create', form);
//     router.push('/dashboard/content_management');
//   };

//   return (
//     <Box p={4}>
//       <Typography variant="h6" mb={3}>Create New Static Page</Typography>
//       <Grid container spacing={2}>
//         {Object.entries(form).map(([key, value]) => (
//           <Grid item xs={12} key={key}>
//             <TextField
//               label={key.replace(/_/g, ' ').toUpperCase()}
//               fullWidth
//               value={value}
//               onChange={(e) => handleChange(key, e.target.value)}
//             />
//           </Grid>
//         ))}
//       </Grid>
//       <Box mt={3}>
//         <Button variant="contained" onClick={handleSubmit}>Create Page</Button>
//       </Box>
//     </Box>
//   );
// }


'use client';

import { TextField, Typography, Button, Box } from '@mui/material';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export default function CreateStaticPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title_en: '', title_ka: '',
        content_en: '', content_ka: '',
        metaTitle_en: '', metaTitle_ka: '',
        metaDesc_en: '', metaDesc_ka: '',
        metaKeywords_en: '', metaKeywords_ka: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditorChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        await axios.post('http://localhost:4000/api/v1/pages/create', formData);
        router.push('/dashboard/static_pages');
    };

    const renderTextField = (label: string, name: string) => (
        <Box mb={4}>
            <Typography fontWeight="bold">{label}</Typography>
            <TextField
                name={name}
                value={(formData as any)[name]}
                onChange={handleChange}
                fullWidth
                variant="outlined"
            />
        </Box>
    );

    const renderEditor = (label: string, name: string) => (
        <Box mb={4}>
            <Typography fontWeight="bold">{label}</Typography>
            <JoditEditor
                value={(formData as any)[name]}
                onChange={(value) => handleEditorChange(name, value)}
            />
        </Box>
    );

    return (
        <Box p={4}>
            <Typography variant="h4" mb={4}>Create Static Page</Typography>
            {renderTextField('Title (English)', 'title_en')}
            {renderTextField('Title (Georgian)', 'title_ka')}
            {renderEditor('Content (English)', 'content_en')}
            {renderEditor('Content (Georgian)', 'content_ka')}
            {renderTextField('Meta Title (English)', 'metaTitle_en')}
            {renderTextField('Meta Title (Georgian)', 'metaTitle_ka')}
            {renderTextField('Meta Description (English)', 'metaDesc_en')}
            {renderTextField('Meta Description (Georgian)', 'metaDesc_ka')}
            {renderTextField('Meta Keywords (English)', 'metaKeywords_en')}
            {renderTextField('Meta Keywords (Georgian)', 'metaKeywords_ka')}
            <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </Box>
    );
}

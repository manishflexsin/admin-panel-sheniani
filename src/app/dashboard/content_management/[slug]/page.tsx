// 'use client';

// import {
//   Box, Button, TextField, Typography, Grid
// } from '@mui/material';
// import { useEffect, useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import axios from 'axios';

// export default function EditPage() {
//   const router = useRouter();
//   const { slug } = useParams();
//   const [form, setForm] = useState<any>({});

//   useEffect(() => {
//     fetchPageData();
//   }, []);

//   const fetchPageData = async () => {
//     const res = await axios.get(`http://localhost:4000/api/v1/pages/${slug}`);
//     setForm(res.data.data);
//   };

//   const handleChange = (field: string, value: string) => {
//     setForm({ ...form, [field]: value });
//   };

//   const handleUpdate = async () => {
//     await axios.put(`http://localhost:4000/api/v1/pages/${slug}`, form);
//     router.push('/dashboard/content_management');
//   };

//   return (
//     <Box p={4}>
//       <Typography variant="h6" mb={3}>Edit Page: {slug}</Typography>
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
//         <Button variant="contained" onClick={handleUpdate}>Save Changes</Button>
//       </Box>
//     </Box>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';
// import dynamic from 'next/dynamic';
// import { Box, Typography, TextField, Button } from '@mui/material';

// const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

// export default function EditStaticPage() {
//     const router = useRouter();
//     const { slug } = useParams();

//     const [formData, setFormData] = useState({
//         title_en: '', title_ka: '',
//         content_en: '', content_ka: '',
//         metaTitle_en: '', metaTitle_ka: '',
//         metaDesc_en: '', metaDesc_ka: '',
//         metaKeywords_en: '', metaKeywords_ka: ''
//     });

//     useEffect(() => {
//         if (slug) fetchPage();
//     }, [slug]);

//     const fetchPage = async () => {
//         try {
//             const res = await axios.get(`http://localhost:4000/api/v1/pages/${slug}`);
//             setFormData(res.data.data);
//         } catch (err) {
//             console.error('Error fetching page:', err);
//         }
//     };

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleEditorChange = (name: string, value: string) => {
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = async () => {
//         try {
//             await axios.put(`http://localhost:4000/api/v1/pages/${slug}`, formData);
//             router.push('/dashboard/static_pages');
//         } catch (err) {
//             console.error('Failed to update page:', err);
//         }
//     };

//     const renderTextField = (label: string, name: string) => (
//         <Box mb={4}>
//             <Typography fontWeight="bold">{label}</Typography>
//             <TextField
//                 name={name}
//                 value={(formData as any)[name]}
//                 onChange={handleChange}
//                 fullWidth
//                 variant="outlined"
//             />
//         </Box>
//     );

//     const renderEditor = (label: string, name: string) => (
//         <Box mb={4}>
//             <Typography fontWeight="bold">{label}</Typography>
//             <JoditEditor
//                 value={(formData as any)[name]}
//                 onChange={(value) => handleEditorChange(name, value)}
//             />
//         </Box>
//     );

//     return (
//         <Box p={4}>
//             <Typography variant="h4" mb={4}>Edit Static Page</Typography>
//             {renderTextField('Title (English)', 'title_en')}
//             {renderTextField('Title (Georgian)', 'title_ka')}
//             {renderEditor('Content (English)', 'content_en')}
//             {renderEditor('Content (Georgian)', 'content_ka')}
//             {renderTextField('Meta Title (English)', 'metaTitle_en')}
//             {renderTextField('Meta Title (Georgian)', 'metaTitle_ka')}
//             {renderTextField('Meta Description (English)', 'metaDesc_en')}
//             {renderTextField('Meta Description (Georgian)', 'metaDesc_ka')}
//             {renderTextField('Meta Keywords (English)', 'metaKeywords_en')}
//             {renderTextField('Meta Keywords (Georgian)', 'metaKeywords_ka')}
//             <Button variant="contained" onClick={handleSubmit}>Update</Button>
//         </Box>
//     );
// }


'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Box, Typography, TextField, Button } from '@mui/material';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

export default function EditStaticPage() {
    const { slug } = useParams();
    const router = useRouter();

    const [formData, setFormData] = useState({
        title_en: '', title_ka: '',
        content_en: '', content_ka: '',
        metaTitle_en: '', metaTitle_ka: '',
        metaDescription_en: '', metaDescription_ka: '',
        metaKeywords_en: '', metaKeywords_ka: ''
    });

    useEffect(() => {
        if (slug) {
            fetchPageData(slug as string);
        }
    }, [slug]);

    const fetchPageData = async (slug: string) => {
        try {
            const res = await axios.get(`http://localhost:4000/api/v1/pages/slug/${slug}`);
            setFormData(res.data.data);
        } catch (err) {
            console.error('Failed to fetch page data:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditorChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            await axios.put(`http://localhost:4000/api/v1/pages/${slug}`, formData);
            router.push('/dashboard/content_management');
        } catch (err) {
            console.error('Failed to update page:', err);
        }
    };

    const renderTextArea = (label: string, name: string) => (
        <Box mb={4}>
            <Typography fontWeight="bold">{label}</Typography>
            <TextField
                name={name}
                value={(formData as any)[name]}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
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
            <Typography variant="h4" mb={4}>Edit Static Page</Typography>
            {renderTextArea('Title (English)', 'title_en')}
            {renderTextArea('Title (Georgian)', 'title_ka')}
            {renderEditor('Content (English)', 'content_en')}
            {renderEditor('Content (Georgian)', 'content_ka')}
            {renderTextArea('Meta Title (English)', 'metaTitle_en')}
            {renderTextArea('Meta Title (Georgian)', 'metaTitle_ka')}
            {renderTextArea('Meta Description (English)', 'metaDescription_en')}
            {renderTextArea('Meta Description (Georgian)', 'metaDescription_ka')}
            {renderTextArea('Meta Keywords (English)', 'metaKeywords_en')}
            {renderTextArea('Meta Keywords (Georgian)', 'metaKeywords_ka')}
            <Button variant="contained" onClick={handleSubmit}>Save Changes</Button>
        </Box>
    );
}

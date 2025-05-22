"use client";
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface Blog {
    _id?: string;
    title: string;
    content: string;
}

export default function BlogAdmin() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        const res = await axios.get('http://localhost:4000/api/v1/blogs/getAllBlogs');
        console.log("res.data.blogs", res.data.data);
        setBlogs(res.data.data);
    };

    const handleDelete = async (id: string | undefined) => {
        if (!id) return;
        try {
            await axios.post(`http://localhost:4000/api/v1/blogs/${id}`);
            fetchBlogs();
        } catch (err) {
            console.error('Failed to delete blog:', err);
        }
    };

    const handleEdit = (blog: Blog) => {
        setTitle(blog.title);
        setContent(blog.content);
        setEditingId(blog._id || null);
        setIsCreating(false);
        setVisible(true);
    };

    const handleAdd = () => {
        setTitle('');
        setContent('');
        setEditingId(null);
        setIsCreating(true);
        setVisible(true);
    };

    const handleSave = async () => {
        if (isCreating) {
            await axios.post('http://localhost:4000/api/v1/blogs/create', { title, content });
        } else if (editingId) {
            await axios.put(`http://localhost:4000/api/v1/blogs/${editingId}`, { title, content });
        }
        setVisible(false);
        setEditingId(null);
        setTitle('');
        setContent('');
        fetchBlogs();
    };

    const actionColumnTemplate = (rowData: Blog) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text"
                    onClick={() => handleEdit(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text p-button-danger"
                    onClick={() => handleDelete(rowData._id)}
                />
            </div >
        );

        // return (
        //     <Button icon="pi pi-check" />
        // )
    };

    // const actionColumnTemplate = (rowData: Blog) => <span>Edit</span>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Manage Blogs</h1>
                <Button label="Add Blog" icon="pi pi-plus" className="p-button-success" onClick={handleAdd} />
            </div>
            <DataTable value={blogs}>
                <Column field="title" header="Title" style={{ width: '25%' }} />
                <Column field="content" header="Content" style={{ width: '60%' }} body={(rowData: Blog) => <div dangerouslySetInnerHTML={{ __html: rowData.content }} />} />
                <Column header="Actions" style={{ width: '15%' }} body={actionColumnTemplate} />
            </DataTable>

            <Dialog header={isCreating ? 'Add Blog' : 'Edit Blog'} visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Blog Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 w-full mb-4"
                    />
                    <JoditEditor value={content} onChange={(newContent) => setContent(newContent)} />
                </div>
                <Button label="Save" icon="pi pi-check" onClick={handleSave} autoFocus />
            </Dialog>
        </div>
    );
}
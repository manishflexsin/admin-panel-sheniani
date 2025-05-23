'use client';

import { useParams } from 'next/navigation';
import BlogForm from '../form';

export default function EditBlogPage() {
  const params = useParams();
  const blogId = params?.id as string;

  return <BlogForm isEditMode={true} blogId={blogId} />;
}
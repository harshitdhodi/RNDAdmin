'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2 } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';
import { useGetAllBlogsQuery ,useDeleteBlogMutation} from '@/slice/blog/blog';
const BlogRow = ({ blog, refetch }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const toggleDetails = () => {
    setIsExpanded((prev) => !prev);
  };
 
  return (
    <TableRow>
      <TableCell >{blog.title}</TableCell>
      <TableCell>{blog.date}</TableCell>
      <TableCell>
        <div
          style={{
            maxHeight: isExpanded ? 'none' : '5em', // Adjust for approximate 5-line height
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: blog.details,
            }}
          />
        </div>
        <button
          onClick={toggleDetails}
          className="text-blue-500 hover:underline mt-2"
        >
          {isExpanded ? 'Show Less' : 'Read More'}
        </button>
      </TableCell>
      <TableCell>
        {blog.image.map((img, index) => (
          <img
            key={index}
            src={`/api/image/download/${img}`}
            alt={`Blog Image ${index + 1}`}
            className="h-10 w-10 object-cover rounded"
          />
        ))}
      </TableCell>
      <TableCell>
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/edit-blog-form/${blog._id}`)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              await deleteBlog(blog._id).unwrap();
              refetch();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};


export default function BlogTable() {
  const { data: blogs, error, isLoading, refetch } = useGetAllBlogsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message || 'An error occurred'}</div>;

  const blogsArray = Array.isArray(blogs) ? blogs : [blogs];

  return (
    <div className="space-y-4">
        <div className="flex justify-end">
        <Link to="/blog-form">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Blog
          </Button>
        </Link>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table className="shadow-none border-none">
          <TableHeader className="bg-gray-200">
            <TableRow>
              <TableHead className="font-semibold text-md text-blue-950">Title</TableHead>
              <TableHead className="font-semibold text-md text-blue-950">Date</TableHead>
              <TableHead className="font-semibold text-md text-blue-950">Details</TableHead>
              <TableHead className="font-semibold text-md text-blue-950">Images</TableHead>
              <TableHead className="font-semibold text-md text-blue-950">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogsArray.map((blog) => (
              <BlogRow key={blog._id} blog={blog} refetch={refetch} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

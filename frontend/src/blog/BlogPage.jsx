import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetAllBlogsQuery, useDeleteBlogMutation } from '@/slice/blog/blog';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Trash, Pencil, Plus } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const BlogTable = () => {
  const { data: blogs, error, isLoading, refetch } = useGetAllBlogsQuery();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState({});

  if (isLoading) return <Skeleton className="h-48 w-full" />;
  if (error) return <div>Error: {error.message || 'An error occurred'}</div>;

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  const toggleDetails = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4 p-5">
        <h2 className='text-2xl font-semibold'>Blogs</h2>
        <Link to="/blog-form">
          <Button className="flex items-center gap-2">
            <Plus size={16} /> Add Blog
          </Button>
        </Link>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs?.map((blog) => (
                <TableRow key={blog._id}>
                  <TableCell className="font-semibold">{blog.title}</TableCell>
                  <TableCell>{blog.date}</TableCell>
                  <TableCell>
                    <div className={cn("overflow-hidden", expandedRows[blog._id] ? "max-h-none" : "max-h-20")}
                         dangerouslySetInnerHTML={{ __html: blog.details }}
                    />
                    <Button variant="link" className="text-blue-600 p-0"
                            onClick={() => toggleDetails(blog._id)}>
                      {expandedRows[blog._id] ? 'Show Less' : 'Read More'}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {blog.image?.length ? (
                      blog.image.map((img, index) => (
                        <img key={index} src={`/api/image/download/${img}`} alt="Blog" className="w-12 h-12 object-cover rounded" />
                      ))
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => navigate(`/edit-blog-form/${blog._id}`)}>
                        <Pencil size={16} />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <p>Are you sure you want to delete this blog?</p>
                          <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline">Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDelete(blog._id)}>Delete</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogTable;
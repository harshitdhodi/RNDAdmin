import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from 'react-toastify';
import { Pencil, Trash2, Download, Plus } from 'lucide-react';

const CareerTable = () => {
  const navigate = useNavigate();
;
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('/api/career/applications');
        setApplications(response.data || []);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch applications.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, [toast]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/career/applications/${deleteId}`);
      setApplications(applications.filter(app => app._id !== deleteId));
      toast({ title: 'Success', description: 'Application deleted successfully!' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete application.', variant: 'destructive' });
    }
  };

  const handleDownload = async (filePath) => {
    try {
      const filename = filePath.split('/').pop();
      const response = await fetch(`/api/image/pdf/download/${filename}`);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to download file.', variant: 'destructive' });
    }
  };

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate('/dashboard')}>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Career Applications</Breadcrumb.Item>
      </Breadcrumb>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold">Career List</h2>
        <Button onClick={() => navigate('/career/add')}>
          <Plus className="mr-2" /> Add New Application
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Info</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Post Applied For</TableCell>
            <TableCell>Resume</TableCell>
            <TableCell>Applied Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((record) => (
            <TableRow key={record._id}>
              <TableCell>
                <strong>{record.name}</strong>
                <div>{record.contactNo}</div>
                <div className="text-gray-500">{record.address}</div>
              </TableCell>
              <TableCell>{record.email}</TableCell>
              <TableCell>{record.postAppliedFor}</TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => handleDownload(record.resumeFile)}>
                  <Download className="text-blue-500" />
                </Button>
              </TableCell>
              <TableCell>{new Date(record.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => navigate(`/career/edit/${record._id}`)}>
                  <Pencil className="text-blue-500" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" onClick={() => setDeleteId(record._id)}>
                      <Trash2 className="text-red-500" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this application? This action cannot be undone.
                    </DialogDescription>
                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CareerTable;
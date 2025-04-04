import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from 'react-toastify';

const PrivacyForm = () => {
  const navigate = useNavigate();
;
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isExistingData, setIsExistingData] = useState(false);
  const [privacyId, setPrivacyId] = useState(null);

  useEffect(() => {
    const fetchPrivacyData = async () => {
      try {
        const response = await axios.get('/api/privacy');
        if (response.data.length > 0) {
          const privacyData = response.data[0];
          setPrivacyPolicy(privacyData.privacyPolicy);
          setPrivacyId(privacyData._id);
          setIsExistingData(true);
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch privacy data', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrivacyData();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isExistingData) {
        await axios.put(`/api/privacy/${privacyId}`, { privacyPolicy });
        toast({ title: 'Success', description: 'Privacy data updated successfully', variant: 'success' });
      } else {
        await axios.post('/api/privacy/add', { privacyPolicy });
        toast({ title: 'Success', description: 'Privacy data created successfully', variant: 'success' });
      }
      navigate('/privacypolicy-terms');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save privacy data', variant: 'destructive' });
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <Breadcrumb items={[
        { label: 'Dashboard', link: '/dashboard' },
        { label: 'Privacy Form' },
      ]} className="mb-4" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-medium text-gray-700">Privacy Policy</label>
          <ReactQuill theme="snow" value={privacyPolicy} onChange={setPrivacyPolicy} />
        </div>
        <Button type="submit" className="w-full">Save</Button>
      </form>
    </Card>
  );
};

export default PrivacyForm;
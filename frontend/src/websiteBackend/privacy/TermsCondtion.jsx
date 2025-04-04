import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { useToast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsConditionForm = () => {
  const navigate = useNavigate();
;
  const [termsCondition, setTermsCondition] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isExistingData, setIsExistingData] = useState(false);
  const [termsConditionId, setTermsConditionId] = useState(null);

  useEffect(() => {
    const fetchTermsConditionData = async () => {
      try {
        const response = await axios.get('/api/terms');
        if (response.data.length > 0) {
          const termsConditionData = response.data[0];
          setTermsCondition(termsConditionData.termsCondition);
          setTermsConditionId(termsConditionData._id);
          setIsExistingData(true);
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch terms and conditions data', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTermsConditionData();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isExistingData) {
        await axios.put(`/api/terms/${termsConditionId}`, { termsCondition });
        toast({ title: 'Success', description: 'Terms and conditions updated successfully' });
      } else {
        await axios.post('/api/terms/add', { termsCondition });
        toast({ title: 'Success', description: 'Terms and conditions created successfully' });
      }
      navigate('/termscondition');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save terms and conditions data', variant: 'destructive' });
    }
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <>
      <Breadcrumb>
        <Link to="/dashboard">Dashboard</Link>
        <span> / Terms and Conditions Form</span>
      </Breadcrumb>
      <Card className="max-w-3xl mx-auto mt-6">
        <CardHeader>
          <CardTitle>Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ReactQuill theme="snow" value={termsCondition} onChange={setTermsCondition} className="h-48" />
            <Button type="submit" className="w-full">Save</Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default TermsConditionForm;
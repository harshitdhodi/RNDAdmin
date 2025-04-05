import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BlogCardForm = () => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [blogCardId, setBlogCardId] = useState(null);
  const [displayContent, setDisplayContent] = useState('');
  const [blogCard, setBlogCard] = useState('');

  const fetchBlogCard = async () => {
    try {
      const response = await axios.get('/api/blogCard/getCard');
      const blogCardData = response.data[0];
      setBlogCardId(blogCardData._id);
      setBlogCard(blogCardData.blogCard);

      const parser = new DOMParser();
      const doc = parser.parseFromString(blogCardData.blogCard, 'text/html');
      const elements = doc.getElementsByTagName('*');
      for (let element of elements) {
        if (element.style.color === 'white' || element.style.color === '#ffffff') {
          element.style.color = 'black';
        }
      }

      setDisplayContent(doc.body.innerHTML);
      setValue('blogCard', blogCardData.blogCard); // set form value
    } catch (error) {
      console.error('Failed to fetch blog card:', error);
      // You can use toast here
    }
  };

  useEffect(() => {
    fetchBlogCard();
  }, []);

  const handleEditorChange = (content) => {
    setBlogCard(content);
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const elements = doc.getElementsByTagName('*');
    for (let element of elements) {
      if (element.style.color === 'white' || element.style.color === '#ffffff') {
        element.style.color = 'black';
      }
    }
    setDisplayContent(doc.body.innerHTML);
    setValue('blogCard', content); // update react-hook-form state
  };

  const onSubmit = async () => {
    try {
      if (blogCardId) {
        await axios.put(`/api/blogCard/editCard/${blogCardId}`, { blogCard });
        toast({ title: 'Success', description: 'Blog card updated successfully!' });
      } else {
        await axios.post('/api/blogCard/addCard', { blogCard });
        toast({ title: 'Success', description: 'Blog card added successfully!' });
      }

      reset();
      setBlogCard('');
      setDisplayContent('');
      fetchBlogCard();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save blog card.', variant: 'destructive' });
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-xl font-bold">Blog Card Form</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="blogCard">Blog Card Content</Label>
            <ReactQuill
              id="blogCard"
              value={displayContent || blogCard}
              onChange={handleEditorChange}
              modules={{
                toolbar: [
                  [{ header: '1' }, { header: '2' }, { font: [] }],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['bold', 'italic', 'underline', 'blockquote'],
                  [{ align: [] }],
                  ['link', 'image', 'video'],
                  ['clean']
                ]
              }}
              formats={[
                'header', 'font', 'list', 'bold', 'italic', 'underline',
                'blockquote', 'align', 'link', 'image', 'video'
              ]}
            />
            {/* Register hidden field so form state includes it */}
            <input type="hidden" {...register('blogCard')} />
          </div>
          <Button type="submit" className="w-full">
            {blogCardId ? 'Update Blog Card' : 'Add Blog Card'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BlogCardForm;

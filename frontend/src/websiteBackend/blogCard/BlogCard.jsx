import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import JoditEditor from 'jodit-react';

const BlogCardForm = () => {
  const [blogCard, setBlogCard] = useState('');
  const [displayContent, setDisplayContent] = useState('');
  const [blogCardId, setBlogCardId] = useState(null);
  const editorRef = useRef(null);

  const config = {
    uploader: { insertImageAsBase64URI: true },
    toolbarAdaptive: false,
    toolbarSticky: false,
    buttons: [
      'bold',
      'italic',
      'underline',
      'ul',
      'ol',
      'fontsize',
      'paragraph',
      'link',
      'image',
      'table',
      'align',
      'font',
      'fontsize',
      'brush',
    ],
    style: {
      color: 'black',
    },
  };

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
    } catch (error) {
      console.error('Failed to fetch blog card:', error);
      alert('Failed to fetch blog card.');
    }
  };

  useEffect(() => {
    fetchBlogCard();
  }, []);

  const handleEditorChange = (newContent) => {
    setBlogCard(newContent);

    const parser = new DOMParser();
    const doc = parser.parseFromString(newContent, 'text/html');
    const elements = doc.getElementsByTagName('*');
    for (let element of elements) {
      if (element.style.color === 'white' || element.style.color === '#ffffff') {
        element.style.color = 'black';
      }
    }
    setDisplayContent(doc.body.innerHTML);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!blogCard) {
      alert('Please enter blog card content.');
      return;
    }

    try {
      if (blogCardId) {
        await axios.put(`/api/blogCard/editCard/${blogCardId}`, { blogCard });
        alert('Blog card updated successfully!');
      } else {
        await axios.post('/api/blogCard/addCard', { blogCard });
        alert('Blog card added successfully!');
      }

      setBlogCard('');
      setDisplayContent('');
      fetchBlogCard();
    } catch (error) {
      console.error('Failed to save blog card:', error);
      alert('Failed to save blog card.');
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Blog Card Content</label>
        <div className="border border-gray-300 rounded-md overflow-hidden">
          <JoditEditor
            ref={editorRef}
            value={displayContent || blogCard}
            config={config}
            onChange={handleEditorChange}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none transition duration-300"
        >
          {blogCardId ? 'Update Blog Card' : 'Add Blog Card'}
        </button>
      </div>
    </form>
  );
};

export default BlogCardForm;

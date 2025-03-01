import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useCreateCatalogueMutation, 
     useGetCatalogueByIdQuery, useUpdateCatalogueMutation } from '@/slice/catalogue/catalogueSlice';
import { useNavigate, useParams } from 'react-router-dom';

const CatalogueForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: catalogue, isLoading: isFetching } = useGetCatalogueByIdQuery(id, { skip: !id });
  const [createCatalogue] = useCreateCatalogueMutation();
  const [updateCatalogue] = useUpdateCatalogueMutation();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (catalogue) {
      form.setFieldsValue(catalogue);
      setFileList([{ url: `/api/catalogues/download/${catalogue.catalogue}`, name: catalogue.catalogue }]);
    }
  }, [catalogue, form]);

  const handleFinish = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    if (fileList[0]?.originFileObj) {
      formData.append('catalogue', fileList[0].originFileObj);
    }

    try {
      if (id) {
        await updateCatalogue({ id, formData }).unwrap();
        message.success('Catalogue updated successfully');
      } else {
        await createCatalogue(formData).unwrap();
        message.success('Catalogue created successfully');
      }
      navigate('/catalogues');
    } catch (error) {
      message.error('Failed to save catalogue');
    }
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList);

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter the title' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="catalogue" label="Catalogue" rules={[{ required: true, message: 'Please upload a catalogue' }]}>
        <Upload
          listType="picture"
          maxCount={1}
          fileList={fileList}
          beforeUpload={() => false}
          onChange={handleFileChange}
        >
          <Button icon={<UploadOutlined />}>Upload Catalogue</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isFetching}>
          {id ? 'Update' : 'Create'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CatalogueForm;
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Upload, Select, Breadcrumb } from 'antd';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGetBannerByIdQuery, useUpdateBannerMutation } from '../../slice/banner/banner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UploadOutlined, HomeOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

const EditBannerForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [imageChanged, setImageChanged] = useState(false);
    const [menuList, setMenuList] = useState([]);
    const [menuLoading, setMenuLoading] = useState(true);
    const { data: banner, isLoading } = useGetBannerByIdQuery(id);
    const [updateBanner] = useUpdateBannerMutation();

    useEffect(() => {
        // Fetch menu list for pageSlug dropdown
        const fetchMenuList = async () => {
            try {
                const response = await axios.get('/api/menulist/get-menu');
                if (response.data.success) {
                    setMenuList(response.data.data);
                } else {
                    message.error('Failed to load menu list');
                }
            } catch (error) {
                console.error('Error fetching menu list:', error);
                message.error('Error fetching menu list');
            } finally {
                setMenuLoading(false);
            }
        };
        fetchMenuList();
    }, []);

    useEffect(() => {
        if (banner) {
            form.setFieldsValue({
                title: banner.title,
                altName: banner.altName,
                details: banner.details,
                imgName: banner.imgName,
                pageSlug: banner.pageSlug || '',
                heading: banner.heading,
                subheading: banner.subheading,
                description: banner.description,
                marque: banner.marque,
                image: banner.image
                    ? [{ name: banner.imgName, url: `/api/image/download/${banner.image}` }]
                    : [],
            });
        }
    }, [banner, form]);

    const handleImageChange = (info) => {
        setImageChanged(true);
        form.setFieldsValue({
            imgName: info.file.name,
            image: info.fileList,
        });
    };

    const onFinish = async (values) => {
        try {
            if (!values.title?.trim()) {
                message.error('Title is required');
                return;
            }
            if (!values.altName?.trim()) {
                message.error('Alt Name is required');
                return;
            }
            if (!values.pageSlug) {
                message.error('Page Slug is required');
                return;
            }

            const formData = new FormData();

            if (imageChanged && values.image?.[0]?.originFileObj) {
                formData.append('image', values.image[0].originFileObj);
                formData.append('imgName', values.image[0].name);
            } else {
                formData.append('imgName', values.imgName || banner.imgName);
            }

            formData.append('title', values.title.trim());
            formData.append('altName', values.altName.trim());
            formData.append('details', values.details?.trim() || '');
            formData.append('pageSlug', values.pageSlug);
            formData.append('heading', values.heading || '');
            formData.append('subheading', values.subheading || '');
            formData.append('description', values.description || '');
            formData.append('marque', values.marque || '');

            await updateBanner({
                id,
                bannerData: formData,
            });

            message.success('Banner updated successfully');
            navigate('/banner-table');
        } catch (error) {
            console.error(error);
            message.error('Failed to update banner');
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <Breadcrumb className='px-4 py-6'>
                <Breadcrumb.Item>
                    <Link to="/dashboard">
                        <HomeOutlined /> Dashboard
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/banner-table">Banner Management</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Edit Banner</Breadcrumb.Item>
            </Breadcrumb>

            <div className='p-6'>
                <h1 className="text-2xl font-bold mb-6">Edit Banner</h1>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        title: banner?.title || '',
                        altName: banner?.altName || '',
                        details: banner?.details || '',
                        imgName: banner?.imgName || '',
                        pageSlug: banner?.pageSlug || '',
                        heading: banner?.heading || '',
                        subheading: banner?.subheading || '',
                        description: banner?.description || '',
                        marque: banner?.marque || '',
                        image: banner?.image
                            ? [{ name: banner.imgName, url: `/api/image/download/${banner.image}` }]
                            : [],
                    }}
                >

                    <Form.Item
                        name="pageSlug"
                        label="Page Slug"
                        rules={[{ required: true, message: 'Please select a page slug!' }]}
                    >
                        <Select placeholder="Select a menu item" loading={menuLoading}>
                            {menuList.map(item => (
                                <React.Fragment key={item._id}>
                                    <Option key={`${item._id}-parent`} value={item.parent.path} className="font-bold">{item.parent.name}</Option>
                                    {item.children && item.children.map(child => (
                                        <React.Fragment key={child._id}>
                                            <Option key={child._id} value={child.path} className="pl-5">
                                                <span> ├── </span>{child.name}
                                            </Option>
                                            {child.subChildren && child.subChildren.map(subChild => (
                                                <Option key={subChild._id} value={subChild.path} className="pl-10">
                                                    <span>├────</span> {subChild.name}
                                                </Option>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="image" label="Banner Image" valuePropName="fileList" getValueFromEvent={(e) => e && e.fileList}>
                        <Upload
                            maxCount={1}
                            listType="picture"
                            beforeUpload={() => false}
                            onChange={handleImageChange}
                            defaultFileList={
                                banner?.image
                                    ? [{ name: banner.imgName, url: `/api/image/download/${banner.image}` }]
                                    : []
                            }
                        >
                            <Button icon={<UploadOutlined />}>
                                {imageChanged ? 'Change Image' : 'Upload New Image'}
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="imgName"
                        label="Image Name"
                        rules={[{ required: true, message: 'Please input image name!' }]}
                    >
                        <Input disabled={imageChanged} />
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: 'Please input title!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="altName"
                        label="Alt Name"
                        rules={[{ required: true, message: 'Please input alt name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="heading"
                        label="Heading"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="subheading"
                        label="Subheading"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item name="marque" label="Marque Text">
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="details"
                        label="Details"
                        rules={[{ message: 'Please input details!' }]}
                    >
                        <ReactQuill theme="snow" />
                    </Form.Item>



                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default EditBannerForm;

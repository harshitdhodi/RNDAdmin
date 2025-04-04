import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGetBannerByIdQuery, useUpdateBannerMutation } from '../../slice/banner/banner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { Home } from 'lucide-react';

// Import shadcn components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const EditBannerForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [imageChanged, setImageChanged] = useState(false);
    const [photoChanged, setPhotoChanged] = useState(false);
    const [menuList, setMenuList] = useState([]);
    const { data: banner, isLoading, refetch } = useGetBannerByIdQuery(id);
    const [updateBanner] = useUpdateBannerMutation();
    
    // Create form with react-hook-form
    const form = useForm({
        defaultValues: {
            title: '',
            altName: '',
            details: '',
            imgName: '',
            pageSlug: '',
            image: null,
            photo: null
        }
    });

    useEffect(() => {
        // Fetch menu list for pageSlug dropdown
        const fetchMenuList = async () => {
            try {
                const response = await axios.get('/api/menulist/get-menu');
                if (response.data.success) {
                    setMenuList(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching menu list:', error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch menu list"
                });
            }
        };
        fetchMenuList();
    }, []);

    useEffect(() => {
        if (banner) {
            form.reset({
                title: banner.title,
                altName: banner.altName,
                details: banner.details,
                imgName: banner.imgName,
                pageSlug: banner.pageSlug || '',
                // We'll handle image and photo separately
            });
        }
    }, [banner, form]);

    const handleImageChange = (event) => {
        setImageChanged(true);
        const file = event.target.files[0];
        if (file) {
            form.setValue('imgName', file.name);
            form.setValue('image', file);
        }
    };

    const handlePhotoChange = (event) => {
        setPhotoChanged(true);
        const file = event.target.files[0];
        if (file) {
            form.setValue('photo', file);
        }
    };

    const onSubmit = async (values) => {
        try {
            if (!values.title?.trim()) {
                toast({
                    variant: "destructive",
                    title: "Validation Error",
                    description: "Title is required"
                });
                return;
            }
            if (!values.altName?.trim()) {
                toast({
                    variant: "destructive",
                    title: "Validation Error",
                    description: "Alt Name is required"
                });
                return;
            }
            if (!values.pageSlug) {
                toast({
                    variant: "destructive",
                    title: "Validation Error",
                    description: "Page Slug is required"
                });
                return;
            }

            const formData = new FormData();

            if (imageChanged && values.image) {
                formData.append('image', values.image);
                formData.append('imgName', values.imgName);
            } else {
                formData.append('imgName', values.imgName || banner.imgName);
            }

            if (photoChanged && values.photo) {
                formData.append('photo', values.photo);
            } else if (banner.photo) {
                formData.append('photo', banner.photo);
            }

            formData.append('title', values.title.trim());
            formData.append('altName', values.altName.trim());
            formData.append('details', values.details?.trim() || '');
            formData.append('pageSlug', values.pageSlug);

            await updateBanner({
                id,
                bannerData: formData,
            });

            toast({
                title: "Success",
                description: "Banner updated successfully"
            });
            refetch();
            navigate('/banner-table');
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update banner"
            });
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading...</div>
        </div>
    );

    return (
        <div className="container mx-auto">
            <Breadcrumb className="py-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/dashboard">
                                <Home className="h-4 w-4 mr-2 inline" />
                                Dashboard
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/banner-table">Banner Management</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink>Edit Banner</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-2xl">Edit Banner</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="pageSlug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Page Slug</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Page Slug" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {menuList.map((menu) => (
                                                    <SelectItem 
                                                        key={menu._id} 
                                                        value={menu.parent.path}
                                                    >
                                                        {menu.parent.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Banner Image</FormLabel>
                                        <FormControl>
                                            <div className="space-y-4">
                                                {banner?.image && !imageChanged && (
                                                    <div className="flex items-center gap-4">
                                                        <img 
                                                            src={`/api/image/download/${banner.image}`} 
                                                            alt={banner.imgName} 
                                                            className="h-20 w-auto rounded"
                                                        />
                                                        <span>{banner.imgName}</span>
                                                    </div>
                                                )}
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="cursor-pointer"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Upload a new image or keep the existing one
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="photo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Photo</FormLabel>
                                        <FormControl>
                                            <div className="space-y-4">
                                                {banner?.photo && !photoChanged && (
                                                    <div className="flex items-center gap-4">
                                                        <img 
                                                            src={`/api/photo/download/${banner.photo}`} 
                                                            alt={banner.photoName} 
                                                            className="h-20 w-auto rounded"
                                                        />
                                                        <span>{banner.photoName}</span>
                                                    </div>
                                                )}
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    className="cursor-pointer"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Upload a new photo or keep the existing one
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="imgName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={imageChanged}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="altName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Alt Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="details"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Details</FormLabel>
                                        <FormControl>
                                            <ReactQuill 
                                                theme="snow" 
                                                value={field.value || ''} 
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="mt-6">
                                Update
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditBannerForm;
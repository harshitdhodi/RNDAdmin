import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    useSubmitApplicationMutation,
    useUpdateApplicationMutation,
    useGetApplicationByIdQuery
} from '../../slice/career/CareerForm';
import { Upload } from 'lucide-react';

// Import shadcn components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const CareerAdminForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const [resumeFile, setResumeFile] = useState(null);
    const [existingResume, setExistingResume] = useState(null);

    // API hooks
    const [submitApplication] = useSubmitApplicationMutation();
    const [updateApplication] = useUpdateApplicationMutation();
    const { data: editData, isLoading: isLoadingEdit } = useGetApplicationByIdQuery(id, {
        skip: !isEditMode
    });

    // Initialize form with react-hook-form
    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            contactNo: '',
            address: '',
            postAppliedFor: '',
            resumeFile: null
        }
    });

    // Set form values when editing
    useEffect(() => {
        if (isEditMode && editData?.data) {
            form.reset({
                name: editData.data.name,
                email: editData.data.email,
                contactNo: editData.data.contactNo,
                address: editData.data.address,
                postAppliedFor: editData.data.postAppliedFor,
            });
            
            // Set existing resume file
            if (editData.data.resumeFile) {
                setExistingResume({
                    name: editData.data.resumeFile.split('/').pop(),
                    url: editData.data.resumeFile,
                });
            }
        }
    }, [editData, form, isEditMode]);

    const onSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('contactNo', values.contactNo);
            formData.append('address', values.address);
            formData.append('postAppliedFor', values.postAppliedFor);

            // Only append file if a new one is uploaded
            if (resumeFile) {
                formData.append('resumeFile', resumeFile);
            }

            if (isEditMode) {
                await updateApplication({ id, formData }).unwrap();
                toast({
                    title: "Success",
                    description: "Application updated successfully!"
                });
            } else {
                await submitApplication(formData).unwrap();
                toast({
                    title: "Success",
                    description: "Application submitted successfully!"
                });
            }
            navigate('/career-table');
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Something went wrong"
            });
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                toast({
                    variant: "destructive",
                    title: "Invalid File",
                    description: "You can only upload PDF files!"
                });
                event.target.value = '';
                return;
            }
            setResumeFile(file);
            form.setValue('resumeFile', file.name);
            setExistingResume(null);
        }
    };

    if (isLoadingEdit) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading...</div>
        </div>
    );

    return (
        <div className="container mx-auto p-6">
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink 
                            onClick={() => navigate('/dashboard')}
                            className="cursor-pointer"
                        >
                            Dashboard
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink 
                            onClick={() => navigate('/career-table')}
                            className="cursor-pointer"
                        >
                            Career Applications
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink>{isEditMode ? 'Edit Application' : 'Add Application'}</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle>{isEditMode ? 'Edit Application' : 'Add New Application'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                rules={{ 
                                    required: "Please enter name",
                                    minLength: {
                                        value: 2,
                                        message: "Name must be at least 2 characters"
                                    }
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                rules={{
                                    required: "Please enter email",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Please enter a valid email"
                                    }
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="contactNo"
                                rules={{
                                    required: "Please enter contact number",
                                    pattern: {
                                        value: /^[0-9]{10}$/,
                                        message: "Please enter a valid 10-digit number"
                                    }
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Number</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                rules={{
                                    required: "Please enter address",
                                    minLength: {
                                        value: 5,
                                        message: "Address must be at least 5 characters"
                                    }
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Textarea rows={4} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="postAppliedFor"
                                rules={{ required: "Please enter post applied for" }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Post Applied For</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="resumeFile"
                                rules={{ 
                                    required: !isEditMode && !existingResume ? "Please upload resume" : false 
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Resume</FormLabel>
                                        <FormControl>
                                            <div className="space-y-4">
                                                {existingResume && (
                                                    <div className="flex items-center p-2 bg-slate-100 rounded">
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">{existingResume.name}</p>
                                                            <p className="text-xs text-gray-500">Existing resume</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-4">
                                                    <Button 
                                                        type="button" 
                                                        variant="outline"
                                                        className="cursor-pointer"
                                                        onClick={() => document.getElementById('resume-upload').click()}
                                                    >
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        {existingResume || resumeFile ? 'Replace Resume' : 'Upload Resume'}
                                                    </Button>
                                                    <Input
                                                        id="resume-upload"
                                                        type="file"
                                                        accept="application/pdf"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                    {resumeFile && (
                                                        <span className="text-sm">{resumeFile.name}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Only PDF files are accepted
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={isLoadingEdit}>
                                    {isEditMode ? 'Update' : 'Submit'}
                                </Button>
                                <Button 
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/career-table')}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CareerAdminForm;
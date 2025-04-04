import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";
import { useAddInquiryMutation, useGetInquiryByIdQuery, useUpdateInquiryMutation } from "@/slice/inquiry/inquiry";
import { useNavigate, useParams } from 'react-router-dom';
import { BreadcrumbWithCustomSeparator } from '@/breadCrumb/BreadCrumb';
import { useGetAllStatusesQuery } from '@/slice/status/status';

const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Inquiry Table", href: "/inquiry-list" },
    { label: "Inquiry Form", href: null },
]

export default function EditInquiryForm({ onClose }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: inquiryData, isLoading: isFetching } = useGetInquiryByIdQuery(id);
    const [updateInquiry, { isLoading }] = useUpdateInquiryMutation();
    const { data: statusesData, isLoading: isLoadingStatuses } = useGetAllStatusesQuery();

    const form = useForm({
        defaultValues: {
            companyName: "",
            name: "",
            email: "",
            mobile: "",
            address: "",
            status: "New Inquiry"
        }
    });

    // Custom validation function
    const validateForm = (data) => {
        const errors = {};

        if (!data.companyName || data.companyName.length < 2) {
            errors.companyName = "Company name must be at least 2 characters";
        }

        if (!data.name || data.name.length < 2) {
            errors.name = "Full name must be at least 2 characters";
        }

        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = "Invalid email address";
        }

        if (!data.mobile || !/^[0-9]{10}$/.test(data.mobile)) {
            errors.mobile = "Mobile number must be 10 digits";
        }

        if (!data.address || data.address.length < 2) {
            errors.address = "Address must be at least 2 characters";
        }

        if (!data.status) {
            errors.status = "Please select a status";
        }

        return errors;
    };

    useEffect(() => {
        if (inquiryData) {
            form.reset({
                companyName: inquiryData.companyName || "",
                name: inquiryData.name || "",
                email: inquiryData.email || "",
                mobile: inquiryData.mobile || "",
                address: inquiryData.address || "",
                status: inquiryData.status || "New Inquiry"
            });
        }
    }, [inquiryData, form]);

    const onSubmit = async (data) => {
        const validationErrors = validateForm(data);
        
        if (Object.keys(validationErrors).length > 0) {
            Object.keys(validationErrors).forEach(field => {
                form.setError(field, { type: 'manual', message: validationErrors[field] });
            });
            return;
        }

        try {
            const response = await updateInquiry({ id, ...data }).unwrap();
            form.reset();
            navigate('/inquiry-list');
        } catch (error) {
            alert({
                title: "Error",
                description: error?.data?.message || "Failed to update inquiry",
                variant: "destructive"
            });
        }
    };

    if (isFetching) return <div>Loading...</div>;

    return (
        <>
            <div className="ml-1">
                <BreadcrumbWithCustomSeparator items={breadcrumbItems} />
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
                    <h2 className="text-xl font-semibold mb-4">Update Inquiry</h2>
                    
                    <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Enter company name" 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Enter full name" 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="email"
                                        placeholder="Enter email" 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="tel"
                                        placeholder="Enter 10-digit mobile" 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Enter address" 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {statusesData?.data?.map((statusItem) => (
                                            <SelectItem key={statusItem._id} value={statusItem.status}>
                                                {statusItem.status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button 
                            type="submit" 
                            disabled={isLoading}
                        >
                            {isLoading ? "Updating..." : "Update Inquiry"}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
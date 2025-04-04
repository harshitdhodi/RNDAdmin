import React from 'react';
import { useForm } from 'react-hook-form';
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
import { useAddInquiryMutation } from "@/slice/inquiry/inquiry";
import { useGetAllSourcesQuery } from "@/slice/source/source";
import { useNavigate } from 'react-router-dom';
import { useGetAllStatusesQuery } from '@/slice/status/status';
import { BreadcrumbWithCustomSeparator } from '@/breadCrumb/BreadCrumb';

const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Inquiry Table", href: "/inquiry-list" },
    { label: "Inquiry Form", href: null },
]

export default function AddInquiryForm({ onClose }) {
    const [addInquiry, { isLoading: isAdding }] = useAddInquiryMutation();
    const { data: statuses, isLoading: statusesLoading } = useGetAllStatusesQuery();
    const { data: sources, isLoading: sourcesLoading } = useGetAllSourcesQuery();
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            organisation: "",
            department: "",
            email: "",
            phone: "",
            address: "",
            country: "",
            message: "",
            needCallback: false,
            status: "",
            source: ""
        }
    });

    // Custom validation function
    const validateForm = (data) => {
        const errors = {};

        if (!data.firstName || data.firstName.length < 2) {
            errors.firstName = "First name must be at least 2 characters";
        }

        if (!data.lastName || data.lastName.length < 2) {
            errors.lastName = "Last name must be at least 2 characters";
        }

        if (!data.organisation || data.organisation.length < 2) {
            errors.organisation = "Organisation name must be at least 2 characters";
        }

        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = "Invalid email address";
        }

        if (!data.phone || !/^[0-9]{10}$/.test(data.phone)) {
            errors.phone = "Phone number must be 10 digits";
        }

        if (!data.message || data.message.length < 10) {
            errors.message = "Message must be at least 10 characters";
        }

        if (!data.status) {
            errors.status = "Please select a status";
        }

        if (!data.source) {
            errors.source = "Please select a source";
        }

        return errors;
    };

    const onSubmit = async (data) => {
        const validationErrors = validateForm(data);
        
        if (Object.keys(validationErrors).length > 0) {
            Object.keys(validationErrors).forEach(field => {
                form.setError(field, { type: 'manual', message: validationErrors[field] });
            });
            return;
        }

        try {
            const inquiryData = {
                ...data,
                date: new Date().toISOString().split('T')[0]
            };

            await addInquiry(inquiryData).unwrap();
            form.reset();
            navigate('/inquiry-list');
        } catch (error) {
            alert(error?.data?.message || "Failed to add inquiry.");
        }
    };

    return (
        <>
            <div className="ml-1">
                <BreadcrumbWithCustomSeparator items={breadcrumbItems} />
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
                    <h2 className="text-xl font-semibold mb-4">Add New Inquiry</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="organisation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Organisation</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter organisation name" {...field} />
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
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input
                                        type="tel"
                                        placeholder="Enter 10-digit phone"
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
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter country"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter message"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="needCallback"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Need Callback</FormLabel>
                                <FormControl>
                                    <Input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
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
                                {statusesLoading ? (
                                    <div>Loading statuses...</div>
                                ) : (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {statuses?.data?.map((status) => (
                                                <SelectItem key={status._id} value={status.status}>
                                                    {status.status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Source</FormLabel>
                                {sourcesLoading ? (
                                    <div>Loading sources...</div>
                                ) : (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select source" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sources?.data?.map((source) => (
                                                <SelectItem key={source._id} value={source.source}>
                                                    {source.source}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="submit"
                            disabled={isAdding}
                        >
                            {isAdding ? "Adding..." : "Add Inquiry"}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}
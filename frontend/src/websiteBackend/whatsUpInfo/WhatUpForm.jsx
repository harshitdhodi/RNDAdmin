import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { toast } from 'react-toastify';
import { useGetWhatsUpInfoQuery, useUpdateWhatsUpInfoByIdMutation } from '@/slice/whatsUpInfo/WhatsUpInfo';

const WhatsUpInfoForm = ({ onClose }) => {
    const { register, handleSubmit, setValue } = useForm();
    const { data: whatsUpInfo, isLoading, refetch } = useGetWhatsUpInfoQuery();
    const [updateWhatsUpInfoById, { isLoading: isUpdating }] = useUpdateWhatsUpInfoByIdMutation();

    useEffect(() => {
        if (whatsUpInfo && whatsUpInfo.length > 0) {
            setValue("message", whatsUpInfo[0].message);
            setValue("number", whatsUpInfo[0].number);
        }
    }, [whatsUpInfo, setValue]);

    const onSubmit = async (values) => {
        try {
            if (!whatsUpInfo || whatsUpInfo.length === 0 || !whatsUpInfo[0]._id) {
                throw new Error("Invalid data: Missing _id");
            }

            await updateWhatsUpInfoById({ id: whatsUpInfo[0]._id, ...values }).unwrap();
            await refetch();
            toast.success('WhatsUp Info updated successfully!');
            onClose();
        } catch (error) {
            console.error('Failed to update WhatsUp Info:', error);
            toast.error(error.message || 'Failed to update WhatsUp Info.');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Breadcrumb className="mb-5">
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>WhatsUp Info</Breadcrumb.Item>
            </Breadcrumb>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className="block text-sm font-medium">Message</label>
                    <Textarea {...register("message", { required: "Please input the message!" })} />
                </div>

                <div>
                    <label className="block text-sm font-medium">Number</label>
                    <Input
                        {...register("number", {
                            required: "Please input the number!",
                            pattern: { value: /^[0-9]+$/, message: "Number must contain only digits!" },
                        })}
                    />
                </div>

                <Button type="submit" disabled={isUpdating} className="mt-2">
                    {isUpdating ? "Updating..." : "Update"}
                </Button>
            </form>
        </div>
    );
};

export default WhatsUpInfoForm;

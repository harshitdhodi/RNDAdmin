import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

// shadcn components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';

// API hooks
import { 
  useCreateWorldwideMutation,
  useUpdateWorldwideMutation,
  useGetWorldwideByIdQuery
} from '../../slice/worldwide/worldwide';

const WorldwideForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const form = useForm({
    defaultValues: {
      category: 'international',
      name: '',
      state: '',
      cities: ''
    }
  });

  const [createWorldwide, { isLoading: isCreating }] = useCreateWorldwideMutation();
  const [updateWorldwide, { isLoading: isUpdating }] = useUpdateWorldwideMutation();
  const { data: editData, isLoading: isLoadingEdit } = useGetWorldwideByIdQuery(id, {
    skip: !isEditMode
  });

  // Set form values when editing
  useEffect(() => {
    if (isEditMode && editData?.data) {
      // Handle cities array conversion to string for textarea
      const formData = { ...editData.data };
      if (Array.isArray(formData.cities)) {
        formData.cities = formData.cities.join('\n');
      }
      form.reset(formData);
    }
  }, [editData, form, isEditMode]);

  const onSubmit = async (values) => {
    try {
      // Transform cities from textarea string to array
      const formattedValues = { ...values };
      if (formattedValues.cities) {
        formattedValues.cities = formattedValues.cities
          .split('\n')
          .filter(city => city.trim() !== '')
          .slice(0, 5);
      }

      if (isEditMode) {
        await updateWorldwide({ id, data: formattedValues }).unwrap();
        toast.success('Location updated successfully!');
      } else {
        await createWorldwide(formattedValues).unwrap();
        toast.success('Location added successfully!');
      }
      navigate('/worldwide-table');
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  const isLoading = isCreating || isUpdating || isLoadingEdit;

  const watchCategory = form.watch('category');
  const showIndiaFields = watchCategory === 'india';

  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigate('/dashboard')} className="cursor-pointer">
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigate('/worldwide-table')} className="cursor-pointer">
            Worldwide Locations
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          {isEditMode ? 'Edit Location' : 'Add Location'}
        </BreadcrumbItem>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Location' : 'Add New Location'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="international">International</SelectItem>
                        <SelectItem value="india">India</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Please enter country name" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showIndiaFields && (
                <>
                  <FormField
                    control={form.control}
                    name="state"
                    rules={{ required: "Please enter state" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cities"
                    rules={{ required: "Please enter at least one city" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cities (Enter up to 5 cities, one per line)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter cities, one per line"
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isEditMode ? 'Update' : 'Submit'}
                </Button>
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => navigate('/worldwide-table')}
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

export default WorldwideForm;
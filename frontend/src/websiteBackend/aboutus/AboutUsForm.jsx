import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  useCreateAboutUsMutation, 
  useUpdateAboutUsMutation,
  useGetAboutUsByIdQuery 
} from '../../slice/aboutUs/aboutUs';

// Shadcn/UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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
  SelectValue
} from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

// Rich Text Editor
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Skeleton } from '@/components/ui/skeleton';

const AboutUsForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [autoSlug, setAutoSlug] = useState('');
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  
  // Setup form
  const form = useForm({
    defaultValues: {
      title: '',
      shortDescription: '',
      description: '',
      imageTitle: '',
      altName: '',
      section: '',
      slug: '',
    }
  });

  // API hooks
  const { 
    data: aboutUsData, 
    isLoading: isLoadingData 
  } = useGetAboutUsByIdQuery(id, { skip: !id });

  const [createAboutUs, { isLoading: isCreating }] = useCreateAboutUsMutation();
  const [updateAboutUs, { isLoading: isUpdating }] = useUpdateAboutUsMutation();

  const isSubmitting = isCreating || isUpdating;

  // Set form values when data is fetched
  useEffect(() => {
    if (aboutUsData) {
      form.reset({
        title: aboutUsData.title,
        shortDescription: aboutUsData.shortDescription,
        description: aboutUsData.description,
        imageTitle: aboutUsData.imageTitle,
        altName: aboutUsData.altName,
        section: aboutUsData.section,
        slug: aboutUsData.slug,
      });
      setAutoSlug(aboutUsData.slug);
      setIsCustomSlug(aboutUsData.slug !== aboutUsData.section.toLowerCase().replace(/\s+/g, '-'));

      // Set existing image
      if (aboutUsData.image) {
        setFileList([{
          id: aboutUsData.image,
          name: 'Current Image',
          preview: `/api/image/download/${aboutUsData.image}`,
        }]);
      }
    }
  }, [aboutUsData, form]);

  // Auto-generate slug when section changes
  useEffect(() => {
    const sectionValue = form.watch('section');
    if (sectionValue && !isCustomSlug) {
      const generatedSlug = sectionValue.toLowerCase().replace(/\s+/g, '-');
      setAutoSlug(generatedSlug);
      form.setValue('slug', generatedSlug);
    }
  }, [form.watch('section'), isCustomSlug, form]);

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': ['', 'center', 'right', 'justify'] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('shortDescription', values.shortDescription);
      formData.append('description', values.description);
      formData.append('imageTitle', values.imageTitle);
      formData.append('altName', values.altName);
      formData.append('section', values.section);
      formData.append('slug', values.slug);
      
      if (fileList[0]?.file) {
        formData.append('image', fileList[0].file);
      }

      if (id) {
        await updateAboutUs({ id, formData }).unwrap();
        toast({
          title: "Success",
          description: "About Us updated successfully",
        });
      } else {
        await createAboutUs(formData).unwrap();
        toast({
          title: "Success",
          description: "About Us created successfully",
        });
      }

      navigate('/about-us-table');
    } catch (error) {
      const errorMessage = error.data?.error || `Failed to ${id ? 'update' : 'create'} About Us entry`;
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "You can only upload image files!",
        variant: "destructive",
      });
      return;
    }
    
    setFileList([{
      id: Date.now().toString(),
      name: file.name,
      file,
      preview: URL.createObjectURL(file)
    }]);
  };

  const removeFile = () => {
    setFileList([]);
  };

  if (isLoadingData && id) {
    return (
      <div className="flex justify-center items-center h-64">
        <Skeleton className="w-8 h-8" />
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/dashboard')}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/about-us-table')}>About Us</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>{id ? 'Edit About Us' : 'Create About Us'}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <CardTitle>{id ? 'Edit About Us' : 'Create About Us'}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (!isCustomSlug) {
                        const newSlug = value.toLowerCase().replace(/\s+/g, '-');
                        setAutoSlug(newSlug);
                        form.setValue('slug', newSlug);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a section" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Introduction">Introduction</SelectItem>
                      <SelectItem value="Mission Vision">Mission Vision</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              rules={{
                required: "Slug is required",
                pattern: {
                  value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                  message: "Slug can only contain lowercase letters, numbers, and hyphens"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Slug</FormLabel>
                    <Button 
                      variant="outline" 
                      size="sm"
                      type="button"
                      onClick={() => {
                        setIsCustomSlug(!isCustomSlug);
                        if (!isCustomSlug) {
                          // Keep current value when switching to custom
                          const currentSlug = form.getValues('slug');
                          setAutoSlug(currentSlug);
                        } else {
                          // Regenerate slug when switching back to auto
                          const sectionValue = form.getValues('section');
                          if (sectionValue) {
                            const newSlug = sectionValue.toLowerCase().replace(/\s+/g, '-');
                            setAutoSlug(newSlug);
                            form.setValue('slug', newSlug);
                          }
                        }
                      }}
                    >
                      {isCustomSlug ? 'Use Auto Slug' : 'Customize Slug'}
                    </Button>
                  </div>
                  <FormControl>
                    <Input 
                      {...field}
                      disabled={!isCustomSlug}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        if (isCustomSlug) {
                          setAutoSlug(e.target.value);
                        }
                      }}
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
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <div className="mb-12">
                      <ReactQuill 
                        modules={quillModules}
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        className="h-32"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="mb-12">
                      <ReactQuill 
                        modules={quillModules}
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        className="h-64"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <div className="flex items-center space-x-2">
                <Label 
                  htmlFor="image-upload" 
                  className="cursor-pointer flex items-center gap-2 border rounded-md px-3 py-2 hover:bg-gray-100"
                >
                  <Upload className="w-4 h-4" />
                  <span>{id ? 'Change Image' : 'Click to Upload'}</span>
                </Label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              
              {fileList.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="relative border rounded-md p-2 flex items-center">
                    <img 
                      src={fileList[0].preview} 
                      alt="Preview" 
                      className="h-12 w-auto object-contain"
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium">{fileList[0].name}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={removeFile}
                        className="text-xs text-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="imageTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Title</FormLabel>
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

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {id ? 'Update' : 'Submit'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AboutUsForm;
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCreateBannerMutation } from '../../slice/banner/banner';
import axios from 'axios';

// Rich Text Editor
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Shadcn/UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { toast } from 'react-toastify';
import { Loader2, Home, Upload } from 'lucide-react';

const AddBannerForm = () => {
  const navigate = useNavigate();
  const [createBanner, { isLoading: isSubmitting }] = useCreateBannerMutation();
  const [imagePreview, setImagePreview] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Setup form
  const form = useForm({
    defaultValues: {
      title: '',
      altName: '',
      details: '',
      pageSlug: '',
      imgName: ''
    }
  });

  useEffect(() => {
    const fetchMenuList = async () => {
      try {
        const response = await axios.get('/api/menulist/get-menu');
        if (response.data.success) {
          setMenuList(response.data.data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load menu list",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching menu list:', error);
        toast({
          title: "Error",
          description: "Error fetching menu list",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMenuList();
  }, []);

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      
      if (values.image?.[0]) {
        formData.append('image', values.image[0]);
        formData.append('imgName', values.imgName);
      } else {
        toast({
          title: "Error",
          description: "Please select an image",
          variant: "destructive",
        });
        return;
      }

      if (values.photo?.[0]) {
        formData.append('photo', values.photo[0]);
      } else {
        toast({
          title: "Error",
          description: "Please select a photo",
          variant: "destructive",
        });
        return;
      }

      formData.append('title', values.title);
      formData.append('altName', values.altName);
      formData.append('details', values.details);
      formData.append('pageSlug', values.pageSlug);

      await createBanner(formData).unwrap();
      toast({
        title: "Success",
        description: "Banner created successfully",
      });
      navigate('/banner-table');
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create banner",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Update form value
      form.setValue('image', [file]);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Update form value
      form.setValue('photo', [file]);
    }
  };

  // Group menu items by hierarchy for select options
  const renderMenuOptions = () => {
    return menuList.map(menu => (
      <SelectGroup key={menu._id}>
        <SelectLabel>{menu.parent.name}</SelectLabel>
        {menu.children.map(child => (
          <React.Fragment key={child._id}>
            <SelectItem value={child.path}>
              {child.name}
            </SelectItem>
            {child.subChildren.map(subChild => (
              <SelectItem key={subChild._id} value={subChild.path} className="pl-6">
                {subChild.name}
              </SelectItem>
            ))}
          </React.Fragment>
        ))}
      </SelectGroup>
    ));
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard">
                  <Home className="h-4 w-4 mr-1 inline" />
                  Dashboard
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/banner-table">Banner Management</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>Add New Banner</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <CardTitle className="text-2xl">Add New Banner</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pageSlug"
              rules={{ required: "Please select a page slug!" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page Slug</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a menu item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {renderMenuOptions()}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label htmlFor="image-upload">Banner Image</Label>
              <div className="flex items-center space-x-2">
                <Label 
                  htmlFor="image-upload" 
                  className="cursor-pointer flex items-center gap-2 border rounded-md px-3 py-2 hover:bg-gray-100"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </Label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              
              {imagePreview && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="border rounded-md p-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-20 w-auto object-contain"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setImagePreview(null);
                      form.setValue('image', null);
                    }}
                    className="text-red-600"
                  >
                    Remove
                  </Button>
                </div>
              )}
              {form.formState.errors.image && (
                <p className="text-sm font-medium text-red-500">{form.formState.errors.image.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo-upload">Photo</Label>
              <div className="flex items-center space-x-2">
                <Label 
                  htmlFor="photo-upload" 
                  className="cursor-pointer flex items-center gap-2 border rounded-md px-3 py-2 hover:bg-gray-100"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </Label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              
              {photoPreview && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="border rounded-md p-2">
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="h-20 w-auto object-contain"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setPhotoPreview(null);
                      form.setValue('photo', null);
                    }}
                    className="text-red-600"
                  >
                    Remove
                  </Button>
                </div>
              )}
              {form.formState.errors.photo && (
                <p className="text-sm font-medium text-red-500">{form.formState.errors.photo.message}</p>
              )}
            </div>

            <FormField
              control={form.control}
              name="imgName"
              rules={{ required: "Please input image name!" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
              rules={{ required: "Please input alt name!" }}
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
                    <div className="mb-12">
                      <ReactQuill 
                        theme="snow"
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    </div>
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
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddBannerForm;
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetCustomerByIdQuery, useUpdateCustomerMutation } from '@/slice/customerSlice/customerApiSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { BreadcrumbWithCustomSeparator } from '@/breadCrumb/BreadCrumb';
import { toast } from 'react-toastify';

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Customer Table", href: "/customer-table" },
  { label: "Edit Customer", href: null },
];

export default function EditCustomerForm() {
  const { id } = useParams();
  const { data: customerData, isLoading: isFetching } = useGetCustomerByIdQuery(id);
  const [updateCustomer, { isLoading }] = useUpdateCustomerMutation();
  const navigate = useNavigate();

  const [countries] = useState([
    { isoCode: 'US', name: 'United States' },
    { isoCode: 'CA', name: 'Canada' },
    { isoCode: 'UK', name: 'United Kingdom' },
    { isoCode: 'IN', name: 'India' },
    { isoCode: 'AU', name: 'Australia' }
  ]);
  
  const countryStates = {
    'US': [
      { isoCode: 'NY', name: 'New York' },
      { isoCode: 'CA', name: 'California' },
      { isoCode: 'TX', name: 'Texas' }
    ],
    'IN': [
      { isoCode: 'MH', name: 'Maharashtra' },
      { isoCode: 'DL', name: 'Delhi' },
      { isoCode: 'KA', name: 'Karnataka' }
    ],
  };
  
  const stateCities = {
    'NY': [{ name: 'New York City' }, { name: 'Buffalo' }],
    'CA': [{ name: 'Los Angeles' }, { name: 'San Francisco' }],
    'MH': [{ name: 'Mumbai' }, { name: 'Pune' }],
  };
  
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      name: '',
      contactPerson: '',
      email: '',
      mobile: '',
      website: '',
      address: '',
      country: '',
      state: '',
      city: '',
      description: '',
      image: null
    }
  });

  const watchCountry = watch('country');
  const watchState = watch('state');
  const watchImage = watch('image');

  useEffect(() => {
    if (watchCountry) {
      const stateList = countryStates[watchCountry] || [];
      setStates(stateList);
      if (!customerData) {
        setValue('state', '');
        setValue('city', '');
      }
    } else {
      setStates([]);
      setCities([]);
    }
  }, [watchCountry, setValue, customerData]);

  useEffect(() => {
    if (watchState) {
      const cityList = stateCities[watchState] || [];
      setCities(cityList);
      if (!customerData) {
        setValue('city', '');
      }
    } else {
      setCities([]);
    }
  }, [watchState, setValue, customerData]);

  useEffect(() => {
    if (customerData?.data) {
      const fields = [
        'name', 'contactPerson', 'email', 'mobile', 'website',
        'address', 'country', 'state', 'city', 'description', 'image'
      ];
      
      fields.forEach(field => {
        if (customerData.data[field] !== undefined) {
          setValue(field, customerData.data[field] || '');
        }
      });
    }
  }, [customerData, setValue]);

  const validateForm = (data) => {
    let isValid = true;
    clearErrors();

    // Name validation
    if (!data.name.trim()) {
      setError('name', { message: 'Customer name is required' });
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email) {
      setError('email', { message: 'Email is required' });
      isValid = false;
    } else if (!emailRegex.test(data.email)) {
      setError('email', { message: 'Invalid email address' });
      isValid = false;
    }

    // Mobile validation
    if (!data.mobile.trim()) {
      setError('mobile', { message: 'Mobile number is required' });
      isValid = false;
    }

    // Website validation (if provided)
    if (data.website) {
      const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*\/?$/;
      if (!urlRegex.test(data.website)) {
        setError('website', { message: 'Invalid URL' });
        isValid = false;
      }
    }

    return isValid;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setValue('image', file);
    }
  };

  const onSubmit = async (data) => {
    if (!validateForm(data)) {
      return;
    }

    try {
      const formData = new FormData();
      
      Object.keys(data).forEach(key => {
        if (key !== 'image') {
          formData.append(key, data[key] || '');
        }
      });

      if (data.image instanceof File) {
        formData.append('image', data.image);
      }

      formData.append('id', id);

      const result = await updateCustomer({ 
        id, 
        data: formData 
      }).unwrap();

      toast.success("Customer updated successfully");
      navigate('/customer-table');
    } catch (err) {
      console.error('Error structure:', err);
      toast.error(err.message || "Failed to update customer");
    }
  };

  if (isFetching) return <div>Loading...</div>;

  return (
    <>
      <div className="ml-1">
        <BreadcrumbWithCustomSeparator items={breadcrumbItems} />
      </div>
      <Card className="w-full mt-4 mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-purple-700">Edit Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Customer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  {...register('contactPerson')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">
                  Mobile Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mobile"
                  {...register('mobile')}
                  className={errors.mobile ? 'border-red-500' : ''}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm">{errors.mobile.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  {...register('website')}
                  className={errors.website ? 'border-red-500' : ''}
                />
                {errors.website && (
                  <p className="text-red-500 text-sm">{errors.website.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={watchCountry}
                  onValueChange={(value) => setValue('country', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Select
                  value={watchState}
                  onValueChange={(value) => setValue('state', value)}
                  disabled={!watchCountry || states.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select
                  value={watch('city')}
                  onValueChange={(value) => setValue('city', value)}
                  disabled={!watchState || cities.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.name} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                className="min-h-[100px]"
                {...register('address')}
              />
            </div>

            <div className="space-y-2">
              <Label>Upload image</Label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                <div className="w-32 h-32 mx-auto mb-4">
                  <img
                    src={watchImage instanceof File
                      ? URL.createObjectURL(watchImage)
                      : watchImage
                        ? `/api/logo/download/${watchImage}`
                        : "/placeholder.svg"}
                    alt="image preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-green-500 text-white hover:bg-green-600"
                  onClick={() => document.getElementById('imageUpload').click()}
                >
                  Add image
                </Button>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                className="min-h-[200px]"
                placeholder="Enter customer description"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => navigate('/customer-table')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
"use client"

import { useState, useEffect, useCallback, useMemo, Suspense } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X } from 'lucide-react'
import { useNavigate, useParams } from "react-router-dom"
import { useGetSupplierByIdQuery, useUpdateSupplierMutation } from "@/slice/supplierSlice/SupplierSlice"
import { BreadcrumbWithCustomSeparator } from "@/breadCrumb/BreadCrumb"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Country, City } from 'country-state-city';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
  </div>
)

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Supplier Table", href: "/supplier-table" },
  { label: "Edit Supplier Form", href: null }, // No `href` indicates the current page
]
export default function EditSupplierForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: supplier, isLoading } = useGetSupplierByIdQuery(id)
  const [updateSupplier] = useUpdateSupplierMutation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [isLoadingLocation, setIsLoadingLocation] = useState(true)

  const form = useForm({
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      website: "",
      contact_person: "",
      address: "",
      country: "",
      city: "",
      description: "",
      image: null,
    },
  })

  useEffect(() => {
    const initializeCountries = async () => {
      setIsLoadingLocation(true)
      const allCountries = Country.getAllCountries()
      setCountries(allCountries)
      setIsLoadingLocation(false)
    }
    initializeCountries()
  }, [])

  const handleCountryChange = useCallback((countryCode) => {
    setIsLoadingLocation(true)
    const citiesInCountry = City.getCitiesOfCountry(countryCode) || []
    setCities(citiesInCountry)
    form.setValue('city', '')
    setIsLoadingLocation(false)
  }, [form])

  useEffect(() => {
    if (supplier) {
      form.reset({
        name: supplier.name || "",
        mobile: supplier.mobile || "",
        email: supplier.email || "",
        website: supplier.website || "",
        contact_person: supplier.contact_person || "",
        address: supplier.address || "",
        country: supplier.country || "",
        city: supplier.city || "",
        description: supplier.description || "",
      })

      if (supplier.image) {
        setPreviewImage(`/api/image/download/${supplier.image}`)
      }

      // Fetch cities for the supplier's country if it exists
      if (supplier.country) {
        const countryData = countries.find(c => c.name === supplier.country);
        if (countryData) {
          handleCountryChange(countryData.isoCode);
        }
      }
    }
  }, [supplier, form, countries]);

  async function onSubmit(values) {
    if (!id) {
      setSubmitError('No supplier ID found')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      let updateData = { ...values }
      delete updateData.image // Remove the image field initially

      // Handle image upload if there's a new image
      if (values.image && values.image[0]) {
        const formData = new FormData()

        Object.keys(updateData).forEach(key => {
          formData.append(key, updateData[key])
        })
        formData.append('image', values.image[0])

        await updateSupplier({ updatedSupplier: formData, id }).unwrap()
      } else {
        await updateSupplier({
          updatedSupplier: updateData,
          id
        }).unwrap()
      }

      navigate("/supplier-table")
    } catch (error) {
      console.error('Error updating supplier:', error)
      setSubmitError(error.data?.message || 'Failed to update supplier. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPreviewImage(URL.createObjectURL(file)) // Generate preview URL for new image
    }
    form.setValue("image", e.target.files)
  }

  const memoizedCountries = useMemo(() => Country.getAllCountries(), [])

  if (isLoading || isLoadingLocation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <>
    <div className="ml-1">
      <BreadcrumbWithCustomSeparator items={breadcrumbItems} />

    </div>
      <Card className="max-w-8xl mt-3 mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Update Supplier</CardTitle>
        </CardHeader>
        <CardContent>
          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {submitError}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Supplier Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter supplier name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField
                  control={form.control}
                  name="contact_person"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact person" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter website URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mobile Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          const country = countries.find(c => c.isoCode === value);
                          field.onChange(country.name);
                          handleCountryChange(value);
                        }}
                        value={countries.find(c => c.name === field.value)?.isoCode || ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <Suspense fallback={<LoadingSpinner />}>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.isoCode} value={country.isoCode}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Suspense>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                        disabled={!form.watch('country')}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.name} value={city.name}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*" />
                    </FormControl>
                    <FormMessage />
                    {previewImage && (
                      <div className="mt-4">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="h-32 w-32 object-cover border" />
                      </div>
                    )}
                  </FormItem>
                )} />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              
              </div>
            </form>
          </Form>
        </CardContent>
      </Card></>
  )
}
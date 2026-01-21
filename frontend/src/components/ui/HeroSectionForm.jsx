import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Trash2, Plus } from "lucide-react";

const HeroSectionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const form = useForm({
    defaultValues: {
      title: [{ text: "" }],
      subtitle: "",
      description: "",
      buttonText: "",
      buttonLink: "",
      image: null,
      marquee: [],
      socialMediaLinks: [],
    },
  });

  const { fields: titleFields, append: appendTitle, remove: removeTitle } = useFieldArray({
    control: form.control,
    name: "title",
  });

  const { fields: marqueeFields, append: appendMarquee, remove: removeMarquee } = useFieldArray({
    control: form.control,
    name: "marquee",
  });

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control: form.control,
    name: "socialMediaLinks",
  });

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/heroSection/${id}`);
          const data = response.data.data || response.data;
          form.reset({
            title: Array.isArray(data.title) ? data.title.map(t => ({ text: t })) : [{ text: data.title || "" }],
            subtitle: data.subtitle || "",
            description: data.description || "",
            buttonText: data.buttonText || "",
            buttonLink: data.buttonLink || "",
            marquee: data.marquee || [],
            socialMediaLinks: data.socialMediaLinks || [],
          });
          if (data.imageUrl) {
            setImagePreview(`/api/image/download/${data.imageUrl}`);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [id, form]);

  const onSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", JSON.stringify(values.title.map(t => t.text)));
    formData.append("subtitle", values.subtitle);
    formData.append("description", values.description);
    formData.append("buttonText", values.buttonText);
    formData.append("buttonLink", values.buttonLink);
    
    // Append complex arrays as JSON strings
    formData.append("marquee", JSON.stringify(values.marquee));
    formData.append("socialMediaLinks", JSON.stringify(values.socialMediaLinks));

    if (values.image && values.image[0]) {
      formData.append("photo", values.image[0]);
    }

    try {
      if (id) {
        await axios.put(`/api/heroSection/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/api/heroSection", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/hero-section-table");
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{id ? "Edit Hero Section" : "Add Hero Section"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4 border p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <FormLabel>Titles</FormLabel>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendTitle({ text: "" })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Title
                  </Button>
                </div>
                {titleFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-end">
                    <FormField
                      control={form.control}
                      name={`title.${index}.text`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Enter title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeTitle(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter subtitle" {...field} />
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
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="buttonText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Learn More" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="buttonLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Link</FormLabel>
                      <FormControl>
                        <Input placeholder="/about-us" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Marquee Section */}
              <div className="space-y-4 border p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Marquee Items</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendMarquee({ title: "" })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                </div>
                {marqueeFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-end">
                    <FormField
                      control={form.control}
                      name={`marquee.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>Text</FormLabel>
                          <FormControl>
                            <Input placeholder="Marquee text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeMarquee(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Social Media Links Section */}
              <div className="space-y-4 border p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Social Media Links</h3>
                  <Button type="button" variant="outline" size="sm" onClick={() => appendSocial({ platform: "", url: "" })}>
                    <Plus className="h-4 w-4 mr-2" /> Add Link
                  </Button>
                </div>
                {socialFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-2 gap-4 items-end relative pr-12">
                    <FormField
                      control={form.control}
                      name={`socialMediaLinks.${index}.platform`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>Platform</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Facebook" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`socialMediaLinks.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index !== 0 ? "sr-only" : ""}>URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="absolute right-0 bottom-0"
                      onClick={() => removeSocial(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Background Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            onChange(e.target.files);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                        {...rest}
                      />
                    </FormControl>
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-40 w-auto object-cover rounded border"
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/hero-section-table")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroSectionForm;
import React, { useEffect } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import slugify from 'slugify'

export const ChemicalInfoForm = ({ control, setValue }) => {
  const name = useWatch({
    control,
    name: 'name',
  });

  useEffect(() => {
    if (name) {
      const generatedSlug = slugify(name, {
        lower: true,
        strict: true,
        trim: true,
      });
      setValue('slug', generatedSlug);
    }
  }, [name, setValue]);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-none border-none">
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <Input id="name" {...field} />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <Input 
                id="slug" 
                {...field} 
                onChange={(e) => {
                  const customSlug = slugify(e.target.value, {
                    lower: true,
                    strict: true,
                    trim: true,
                  });
                  field.onChange(customSlug);
                }}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chemical_type">Chemical Type</Label>
          <Controller
            name="chemical_type"
            control={control}
            render={({ field }) => (
              <Input id="chemical_type" {...field} />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cas_number">CAS Number</Label>
          <Controller
            name="cas_number"
            control={control}
            render={({ field }) => (
              <Input id="cas_number" {...field} />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="iupac">IUPAC Name</Label>
          <Controller
            name="iupac"
            control={control}
            render={({ field }) => (
              <Input id="iupac" {...field} />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="molecular_formula">Molecular Formula</Label>
          <Controller
            name="molecular_formula"
            control={control}
            render={({ field }) => (
              <Input id="molecular_formula" {...field} />
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default ChemicalInfoForm


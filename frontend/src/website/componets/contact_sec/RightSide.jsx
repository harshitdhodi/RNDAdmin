'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'react-toastify'
import { useAddInquiryMutation } from '@/slice/inquiry/inquiry'
import Swal from 'sweetalert2'

export default function RightSection() {
  const [loading, setLoading] = useState(false)
  const [addInquiry] = useAddInquiryMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.target)
      const data = Object.fromEntries(formData.entries())

      const result = await addInquiry(data).unwrap()

      Swal.fire({
        title: 'Success!',
        text: 'Your message has been sent successfully',
        icon: 'success',
        confirmButtonColor: '#2c4899',
        timer: 3000,
        timerProgressBar: true
      })
      
      e.target.reset()
    } catch (error) {
      toast.error(error.data?.message || error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <h2 className="text-xl text-blue-800 font-semibold mb-4">
        Please fill in the form below to send us your enquiries.
      </h2>
      
      <p className="text-gray-600 mb-6">
        Fields marked <span className="text-red-500">*</span> are mandatory.
      </p>

      <form onSubmit={handleSubmit} className="space-y-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              First Name<span className="text-red-500">*</span>
            </label>
            <Input required name="firstName" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Last Name<span className="text-red-500">*</span>
            </label>
            <Input required name="lastName" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Organisation<span className="text-red-500">*</span>
            </label>
            <Input required name="organisation" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Department
            </label>
            <Input name="department" />
          </div>
        </div>

        <div>
          <label className="block text-sm mt-3 font-medium mb-1">
            Address
          </label>
          <Textarea name="address" rows={3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Country
            </label>
            <Input name="country" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone
            </label>
            <Input name="phone" type="tel" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email<span className="text-red-500">*</span>
          </label>
          <Input required name="email" type="email" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Your Message<span className="text-red-500">*</span>
          </label>
          <Textarea required name="message" rows={4} />
        </div>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="w-1/4 mt-3 bg-[#2c4899] hover:bg-[#2c4899]"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  )
}


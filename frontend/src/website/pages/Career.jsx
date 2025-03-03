import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSubmitApplicationMutation } from "@/slice/career/CareerForm";
import { useGetBannerByPageSlugQuery } from "@/slice/banner/banner";
import { Banner } from "../componets/Banner";
import career from '../images/career.jpg';

export default function CareerForm() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    contactNo: '',
    postAppliedFor: '',
    securityCode: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [submitApplication, { isLoading }] = useSubmitApplicationMutation();
  const location = useLocation();
  const path = location.pathname.replace(/^\//, '') || 'career';
  const { data: banners, isLoading: isBannerLoading } = useGetBannerByPageSlugQuery(path);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      if (resumeFile) {
        formDataToSend.append('resumeFile', resumeFile);
      }

      await submitApplication(formDataToSend).unwrap();
      alert('Application submitted successfully!');
      
      // Reset form
      setFormData({
        name: '',
        address: '',
        email: '',
        contactNo: '',
        postAppliedFor: '',
        securityCode: '',
      });
      setResumeFile(null);
      e.target.reset();
    } catch (error) {
      alert('Failed to submit application: ' + error.message);
    }
  };

  return (
    <>
      {isBannerLoading ? (
        <div>Loading banner...</div>
      ) : (
        <Banner imageUrl={banners && banners.length > 0 ? `/api/image/download/${banners[0].image}` : career} />
      )}
      <div className="sm:max-w-[75rem] w-full mx-auto">
        <nav className="py-4 px-4 sm:px-0 md:px-6">
          <div className="flex border-b border-gray-300 pb-4 items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <span className="text-gray-400">&raquo;</span>
            <span className="text-orange-500">Careers</span>
          </div>
        </nav>
        <div className="mb-7 px-4 md:px-6 sm:px-0">
          <h1 className="text-3xl font-bold">Careers</h1>
          <div className="bg-orange-500 h-1 w-12"></div>
        </div>
        <div className="mb-4">
          <h2 className="sm:text-2xl text-lg px-4 md:px-6 sm:px-0 text-blue-800 mb-4">We are looking for people for the following Departments</h2>
          <div className="flex flex-wrap items-center gap-4 text-sm px-4 md:px-6 sm:px-0 sm:text-lg">
            {[
              "QUALITY CONTROL",
              "PRODUCTION",
              "MARKETING",
              "ADMINISTRATION",
              "SUPPLY CHAIN",
              "PURCHASE CHAIN"
            ].map((dept, index, array) => (
              <span key={dept} className="text-orange-500">
                {dept}
                {index < array.length - 1 && (
                  <span className="text-gray-500 text-3xl">•</span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 px-4 md:px-6 sm:px-0 sm:text-lg">Please fill in the form below to send us your job application.</p>
          <p className="text-red-500 mb-6 text-lg font-bold px-4 md:px-6 sm:px-0">All fields are mandatory.</p>
        </div>
        <div className="grid md:grid-cols-2 w-full gap-7 px-4 md:px-6 sm:px-0">
          <form className="space-y-6 w-full" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Name*</Label>
              <Input 
                id="name" 
                required 
                className="rounded-none"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address*</Label>
              <Textarea 
                id="address" 
                required 
                className="rounded-none"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                className="rounded-none"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNo">Contact No*</Label>
              <Input 
                id="contactNo" 
                type="tel" 
                required 
                className="rounded-none"
                value={formData.contactNo}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume">Upload Your resume*</Label>
              <div className="text-sm text-gray-500">[doc,docx OR pdf]</div>
              <Input 
                id="resume" 
                type="file" 
                accept=".doc,.docx,.pdf" 
                required 
                className="rounded-none"
                onChange={handleFileChange}
              />
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                className="bg-blue-700 rounded-sm text-lg py-6 hover:bg-blue-800"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
              <Button 
                type="reset" 
                variant="destructive" 
                className="bg-orange-500 hover:bg-orange-600 text-lg py-6 rounded-sm"
              >
                Reset
              </Button>
            </div>
          </form>
          <div className="hidden md:flex flex-col items-start justify-start w-full">
            <div className="w-full ml-10 flex justify-center relative -top-8 items-center">
              <img
                src={career}
                alt="Career growth illustration"
                className="object-contain w-full h-[80%]"
              />
            </div>
            <div className="space-y-2 w-full relative -top-24">
              <Label htmlFor="postAppliedFor">Post Applied For*</Label>
              <Input 
                id="postAppliedFor" 
                required 
                className="rounded-none"
                value={formData.postAppliedFor}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2 w-full relative -top-20">
              <Label htmlFor="securityCode">Security Code*</Label>
              <div className="flex gap-4 items-center">
                <Input 
                  id="securityCode" 
                  className="max-w-[150px] rounded-none" 
                  required
                  value={formData.securityCode}
                  onChange={handleInputChange}
                />
                <div className="bg-gray-100 px-4 md:px-6 py-2 text-lg font-mono">JX905</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
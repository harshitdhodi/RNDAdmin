import React, { useEffect, useState } from 'react';
import axios from 'axios';
import callIcon from "../../../assets/call-icon.png";
import emailIcon from "../../../assets/email-us.png";
import contactImg from "../../../assets/contact.png";
import { Link } from 'react-router-dom';

export default function LeftSection() {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get('/api/contactInfo/get');
        setContactInfo(response.data[0] || {}); // Default to an empty object if no data
      } catch (error) {
        console.error("Error fetching contact info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!contactInfo) {
    return <div>Error loading contact information.</div>;
  }

  // Assuming 'photo' is an array and using the first image filename
  const imageUrl = contactInfo.photo?.[0] ? `/api/image/download/${contactInfo.photo[0]}` : contactImg;

  return (
    <div className="px-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-700">Contact Us</h1>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700">Corporate Office</h3>
          <p className="text-gray-600">{contactInfo.address || "Address not available"}</p>
        </div>

        <div className="flex justify-between">
          <div className="space-y-4">
            {/* Display mobile numbers */}
            <div className="space-y-2">
              <div className="flex gap-3 items-center">
                <img src={callIcon} alt="Call Icon"/>
                <span className="font-semibold">Call Us</span>
              </div>
              {contactInfo.mobiles?.length > 0 ? (
                contactInfo.mobiles.map((mobile, index) => (
                  <p key={index} className="text-gray-600 text-[15px]">{mobile}</p>
                ))
              ) : (
                <p className="text-gray-600 text-[15px]">No phone numbers available</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Display emails */}
            <div>
              <div className="flex gap-3 items-center">
                <img src={emailIcon} alt="Email Icon" />
                <h2 className="text-lg font-semibold">Email Us</h2>
              </div>
              {contactInfo.emails?.length > 0 ? (
                contactInfo.emails.map((email, index) => (
                  <Link 
                    key={index} 
                    to={`mailto:${email}`} 
                    className="text-gray-800 block hover:underline"
                  >
                    {email}
                  </Link>
                ))
              ) : (
                <p className="text-gray-600">No email addresses available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-10">
        {/* Display the image from the API */}
        <img 
          src={imageUrl} 
          alt={contactInfo.altName?.[0] || "Corporate Office Building"} 
          className="rounded-lg lg:mt-16 mt-10"
        />
        <div className="absolute bottom-0 left-0 bg-blue-800 text-white py-2 px-4 rounded-br-lg">
          <span className="text-cyan-400">SINCE</span> {new Date(contactInfo.createdAt).getFullYear() || "N/A"}
        </div>
      </div>
    </div>
  );
}

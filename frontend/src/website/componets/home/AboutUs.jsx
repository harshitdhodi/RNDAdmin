import React from 'react';
import { useLocation } from 'react-router-dom';
import { useGetAboutUsBySlugQuery } from '@/slice/aboutUs/aboutUs';

export default function AboutDescription() {
  const location = useLocation();
  const slug = location.pathname.split('/').pop();
  const { data: aboutData, isLoading, error } = useGetAboutUsBySlugQuery(slug);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  // Assuming aboutData directly returns the object
  const profileData = aboutData;

  if (!profileData) return <div>No data found</div>;

  return (
    <section className="lg:w-[48rem] w-[90%] mx-auto bg-white">
      <div className="w-full ">
        {/* <h1 className="text-2xl font-bold text-gray-800 mb-4">{profileData.title}</h1> */}
        {/* <div className="mb-6">
          <img 
            src={`/api/image/download/${profileData.image}`} 
            alt={profileData.altName} 
            className="w-full h-auto rounded-md"
          />
        </div> */}
        <div 
          className="text-sm  text-gray-700"
          dangerouslySetInnerHTML={{ __html: profileData.description }}
        />
      </div>
    </section>
  );
}

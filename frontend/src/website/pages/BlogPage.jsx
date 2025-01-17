import { CalendarIcon, ClockIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useGetAllBlogsExceptLatestQuery, useGetBlogsByCategoryQuery, useGetLatestBlogQuery } from '@/slice/blog/blog';
import React, { useEffect } from 'react';
import Footer from '../componets/home/Footer';
import { useNavigate } from 'react-router-dom';
export default function BlogPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Fetch blogs based on the presence of slug
  const { data: blogsByCategory, isLoading: loadingBlogsByCategory, error: errorBlogsByCategory } =
    slug ? useGetBlogsByCategoryQuery(slug) : { data: null, isLoading: false, error: null };
  
  const { data: latestBlog, isLoading: loadingLatestBlog, error: errorLatestBlog } = useGetLatestBlogQuery();
  const { data: allBlogs, isLoading: loadingAllBlogs, error: errorAllBlogs } =
    !slug ? useGetAllBlogsExceptLatestQuery() : { data: null, isLoading: false, error: null };

  // Handle loading and error states
  if (loadingLatestBlog || loadingAllBlogs || loadingBlogsByCategory) {
    return <div>Loading...</div>;
  }

  if (errorLatestBlog || errorAllBlogs || errorBlogsByCategory) {
    return <div>Error loading blogs.</div>;
  }

  // Use appropriate blogs data
  const blogsToShow = slug ? blogsByCategory : allBlogs;

  return (
    <>
    <div className="px-4 md:px-6 mb-10 bg-white lg:px-8 relative">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50m-40 0a40,40 0 1,0 80,0a40,40 0 1,0 -80,0' fill='none' stroke='%23333' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />
      <div className="max-w-7xl mx-auto">
        <div className="lg:flex lg:gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
          {!slug && (
              <>
                <h2 className="text-3xl text-[#052852] font-bold mt-8 mb-10 pb-2 border-b-2 border-[#05354b]">
                  Latest from the Blog
                </h2>   

                {/* Featured Post - Latest Blog */}
                {latestBlog && (
                  <div className="bg-white transform transition-transform duration-100 hover:scale-105 hover:shadow-md hover:shadow-[#1290ca] shadow-lg shadow-[#1290ca]/50 rounded-lg h-[50vh] border border-gray-200 mb-12 overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-2/5 p-5 lg:w-[80%] h-[50vh]">
                        <img
                          src={`/api/image/download/${latestBlog.image}`}
                          alt="Featured blog post img"
                          className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                        />
                      </div>
                      <div className="md:w-3/5 h-[50vh] p-4">
                        <h3 className="text-2xl font-bold mb-2 text-gray-800">
                          <a href="#" className="hover:underline text-[#052852]">
                            {latestBlog.title}
                          </a>
                        </h3>
                        <p
                          className="text-gray-600 mb-4"
                          dangerouslySetInnerHTML={{
                            __html: latestBlog.details.slice(31, 107),
                          }}
                        />
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          <span>{new Date(latestBlog.date).toLocaleDateString()}</span>
                          <ClockIcon className="ml-4 mr-2 h-4 w-4" />
                          <span>{latestBlog.readTime} min read</span>
                        </div>
                        <Link to={`/blog/${latestBlog.slug}`}>
                          <button className="btn bg-[#1290ca] text-white hover:bg-[#1299ca] px-8 py-2 rounded">
                            Read More
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Recent Posts */}
            <h3 className="text-2xl text-[#052852] font-bold mt-12 mb-8 pb-2 border-b-2 border-[#1290ca]">
              {slug ? `Blogs in "${slug}"` : 'Recent Posts'}
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {blogsToShow &&
                blogsToShow.map((post, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-md hover:shadow-[#1290ca] shadow-[#1290ca]/50 rounded-lg border border-gray-200 overflow-hidden h-[450px]"
                  >
                    <img
                      src={`/api/image/download/${post.image}`}
                      alt={`${post.title} cover img`}
                      className="w-full h-[70%] object-contain px-6
                       rounded-t-lg transition-opacity duration-300 hover:opacity-90"
                    />
                    <div className="card-header px-4 mt-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        <a href="#" className="hover:underline hover:text-[#1290ca] transition-colors duration-300">
                          {post.title}
                        </a>
                      </h3>
                    </div>
                    <div className="card-content px-4 flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <Link to={`/blog/${post.slug}`}>
                        <button className="btn m-2 mb-3 bg-[#1290ca] text-white hover:bg-[#1299ca] px-8 py-2 rounded">
                          Read More
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 mt-8 lg:mt-10">
            <div className="sticky top-24 mb-8 p-7">
              {/* Share Your Thoughts Card */}
              <div className="bg-[#052852] py-10 px-5 shadow-lg hover:shadow-md hover:shadow-[#052852] shadow-[#052852]/50 border border-gray-200">
                <div className="card-header p-4">
                  <h3 className="card-title text-3xl text-white font-bold">
                    Connect with Us for Custom Solutions
                  </h3>
                </div>
                <div className="px-4 pb-4">
                  <p className="mb-4 text-lg text-gray-400">
                    Submit Your Inquiry Below to Explore Tailored Industrial Products for Your Business
                  </p>
                  <button className="btn bg-[#ffffff] text-[052852] w-1/2 py-2 rounded">
                    Get Inquiry
                  </button>
                </div>
              </div>

              {/* Contact Card */}
              <div className="mt-5">
                <div className="bg-[#052852] flex flex-col gap-4 shadow-lg hover:shadow-md hover:shadow-[#052852] shadow-[#052852]/50 border border-gray-200 p-10">
                  <div className="card-header">
                    <h3 className="card-title text-2xl font-bold text-[#ffffff]">Get in Touch</h3>
                  </div>
                  <div className="card-content flex flex-col gap-2">
                    <div className="flex items-center">
                      <PhoneIcon className="h-6 w-6 mr-2 text-[#ffffff]" />
                      <span className="text-lg text-[#ffffff]">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center">
                      <MailIcon className="h-6 text-[#ffffff] w-6 mr-2" />
                      <a href="mailto:contact@example.com" className="text-lg text-[#ffffff] hover:underline">
                        contact@example.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   
    </>
  );
}

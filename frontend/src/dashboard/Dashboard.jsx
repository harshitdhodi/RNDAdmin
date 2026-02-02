import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [dataCount, setDataCount] = useState({
    customerCount: 0,
    inquiryCount: 0,
  });
  const [serviceCounts, setServiceCounts] = useState({
    totalCategories: 0,
    totalSubcategories: 0,
    totalSubSubcategories: 0,
  });

  // Fetch data count (inquiries, customers) from the API
  useEffect(() => {
    const fetchDataCount = async () => {
      try {
        const response = await axios.get('/api/count/dataCount');
        setDataCount({
          customerCount: response.data.customerCount ?? 0,
          inquiryCount: response.data.inquiryCount ?? 0,
        });
      } catch (error) {
        console.error('Error fetching data count:', error);
      }
    };
    fetchDataCount();
  }, []);

  // Fetch service category counts (categories, subcategories, sub-subcategories) from /api/services/countByCategory
  useEffect(() => {
    const fetchServiceCountByCategory = async () => {
      try {
        const response = await axios.get('/api/services/countByCategory', { withCredentials: true });
        const data = response.data || {};
        setServiceCounts({
          totalCategories: data.totalCategories ?? 0,
          totalSubcategories: data.totalSubcategories ?? 0,
          totalSubSubcategories: data.totalSubSubcategories ?? 0,
        });
      } catch (error) {
        console.error('Error fetching service count by category:', error);
      }
    };
    fetchServiceCountByCategory();
  }, []);

  return (
    <div className="p-1 mx-auto">
      <div>
        <h1 className="text-xl font-semibold text-purple-800 mb-4 pb-1 border-b border-purple-800">Dashboard</h1>
      </div>

      {/* Total Inquiries + Service Categories + Total Customers together */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        <div className="bg-emerald-500 text-white p-6 rounded-md shadow-lg relative overflow-hidden">
          <div className="text-4xl font-bold mb-2">{dataCount.inquiryCount}</div>
          <div className="text-lg">Total Inquiries</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="bg-teal-500 text-white p-6 rounded-md shadow-lg relative overflow-hidden">
          <div className="text-4xl font-bold mb-2">{serviceCounts.totalCategories}</div>
          <div className="text-lg">Total Categories</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        </div>
        <div className="bg-amber-500 text-white p-6 rounded-md shadow-lg relative overflow-hidden">
          <div className="text-4xl font-bold mb-2">{serviceCounts.totalSubcategories}</div>
          <div className="text-lg">Total Subcategories</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        </div>
        <div className="bg-purple-600 text-white p-6 rounded-md shadow-lg relative overflow-hidden">
          <div className="text-4xl font-bold mb-2">{serviceCounts.totalSubSubcategories}</div>
          <div className="text-lg">Total Sub-Subcategories</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default Dashboard;

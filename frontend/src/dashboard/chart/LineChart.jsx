import React, { useState, useEffect } from 'react';
import { format, getDaysInMonth } from 'date-fns';
import { useGetInquiriesQuery } from '@/slice/inquiry/inquiry';

const CustomInquiryChart = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [minInquiries, setMinInquiries] = useState(0);
  const [maxInquiryCount, setMaxInquiryCount] = useState(10);
  const [monthlyData, setMonthlyData] = useState([]);
  
  const { data: inquiries, isLoading } = useGetInquiriesQuery();

  useEffect(() => {
    if (!inquiries || isLoading) return;

    const daysInMonth = getDaysInMonth(currentMonth);
    // Initialize monthly data
    const newMonthlyData = Array.from({ length: daysInMonth }, () => 0);

    inquiries.forEach((inquiry) => {
      const inquiryDate = new Date(inquiry.createdAt);
      if (
        inquiryDate.getFullYear() === currentMonth.getFullYear() &&
        inquiryDate.getMonth() === currentMonth.getMonth()
      ) {
        const day = inquiryDate.getDate() - 1; // Adjust index
        newMonthlyData[day] += 1;
      }
    });

    // Find max value for scaling
    const max = Math.max(...newMonthlyData, 1);
    setMaxInquiryCount(max);
    setMonthlyData(newMonthlyData);
  }, [currentMonth, inquiries, isLoading]);

  const handleMonthChange = (event) => {
    const [year, month] = event.target.value.split('-');
    setCurrentMonth(new Date(year, month - 1));
  };

  const handleMinInquiriesChange = (event) => {
    setMinInquiries(parseInt(event.target.value, 10));
  };

  // Generate chart bars and grid lines
  const renderChart = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const chartHeight = 300;
    const barWidth = `calc(100% / ${daysInMonth})`;
    
    // Calculate grid lines (horizontal lines)
    const gridLines = [];
    const numGridLines = 5;
    for (let i = 0; i <= numGridLines; i++) {
      const yPosition = i * (chartHeight / numGridLines);
      const value = Math.round((numGridLines - i) * (maxInquiryCount / numGridLines));
      
      gridLines.push(
        <div key={`grid-${i}`} className="absolute w-full border-t border-gray-200 flex justify-start items-center" style={{ bottom: `${yPosition}px` }}>
          <span className="text-xs text-gray-500 pr-2">{value}</span>
        </div>
      );
    }

    // Generate bars
    const bars = monthlyData.map((value, index) => {
      const height = value ? (value / maxInquiryCount) * chartHeight : 0;
      const shouldShow = value >= minInquiries;
      
      return (
        <div 
          key={`bar-${index}`} 
          className="flex flex-col items-center"
          style={{ width: barWidth }}
        >
          <div className="relative w-full h-full">
            {shouldShow && (
              <div 
                className="absolute bottom-0 mx-auto w-4/5 bg-purple-500 hover:bg-purple-600 transition-all duration-300 rounded-t-sm"
                style={{ height: `${height}px` }}
                title={`Day ${index + 1}: ${value} inquiries`}
              ></div>
            )}
          </div>
          {(index % 5 === 0 || index === daysInMonth - 1) && (
            <div className="text-xs text-gray-500 mt-1">{index + 1}</div>
          )}
        </div>
      );
    });

    return (
      <div className="relative" style={{ height: `${chartHeight + 30}px` }}>
        {/* Grid lines */}
        <div className="absolute inset-0" style={{ height: `${chartHeight}px` }}>
          {gridLines}
        </div>
        
        {/* Bars container */}
        <div className="absolute inset-0 flex" style={{ height: `${chartHeight}px` }}>
          {bars}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mt-10 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg text-purple-800 mb-5 pb-1 font-semibold border-b border-purple-800">
        Monthly Inquiries
      </h2>
      
      <div className="mb-6 flex flex-wrap justify-between items-center">
        <div className="mb-2 sm:mb-0">
          <label htmlFor="monthPicker" className="mr-2 text-gray-700">Select Month:</label>
          <input
            id="monthPicker"
            type="month"
            value={format(currentMonth, 'yyyy-MM')}
            onChange={handleMonthChange}
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
        
        <div>
          <label htmlFor="minInquiries" className="mr-2 text-gray-700">
            Min Inquiries:
          </label>
          <input
            type="number"
            id="minInquiries"
            value={minInquiries}
            onChange={handleMinInquiriesChange}
            min="0"
            className="border rounded p-2 w-20 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
      </div>
      
      <div className="w-full mt-8">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium text-gray-600">Number of Inquiries</div>
          <div className="text-sm font-medium text-gray-600">
            {format(currentMonth, 'MMMM yyyy')}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            {renderChart()}
            <div className="mt-2 text-center text-sm text-gray-600">Day of Month</div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        * Hover over bars to see exact inquiry counts
      </div>
    </div>
  );
};

export default CustomInquiryChart;
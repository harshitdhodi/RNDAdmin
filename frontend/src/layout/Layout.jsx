import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/layout/components/app-sidebar"; // Ensure correct path to AppSidebar
import { Outlet } from "react-router-dom";
import FollowUpModal from '@/inquiry/FollowUpModel';
import Navbar from './components/Navbar';
import Footer from '@/website/componets/home/Footer';

function Layout() {
  return (
    <SidebarProvider className="overflow-hidden">
      <div className="flex w-full">
        {/* Sidebar */}
        <AppSidebar />
        
        <main className="flex-1 overflow-auto">
          {/* Navbar */}
          <nav className="bg-[#3b1f91] p-2 ">
            {/* <SidebarTrigger /> */}
          <Navbar/>
            {/* Additional Navbar content goes here */}
          </nav>

          {/* Main content rendered via Outlet */}
          <div className="px-5 py-2 overflow-auto">
            {/* This is where child components like Pera will render */}
            <Outlet />
         
          </div>
         
        </main>
      </div>
    </SidebarProvider>
  );
}

export default Layout;

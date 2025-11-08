import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import logoimage from "../../../public/headerLogo.webp";
import { ChevronDown, LayoutDashboard, PlusSquare, List, Settings, ArrowLeftRightIcon, UsersRoundIcon, Truck, Mail, FileQuestion, GanttChart, FlaskConical, Globe, Image, Menu, Newspaper, Contact, Briefcase, Info, Search, FileText, Send, SlidersHorizontal, FileType, Building, Handshake, ShoppingCart, ShieldQuestion, FileCheck, KeyRound, Link as LinkIcon, BookCopy, Lock, FileLock, MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

// Updated JSON structure with parent-child relationships
const menuData = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/dashboard",

  },
  {
    title: "Chemical",
    icon: FlaskConical,
    children: [
      { title: "List", icon: List, url: "/chemical-table" },
      { title: "Add New", icon: PlusSquare, url: "/chemical-form" },
      { title: "Chemical Types", icon: FileType, url: "/chemical-types" },
      { title: "Search Suppliers", icon: Truck, url: "/search-suppliers" },
      { title: "Unit", icon: PlusSquare, url: "/unit" },
      { title: "Tax", icon: PlusSquare, url: "#types" },
      { title: "Category", icon: GanttChart, url: "/chemical-category" }
    ]
  },
  {
    title: "Supplier",
    icon: Truck,
    children: [
      { title: "List", icon: List, url: "/supplier-table" },
      { title: "Add New", icon: PlusSquare, url: "/supplier-form" },
      { title: "Chemical Mapping", icon: ArrowLeftRightIcon, url: "/chemical-mapping" },
      { title: "Search Chemicals", icon: Search, url: "/chemical-search" }
    ]
  },
  {
    title: "Customer",
    icon: UsersRoundIcon,
    children: [
      { title: "List", icon: List, url: "/customer-table" },
      { title: "Add New", icon: PlusSquare, url: "/customer-form" },
      { title: "Chemical Mapping", icon: ArrowLeftRightIcon, url: "/customer-chemical-mapping" },

    ]
  },
  {
    title: "Email",
    icon: Mail,
    children: [
      { title: "SMTP Setting", icon: List, url: "/smtp-table" },
      { title: "Email Template", icon: PlusSquare, url: "/email-template-table" },
      { title: "Send Email ", icon: ArrowLeftRightIcon, url: "/email-form" },
      { title: "Email Category", icon: ArrowLeftRightIcon, url: "/email-category" },
    ]
  },
  {
    title: "Inquiry",
    icon: FileQuestion,
    children: [
      { title: "List", icon: List, url: "/inquiry-list" },
      { title: "Add New", icon: PlusSquare, url: "/add-inquiry" },
      { title: "Inquiry Sources", icon: List, url: "source-table" },
      { title: "Inquiry Status", icon: List, url: "status-table" },

    ]
  },
  {
    title: "Website",
    icon: Globe,
    children: [
      {
        title: "Logo", icon: Image,
        children: [

          { title: "Logo Form", icon: PlusSquare, url: "/add-logo" },
        ]
      },
      {
        title: "Menu",
        icon: Menu,
        children: [
          { title: "Menu List", icon: List, url: "/menu-listing-table" },
          { title: "Add New", icon: PlusSquare, url: "/menu-listing-form" },
        ]
      },
      {
        title: "Blog",
        icon: Newspaper,
        children: [
          { title: "Blog Categories", icon: List, url: "/blog-category-table" },
          { title: "Blog", icon: PlusSquare, url: "/blog-table" },
          { title: "Blog Card", icon: PlusSquare, url: "/blogCard" },
        ]
      },
      // {
      //   title: "Inquiry",
      //   icon: FileQuestion,
      //   children: [
      //     { title: "List", icon: List, url: "/product-inquiry-table" },
      //   ]
      // },
      {
        title: "Corporate",
        icon: Building,
        children: [
          { title: "List", icon: List, url: "/about-us-table" },
          // { title: "Add New", icon: PlusSquare, url: "/about-us-form" },
        ]
      },
      {
        title: "Banner",
        icon: Image,
        children: [
          {
            title: "List", icon: List, url:
              "/banner-table"
          },
          { title: "Add New", icon: PlusSquare, url: "/add-banner" },

        ]
      },
      {
        title: "Worldwide",
        icon: Globe,
        children: [
          { title: "List", icon: List, url: "/worldwide-table" },
        ]
      },
      {
        title: "Career",
        icon: Briefcase,
        children: [
          { title: "List", icon: List, url: "/career-table" },
          { title: "Career Info", icon: PlusSquare, url: "/career-info-form" },
        ]
      },
      {
        title: "Contact Info",
        icon: Contact,
        children: [
          { title: "List", icon: List, url: "/contact-info-table" },
          // { title: "Add New", icon: PlusSquare, url: "/contact-info/add" },
        ]
      },
      {
        title: "Slide Show",
        icon: SlidersHorizontal,
        children: [
          { title: "slideshow Table", icon: PlusSquare, url: "/slideShow-table" },
          { title: "slide show", icon: List, url: "/slideShow-form" },
        ]
      },
      {
        title: "WhatsUp Info",
        icon: MessageSquareQuote,
        children: [
          // {title:"List",icon:List,url:"/whatsUpInfo-table"},
          { title: "Add New", icon: PlusSquare, url: "/whatsUpInfo-form" }
        ]
      },
      // {
      //   title: "Events",
      //   icon: Handshake,
      //   children: [
      //     { title: "List", icon: List, url: "/events" },
      //   ]
      // },
      {
        title: "Meta Info",
        icon: KeyRound,
        children: [
          { title: "Meta List", icon: List, url: "/meta-table" },
          { title: "Meta Form", icon: List, url: "/meta-form" },
          // { title: "Add New", icon: PlusSquare, url: "/contact-info/add" },
        ]
      },
      {
        title: "Navigation Link",
        icon: LinkIcon,
        children: [
          { title: "List", icon: List, url: "/navigationLink" },
          { title: "Add New", icon: PlusSquare, url: "/navigationLink-form" },
        ]
      }, 
      {
        title:"catalogue Management",
        icon: BookCopy,
        children:[
          {title:"Catalogue List",icon:List,url:"/catalogue-table"},
          // {title:"Add New",icon:PlusSquare,url:"/catalogue-form"}
        ]
      } ,
      {
        title: "PrivacyPolicy and Terms",
        icon: ShieldQuestion,
        children: [
          { title: "Privacy Policy", icon: List, url: "/privacypolicy-terms" },
          { title: "Terms and Condition", icon: PlusSquare, url: "/terms-and-conditions-form" },
        ]
      }
    ]
  }
];

export default function AppSidebar() {
  const [openSections, setOpenSections] = useState({ Website: true });
  const [userMenuOpen, setUserMenuOpen] = useState(false);


  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev);
  };
  const location = useLocation();

  const toggleSection = (title) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isActive = (url) => location.pathname === url;

  const renderMenuItems = (items) =>
    items.map((item) => {
      const isParentActive = item.children?.some((child) => isActive(child.url));
      const isChildActive = isActive(item.url);
      const activeClass = isParentActive || isChildActive ? "text-blue-600" : "text-gray-600";

      return (
        <SidebarMenuItem key={item.title}>
          {item.children?.length ? (
            <Collapsible open={openSections[item.title]} onOpenChange={() => toggleSection(item.title)}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className={`w-full justify-start gap-2 hover:text-blue-600 font-normal ${activeClass}`}>
                  <item.icon className="w-4 h-4" />
                  {item.title}
                  <ChevronDown className={cn("w-4 h-4 ml-auto transition-transform hover:text-blue-600", { "-rotate-90": !openSections[item.title] })} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 space-y-1">
                {renderMenuItems(item.children)}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <SidebarMenuButton asChild>
              <Link to={item.url} className={`pl-4 flex items-center gap-2 hover:text-blue-600 ${activeClass}`}>
                <item.icon className="w-4 h-4" />
                {item.title}
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar >
      <SidebarContent>

        <div className="p-4 border-b">
          <img src={logoimage} alt="Company Logo" className="h-16 mx-auto" />
        </div>
    
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>{renderMenuItems(menuData)}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {/* <Separator className="my-4" /> */}
      {/* <ScrollArea className="p-4">
      <ScrollArea className="p-4">
        <Button variant="ghost" className="w-full justify-start gap-2 font-normal" onClick={toggleUserMenu}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">SC</span>
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">shadcn</div>
              <div className="text-xs text-muted-foreground">m@example.com</div>
            </div>
            <ChevronDown className={cn("w-4 h-4 ml-auto transition-transform", { "-rotate-180": userMenuOpen })} />
          </div>
        </Button>

      
        {userMenuOpen && (
          <div className="mt-2 pl-8">
            <Button variant="ghost" className="w-full justify-start gap-2 font-normal text-sm">
              Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 font-normal text-sm">
              Account Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 font-normal text-sm text-red-600">
              Logout
            </Button>
          </div>
        )}
      </ScrollArea> 
      </ScrollArea> */}
    </Sidebar>
  );
}

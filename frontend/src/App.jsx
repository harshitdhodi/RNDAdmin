import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import Layout from './layout/Layout';
import './App.css';

// Website Components
import Navbar from './website/Navbar';
import HomePage from './website/pages/HomePage';
import ProductCategoryPage from './website/pages/ProductCategoryPage';
import SubCategories from './website/componets/SubCategoryPage/SubCategories';
import AlphabetsBaseCategory from './website/componets/alphabetbaseCategory/AlphabetsBaseCategory';
import ProductDetailPage from './website/componets/productDetailPage/ProductDetailPage';
import ContactPage from './website/pages/ContactPage';
import BlogPage from './website/pages/BlogPage';
import BlogDetailPage from './website/pages/BlogDetailPage';
import ChemicalSubcategoryPage from './website/pages/category_subcategoryPage';

// Dashboard Components
import DashboardPage from './dashboard/DashboardPage';
import AdminLogin from './login/LoginPage';

// Chemical Management
import ChemicalTable from './chemical/ChemicalTablePage';
import ChemicalFormPage from './chemical/chemicalForm/ChemcialFormPage';
import ChemicalTypes from './chemical/ChemicalTypesTable';
import SearchSuppliers from './chemical/SearchSuppliers';
import UnitsPage from './chemical/UnitTable';
import CategoriesPage from './chemical/ChemicalCategoryPage';
import CategoryForm from './chemical/chemicalCategory/CategoryForm';
import UpdateCategoryForm from './chemical/chemicalCategory/EditCategoryForm';
import { ChemicalProvider } from './chemical/ChemicalContext';

// Supplier Management
import SuppliersTable from './supplier/SupplierTablePage';
import SupplierForm from './supplier/SupplierForm';
import ChemicalMapping from './supplier/ChemicalMapping';
import ChemicalSearch from './supplier/SearchChamicals';

// Customer Management
import CustomerTable from './customer/CustomerTable';
import CustomerForm from './customer/CustomerForm';
import CustomerChemicalMapping from './customer/ChemicalMapping';

// Email Management
import SMTPTable from './email/smtp_setting/smtpTable';
import EditSMTP from './email/smtp_setting/editForm';
import CreateSMTP from './email/smtp_setting/CreateSMTP';
import TemplateTable from './email/template/TemplateTable';
import AddTemplateForm from './email/template/AddTemplate';
import EditTemplateForm from './email/template/EditTemplate';

// Inquiry Management
import InquiryList from './inquiry/InquiryTable';
import AddInquiryForm from './inquiry/AddInquiry';
import EditInquiryForm from './inquiry/EditInquiry';
import { SourceTable } from './inquiry/source/SourceTable';
import { StatusTable } from './inquiry/status/StatusTable';

// Blog Management
import BlogCategory from './BlogCategory/BlogCategoryTable';
import Blogcategoryform from './BlogCategory/BlogCategoryForm';
import BlogTable from './blog/BlogPage';
import BlogForm from './blog/BlogForm';
import NavbarComp from './website/componets/navbar/Navbar';
import AlphabetBasedProduct from './website/pages/AlphabetBasedProduct';
import Hello from './Hello';
import Saperator from './website/Saparator';
import BlogSaparator from './website/pages/BlogSaparator';
import EmailForm from './email/emailForm/EmailForm';
import EditCustomerForm from './customer/EditCustomerForm';
import EditSupplierForm from './supplier/EditSupplierForm';
import ProductSearchBar from './website/componets/productSearch/ProductSearchBar';
import { ProductInquiryTable } from './websiteBackend/productInquiry/ProductInquiry';
import AboutUsTable from './websiteBackend/aboutus/AboutUsTable';
import AboutUsForm from './websiteBackend/aboutus/AboutUsForm';
import BannerTable from './websiteBackend/banner/BannerTable';
import AddBannerForm from './websiteBackend/banner/AddBannerForm';
import EditBannerForm from './websiteBackend/banner/EditBannerForm';
import AboutDescription from './website/componets/home/AboutUs';
import Introduction from './website/pages/Introduction';
import MainContent from './website/componets/Introduction/MainContent';
import WorldWide from './website/pages/WorldWide';
import CareerForm from './website/pages/Career';
import WorldWideBackend from './websiteBackend/worldwideTables/WorlWide';
import WorldwideForm from './websiteBackend/worldwideTables/WorldwideForm';
import CareerTable from './websiteBackend/career/CareerTable';
import CareerAdminForm from './websiteBackend/career/CareerForm';
import EmailCategoryParent from './email/emailCategory/EmailCategoryParent';
import AdvanceSearch from './website/pages/AdvanceSearchPage';
import Logo from './websiteBackend/companyLogo/CompanyLogoTable';
import LogoForm from './websiteBackend/companyLogo/LogoForm';
import ContactInfoForm from './websiteBackend/contactInfo/ContactInfoData';
import ContactForm from './websiteBackend/contactInfo/contactInfoForm';
import MenuListingForm from './websiteBackend/MenuListing/MenuListingForm';
import MenuListingTable from './websiteBackend/MenuListing/MenuListingTable';
import StaticMetaForm from './websiteBackend/staticMetaKeyword/StaticMetaForm';
import MetaList from './websiteBackend/staticMetaKeyword/StaticTable';
import useDocumentTitle from './websiteBackend/staticMetaKeyword/DynamicMeta';
import ImageUploadForm from './website/componets/slideshow/SlideShowForm';
import SlideShowTable from './website/componets/slideshow/SlideShowTable';
// Auth Components
const PrivateRoute = ({ children }) => {
  const token = Cookies.get('jwt');
  return token ? children : <Navigate to="/login" replace />;
};

const LoginRoute = () => {
  const token = Cookies.get('jwt');
  return token ? <Navigate to="/dashboard" /> : <AdminLogin />;
};



// Wrapper Component to use the hook
const AppContent = () => {
  useDocumentTitle(); // Use the hook here

  return <Outlet />; // Render the rest of the app
};

// Main App Component
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppContent />, // Use the AppContent here
      children: [
        // Public Routes (Website)
        {
          path: '/',
          element: <Navbar />,
          children: [
            { index: true, element: <HomePage /> },
            { path: 'categories', element: <ProductCategoryPage /> },
            { path: 'products/code?number', element: <Hello /> },
            { path: 'alphabetsbaseCategory', element: <AlphabetsBaseCategory /> },
            { path: ':chemicals', element: <Saperator />, },
            { path: ':slug', element: <Saperator /> },
            { path: 'contact-us', element: <ContactPage /> },
            { path: 'blogs', element: <BlogPage /> },
            { path: 'blog/:slug', element: <BlogSaparator /> },
            { path: 'blog/:slug', element: <BlogSaparator /> },

            { path: ':chemicals/:slug', element: <Hello /> },
            { path: ':chemicals/:slug/:subsubCategorySlug', element: <ChemicalSubcategoryPage /> },

            { path: '/search', element: <ProductSearchBar /> },
            { path: '/about', element: <AboutDescription /> },
            { path: '/introduction', element: <Introduction /> },
            { path: '/vision-mission', element: <MainContent /> },
            { path: '/worldwide', element: <WorldWide /> },
            { path: '/careers', element: <CareerForm /> },
            {path:'/advance-search' , element:<AdvanceSearch />}
          ]
        },
        // Authentication Route
        { path: 'login', element: <LoginRoute /> },
        // Protected Routes (Dashboard)
        {
          path: '',
          element: <PrivateRoute><Layout /></PrivateRoute>,
          children: [
            { path: 'dashboard', element: <DashboardPage /> },
            // Chemical Management Routes
            {
              path: 'chemical-table',
              element: <ChemicalProvider><ChemicalTable /></ChemicalProvider>
            },
            { path: 'chemical-form', element: <ChemicalFormPage /> },
            { path: 'edit-chemical-form/:id', element: <ChemicalFormPage /> },
            
            { path: 'chemical-types', element: <ChemicalTypes /> },
            { path: 'chemical-category', element: <CategoriesPage /> },
            { path: 'chemical-category-form', element: <CategoryForm /> },
            {
              path: 'edit-chemical-category/:categoryId/:subCategoryId?/:subSubCategoryId?',
              element: <UpdateCategoryForm />
            },
            { path: 'unit', element: <UnitsPage /> },
            { path: 'search-suppliers', element: <SearchSuppliers /> },

            // Supplier Management Routes
            { path: 'supplier-table', element: <SuppliersTable /> },
            { path: 'supplier-form', element: <SupplierForm /> },
            { path: 'chemical-mapping', element: <ChemicalMapping /> },
            { path: 'chemical-search', element: <ChemicalSearch /> },
            { path: 'edit-supplier-form/:id', element: <EditSupplierForm /> },

            // Customer Management Routes
            { path: 'customer-table', element: <CustomerTable /> },
            { path: 'customer-form', element: <CustomerForm /> },
            { path: 'customer-chemical-mapping', element: <CustomerChemicalMapping /> },
            { path: 'edit-customer-form/:id', element: <EditCustomerForm /> },

            // Email Management Routes
            { path: 'smtp-table', element: <SMTPTable /> },
            { path: 'add-smtp', element: <CreateSMTP /> },
            { path: 'edit-smtp-form/:id', element: <EditSMTP /> },
            { path: 'email-template-table', element: <TemplateTable /> },
            { path: 'add-template', element: <AddTemplateForm /> },
            { path: 'edit-template/:id', element: <EditTemplateForm /> },
            { path: 'email-form', element: <EmailForm /> },
            { path: 'email-category', element: <EmailCategoryParent /> },
            { path: 'email-category-form', element: <EmailCategoryParent /> },
            { path: 'edit-email-category/:id', element: <EmailCategoryParent /> },
            // Inquiry Management Routes
            { path: 'inquiry-list', element: <InquiryList /> },
            { path: 'add-inquiry', element: <AddInquiryForm /> },
            { path: 'edit-inquiry/:id', element: <EditInquiryForm /> },
            { path: 'source-table', element: <SourceTable /> },
            { path: 'status-table', element: <StatusTable /> },

            // Blog Management Routes
            { path: 'blog-category-table', element: <BlogCategory /> },
            { path: 'blog-category-form', element: <Blogcategoryform /> },
            { path: 'edit-blog-category-form/:id', element: <Blogcategoryform /> },
            { path: 'blog-table', element: <BlogTable /> },
            { path: 'blog-form', element: <BlogForm /> },
            { path: 'edit-blog-form/:id', element: <BlogForm /> },

            // Product Inquiry Routes
            { path: 'product-inquiry-table', element: <ProductInquiryTable /> },

            // About Us Routes
            { path: 'about-us-table', element: <AboutUsTable /> },
            { path: 'about-us-form', element: <AboutUsForm /> },
            { path: 'edit-about-us-form/:id', element: <AboutUsForm /> },

            // Banner Routes
            { path: 'banner-table', element: <BannerTable /> },
            { path: 'add-banner', element: <AddBannerForm /> },
            { path: 'edit-banner-form/:id', element: <EditBannerForm /> },
          
            { path: 'worldwide-table', element: <WorldWideBackend /> },
            { path: 'worldwide/add', element: <WorldwideForm /> },
            { path: 'worldwide/edit/:id', element: <WorldwideForm /> },
          
          // Career Management Routes
          { path: 'career-table', element: <CareerTable /> },
          { path: 'career/add', element: <CareerAdminForm /> },
          { path: 'career/edit/:id', element: <CareerAdminForm /> },
        
          // Logo Management Routes
          { path: 'logo-table', element: <Logo /> },
          { path: 'add-logo', element: <LogoForm /> },
          { path: 'edit-logo/:id', element: <LogoForm /> },

          // Contact Info Management Routes
          { path: 'contact-info-table', element: <ContactInfoForm /> },
          // { path: 'contact-info/add', element: <ContactForm /> },
          // { path: 'contact-info/edit/:id', element: <ContactForm /> },
       
          // Menu Listing Routes
          {path: 'menu-listing-table', element: <MenuListingTable />},
          {path: 'menu-listing-form', element: <MenuListingForm />},
          {path: 'menu-listing-form/:id', element: <MenuListingForm />},


          // Meta Routes
          {path : 'meta-table' ,  element:<MetaList/>},
          {path : 'meta-form' ,  element:<StaticMetaForm/>},
          {path : 'edit-meta-form/:id' ,  element:<StaticMetaForm/>},


          //slide show
          {path : 'slideShow-form' ,  element:<ImageUploadForm/>},
          {path : 'slideShow-table' ,  element:<SlideShowTable/>},

        ]
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
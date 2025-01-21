import { Mail, MapPin, Phone } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import img from "../../images/footerbg.jpg"
export default function Footer() {
  const location = useLocation(); 
  const navigate = useNavigate();

  // Effect to handle scroll to top on route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  // Custom Link component that handles smooth scroll
  const ScrollLink = ({ to, children, className }) => {
    const handleClick = (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      // Use React Router's navigate instead of window.location
      setTimeout(() => {
        navigate(to);
      }, 500);
    };

    return (
      <Link to={to} onClick={handleClick} className={className}>
        {children}
      </Link>
    );
  };

  return (
    <>
      <footer className="text-white h-[430px] py-12" style={{
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="max-w-[75rem] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4">
            {/* Corporate Section */}
            <div className="lg:w-[292px]">
              <h2 className="text-xl font-medium mb-6">Corporate</h2>
              <ul className="space-y-3 text-[13px]">
                <li><ScrollLink to="/introduction" className="hover:text-gray-200">Introduction</ScrollLink></li>
                <li><ScrollLink to="/vision-mission" className="hover:text-gray-200">Vision & Mission</ScrollLink></li>
                {/* <li><ScrollLink to="/manufacturing-facilities-solvents" className="hover:text-gray-200">Manufacturing Facilities Solvents</ScrollLink></li>
                <li><ScrollLink to="/manufacturing-facilities-solids" className="hover:text-gray-200">Manufacturing Facilities Solids</ScrollLink></li>
                <li><ScrollLink to="/quality-assurance" className="hover:text-gray-200">Quality Assurance</ScrollLink></li>
                <li><ScrollLink to="/certification" className="hover:text-gray-200">Certification</ScrollLink></li>
                <li><ScrollLink to="/grades-of-purity" className="hover:text-gray-200">Grades of Purity</ScrollLink></li>
                <li><ScrollLink to="/bulk-packs" className="hover:text-gray-200">Bulk Packs</ScrollLink></li>
                <li><ScrollLink to="/flipbook" className="hover:text-gray-200">Flipbook</ScrollLink></li> */}
              </ul>
            </div>

            {/* Products Section - Modified to span 2 columns */}
            <div className="lg:w-[585px] md:col-span-2">
              <h2 className="text-xl font-medium mb-6">Products</h2>
              <div className="grid grid-cols-2 gap-8">
                {/* Chemicals */}
                <div>
                  <h3 className="font-medium mb-4">Chemicals</h3>
                  <ul className="space-y-3 text-[13px]">
                    <li><ScrollLink to="/" className="hover:text-gray-200">Others</ScrollLink></li>
                    <li><ScrollLink to="/" className="hover:text-gray-200">Advanced Disinfection Solution</ScrollLink></li>
                    <li><ScrollLink to="/chemicals/acids-and-bases" className="hover:text-gray-200">Acids And Bases</ScrollLink></li>
                    <li><ScrollLink to="/" className="hover:text-gray-200">Adsorbents</ScrollLink></li>
                    <li><ScrollLink to="/" className="hover:text-gray-200">Aldehyde & Derivatives</ScrollLink></li>
                    <li><ScrollLink to="/chemicals" className="hover:text-gray-200">View More</ScrollLink></li>
                  </ul>
                </div>
                {/* Microbiology */}
                <div>
                  <h3 className="font-medium mb-4">Microbiology</h3>
                  <ul className="space-y-3 text-[13px]">
                    <li><ScrollLink to="/microbiology/animal-cell-culture" className="hover:text-gray-200">Animal Cell Culture</ScrollLink></li>
                    <li><ScrollLink to="/microbiology/plant-tissue-culture" className="hover:text-gray-200">Plant Tissue Culture</ScrollLink></li>
                    <li><ScrollLink to="/microbiology/ready-prepared-media" className="hover:text-gray-200">Ready Prepared Media</ScrollLink></li>
                    <li><ScrollLink to="/microbiology/dehydrated-culture-media" className="hover:text-gray-200">Dehydrated Culture Media</ScrollLink></li>
                    <li><ScrollLink to="/microbiology/culture-media-bases" className="hover:text-gray-200">Culture Media Bases</ScrollLink></li>
                    <li><ScrollLink to="/microbiology" className="hover:text-gray-200">View More</ScrollLink></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Corporate Office */}
            <div className="lg:w-[292px]">
              <h2 className="text-xl font-medium mb-6">Corporate Office:</h2>
              <div className="space-y-6">
                <div className="flex items-start text-[13px] gap-3">
                  <MapPin className="w-5 h-5 mt-1 text-orange-500 flex-shrink-0" />
                  <p>V2 Signature, 135-136, Chala, Vapi, Gujarat 396191 (INDIA).</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <a href="mailto:sales@cdhfinechemical.com" className="hover:text-gray-200">
                  hello@rndtechnosoft.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <p>+91-730 494 5823</p>
                </div>
                <div className="flex gap-2 mt-6">
                  <a href="https://www.facebook.com/cdhfinechemical" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
                    <span className="sr-only">Facebook</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="https://in.pinterest.com/cdhfinechemical" target="_blank" rel="noopener noreferrer" className="hover:text-gray-200">
                    <span className="sr-only">Pinterest</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.525-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="w-full p-2 bg-black/95">
        <div className="text-left max-w-[75rem] mx-auto">
          <p className="p-2 text-gray-500 text-sm">&copy; {new Date().getFullYear()} Copyright: Central Drug House. All rights reserved.</p>
        </div>
      </div>
    </>
  );
}
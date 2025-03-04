import { Mail, MapPin, Phone } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import img from '../../images/footerbg.jpg';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    axios
      .get('/api/contactInfo/get')
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setContactInfo(response.data[0]);
        } else {
          console.error('API response is empty or invalid:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching contact info:', error);
      });
  }, []);

  const ScrollLink = ({ to, children, className }) => {
    const handleClick = (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <footer
        className="text-white py-12"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-[75rem] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Corporate Section */}
            <div>
              <h2 className="text-xl font-medium mb-6">Corporate</h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <ScrollLink to="/introduction" className="hover:text-gray-200">
                    Introduction
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink to="/vision-mission" className="hover:text-gray-200">
                    Vision & Mission
                  </ScrollLink>
                </li>
              </ul>
            </div>

            {/* Products Section */}
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-xl font-medium mb-6">Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Chemicals</h3>
                  <ul className="space-y-3 text-sm">
                    <li><ScrollLink to="/" className="hover:text-gray-200">Others</ScrollLink></li>
                    <li><ScrollLink to="/" className="hover:text-gray-200">Advanced Disinfection Solution</ScrollLink></li>
                    <li><ScrollLink to="/chemicals/acids-and-bases" className="hover:text-gray-200">Acids And Bases</ScrollLink></li>
                    <li><ScrollLink to="/" className="hover:text-gray-200">Adsorbents</ScrollLink></li>
                    <li><ScrollLink to="/" className="hover:text-gray-200">Aldehyde & Derivatives</ScrollLink></li>
                    <li><ScrollLink to="/chemicals" className="hover:text-gray-200">View More</ScrollLink></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-4">Microbiology</h3>
                  <ul className="space-y-3 text-sm">
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
            <div>
              <h2 className="text-xl font-medium mb-6">Corporate Office:</h2>
              {contactInfo ? (
                <div className="space-y-6 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <p>{contactInfo.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-gray-200">
                      {contactInfo.emails}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <p>
                      {contactInfo.mobiles && contactInfo.mobiles.length > 0 ? (
                        <>
                          <span>{contactInfo.mobiles[0]}</span>
                          {contactInfo.mobiles[1] && <span>, {contactInfo.mobiles[1]}</span>}
                        </>
                      ) : (
                        'No contact numbers available'
                      )}
                    </p>
                  </div>
                  <div className="flex gap-4 text-gray-300 mt-6">
                    <ScrollLink to="/privacy-policy" className="hover:text-gray-200">
                      Privacy Policy
                    </ScrollLink>
                    <ScrollLink to="/terms-and-conditions" className="hover:text-gray-200">
                      Terms & Conditions
                    </ScrollLink>
                  </div>
                </div>
              ) : (
                <p>Loading contact information...</p>
              )}
            </div>
          </div>
        </div>
      </footer>
      <div className="w-full bg-black/95 p-2">
        <div className="max-w-[75rem] mx-auto text-left text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </div>
    </>
  );
}
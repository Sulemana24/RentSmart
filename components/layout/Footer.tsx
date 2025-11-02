import React from "react";
import Logo from "../../public/images/logo.jpg";
import {
  FaFacebook,
  FaWhatsapp,
  FaTwitter,
  FaTiktok,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img src={Logo.src} alt="Logo" className="h-10 w-auto mb-4" />

            <p className="text-gray-300 mb-4">
              Find your perfect place to stay from over 200 properties
              nationwide. The best prices guaranteed with exceptional service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#FF4FA1] hover:text-white">
                <FaFacebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-[#FF4FA1] hover:text-white">
                <FaTiktok className="w-6 h-6" />
              </a>
              <a href="#" className="text-[#FF4FA1] hover:text-white">
                <FaYoutube className="w-6 h-6" />
              </a>
              <a href="#" className="text-[#FF4FA1] hover:text-white">
                <FaWhatsapp className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="about" className="text-gray-300 hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="contact" className="text-gray-300 hover:text-white">
                  Contact
                </a>
              </li>
              <li>
                <a href="support" className="text-gray-300 hover:text-white">
                  Support
                </a>
              </li>
              <li>
                <a href="faq" className="text-gray-300 hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="career" className="text-gray-300 hover:text-white">
                  Career
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="privacy" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="terms" className="text-gray-300 hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} RentSmart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

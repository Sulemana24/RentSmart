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
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src={Logo.src}
                alt="Logo"
                className="h-12 w-auto transition-transform hover:scale-105"
              />
              <span className="text-xl font-bold bg-[#00CFFF] bg-clip-text text-transparent">
                RentSmart
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              Find your perfect place to stay from over 200 properties
              nationwide. The best prices guaranteed with exceptional service.
            </p>

            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[#FF4FA1] dark:hover:text-[#FF4FA1] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[#FF4FA1] dark:hover:text-[#FF4FA1] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110"
                aria-label="TikTok"
              >
                <FaTiktok className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[#FF4FA1] dark:hover:text-[#FF4FA1] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110"
                aria-label="YouTube"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[#FF4FA1] dark:hover:text-[#FF4FA1] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[#FF4FA1] dark:hover:text-[#FF4FA1] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-[#00CFFF] rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: "About Us", href: "about" },
                { name: "Contact", href: "contact" },
                { name: "Support", href: "support" },
                { name: "FAQ", href: "faq" },
                { name: "Career", href: "career" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-[#FF4FA1] dark:hover:text-[#FF4FA1] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full group-hover:bg-[#FF4FA1] group-hover:scale-125 transition-all"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-[#00CFFF] rounded-full"></span>
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="p-2 bg-[#FF4FA1] rounded-lg">
                  <FiMapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    USTED, Tanoso
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Kumasi
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-[#FF4FA1] rounded-lg">
                  <FiPhone className="w-5 h-5 text-white" />
                </div>
                <a
                  href="tel:+233551333780"
                  className="text-gray-600 dark:text-gray-300 hover:text-[#FF4FA1] dark:hover:text-[#FF4FA1] transition-colors"
                >
                  +233 55 133 3780
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-[#FF4FA1] rounded-lg">
                  <FiMail className="w-5 h-5 text-white" />
                </div>
                <a
                  href="mailto:iddrisusulemana665@gmail.com"
                  className="text-gray-600 dark:text-gray-300 hover:text-[#FF4FA1] dark:hover:text-[#FF4FA1] transition-colors"
                >
                  iddrisusulemana665@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 dark:border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} RentSmart. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <a
                href="privacy"
                className="text-gray-500 dark:text-gray-400 hover:text-[#FF4FA1] dark:hover:text-[#FF4FA1] text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="terms"
                className="text-gray-500 dark:text-gray-400 hover:text-[#FF4FA1] dark:hover:text-[#FF4FA1] text-sm transition-colors"
              >
                Terms of Service
              </a>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Made with
              </span>
              <span className="text-[#FF4FA1] animate-pulse">❤️</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                by Simli Technologies
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FaEnvelope,
  FaPhone,
  FaCommentDots,
  FaBuilding,
  FaClock,
  FaHome,
  FaInfoCircle,
  FaClipboardCheck,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaComment,
} from "react-icons/fa";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactMethods = [
    {
      icon: <FaEnvelope className="text-2xl" />,
      title: "Email Us",
      details: "iddrisusulemana665@gmail.com",
      description: "Send us an email anytime",
    },
    {
      icon: <FaPhone className="text-2xl" />,
      title: "Call Us",
      details: "+233 (55) 133-3780",
      description: "Mon-Fri from 8am to 6pm",
    },
    {
      icon: <FaCommentDots className="text-2xl" />,
      title: "Live Chat",
      details: "+233 (55) 133-3780",
      description: "24/7 customer support",
    },
    {
      icon: <FaBuilding className="text-2xl" />,
      title: "Visit Us",
      details: "AAMUSTED, Tanoso, Kumasi",
      description: "Come say hello at our office",
    },
  ];

  const quickLinks = [
    {
      icon: <FaHome className="text-lg" />,
      text: "Browse Properties",
      href: "/",
    },
    {
      icon: <FaInfoCircle className="text-lg" />,
      text: "Learn About Us",
      href: "/about",
    },
    {
      icon: <FaClipboardCheck className="text-lg" />,
      text: "Check Booking Status",
      href: "/booking-status",
    },
  ];

  const officeHours = [
    { day: "Monday - Friday", time: "8:00 AM - 6:00 PM" },
    { day: "Saturday", time: "9:00 AM - 4:00 PM" },
    { day: "Sunday", time: "10:00 AM - 2:00 PM" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-white dark:bg-black bg-opacity-20 dark:bg-opacity-60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200">
            Get in touch with our team - we're here to help!
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
              <FaComment className="text-[#00CFFF]" />
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Have questions about our properties? Need help with your booking?
              Our team is here to assist you with any inquiries.
            </p>

            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <div className="text-[#00CFFF] flex-shrink-0 p-2 bg-white dark:bg-gray-700 rounded-lg">
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black dark:text-white">
                      {method.title}
                    </h3>
                    <p className="text-[#FF4FA1] dark:text-[#00CFFF] font-medium">
                      {method.details}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {method.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Office Hours */}
            <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
                <FaClock className="text-[#00CFFF]" />
                Office Hours
              </h3>
              <div className="space-y-3">
                {officeHours.map((hour, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                  >
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {hour.day}
                    </span>
                    <span className="text-[#FF4FA1] dark:text-[#00CFFF] font-semibold">
                      {hour.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#00CFFF]" />
                Quick Links
              </h3>
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-[#FF4FA1] dark:hover:text-[#00CFFF] transition-colors duration-200 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  >
                    <span className="text-[#00CFFF]">{link.icon}</span>
                    <span>{link.text}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border dark:border-gray-700">
            <h3 className="text-2xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2 flex items-center gap-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2 flex items-center gap-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2 flex items-center gap-2"
                >
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                >
                  <option value="" className="dark:text-white">
                    Select a subject
                  </option>
                  <option value="general" className="dark:text-white">
                    General Inquiry
                  </option>
                  <option value="booking" className="dark:text-white">
                    Booking Help
                  </option>
                  <option value="property" className="dark:text-white">
                    Property Listing
                  </option>
                  <option value="technical" className="dark:text-white">
                    Technical Support
                  </option>
                  <option value="other" className="dark:text-white">
                    Other
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2 flex items-center gap-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00CFFF] focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 resize-none transition-all duration-200"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#FF4FA1] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FaPaperPlane />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <section className="py-16 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#00CFFF]/10 mb-4">
              <FaMapMarkerAlt className="text-3xl text-[#00CFFF]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white mb-4">
              Visit Our Office
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Stop by our office to discuss your rental needs in person
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl shadow-lg p-8 border dark:border-gray-600">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7886882850197!2d-1.6621900240662392!3d6.693552993304178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x233e3c9e76124b85%3A0x86d2f825e2d7a622!2sAAMUSTED%2C%20Tanoso%2C%20Kumasi!5e0!3m2!1sen!2sgh!4v1698349283739!5m2!1sen!2sgh"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

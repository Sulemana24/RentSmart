import Header from "../components/layout/Header";
import Link from "next/link";
import { useState } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaHeadset,
  FaMoneyBillWave,
  FaHome,
  FaUsers,
  FaCity,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaBuilding,
  FaPhone,
  FaSearch,
} from "react-icons/fa";

export default function AboutPage() {
  const [showFullMission, setShowFullMission] = useState(false);

  const features = [
    {
      title: "Easy Booking",
      description:
        "Simple and straightforward booking process for all properties",
      icon: <FaCalendarAlt className="text-3xl" />,
    },
    {
      title: "Verified Properties",
      description:
        "All properties are verified and quality-checked for your safety",
      icon: <FaCheckCircle className="text-3xl" />,
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist you anytime",
      icon: <FaHeadset className="text-3xl" />,
    },
    {
      title: "Best Prices",
      description: "Competitive pricing with no hidden charges",
      icon: <FaMoneyBillWave className="text-3xl" />,
    },
  ];

  const stats = [
    {
      number: "10,000+",
      label: "Properties Listed",
      icon: <FaHome className="text-xl" />,
    },
    {
      number: "50,000+",
      label: "Happy Customers",
      icon: <FaUsers className="text-xl" />,
    },
    {
      number: "100+",
      label: "Cities Covered",
      icon: <FaCity className="text-xl" />,
    },
    {
      number: "24/7",
      label: "Customer Support",
      icon: <FaClock className="text-xl" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section className="relative py-20 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <FaBuilding className="text-4xl text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Us</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200">
            We're revolutionizing the way people find and book rental properties
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                <FaBuilding className="text-[#00CFFF]" />
                Our Mission
              </h2>
              <p className="text-lg text-gray-800 dark:text-gray-300 mb-6">
                We believe everyone deserves to find their perfect home without
                the hassle. Our platform connects property owners with potential
                tenants in a seamless, transparent, and efficient way.
              </p>

              {/* Expanded Mission Content */}
              {showFullMission && (
                <div className="space-y-4 mb-6">
                  <p className="text-lg text-gray-800 dark:text-gray-300">
                    Founded with the vision to simplify rental processes, we've
                    helped thousands of people find their dream homes and
                    property owners to maximize their returns.
                  </p>
                  <p className="text-lg text-gray-800 dark:text-gray-300">
                    Our team of real estate experts and technology professionals
                    work tirelessly to ensure every property listing meets our
                    high standards for quality and accuracy.
                  </p>
                  <p className="text-lg text-gray-800 dark:text-gray-300">
                    We're committed to creating a rental experience that's not
                    just easy, but enjoyable for everyone involved.
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowFullMission(!showFullMission)}
                  className="bg-[#FF4FA1] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 font-semibold flex items-center gap-2"
                >
                  {showFullMission ? (
                    <>
                      <FaChevronUp />
                      Show Less
                    </>
                  ) : (
                    <>
                      <FaChevronDown />
                      Learn More
                    </>
                  )}
                </button>
                <Link href="/contact">
                  <button className="border border-[#00CFFF] text-[#00CFFF] px-6 py-3 rounded-lg hover:bg-[#00CFFF] hover:text-white transition-colors duration-200 font-semibold flex items-center gap-2">
                    <FaPhone />
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Our team"
                className="rounded-lg w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 text-center bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <div className="text-[#00CFFF] mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-[#FF4FA1] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-700 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00CFFF]/10 mb-4">
              <FaCheckCircle className="text-3xl text-[#00CFFF]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-400 max-w-2xl mx-auto">
              We provide the best rental experience with these key features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 border dark:border-gray-700 hover:border-[#00CFFF]"
              >
                <div className="text-[#FF4FA1] mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF4FA1] mb-4">
            <FaHome className="text-2xl text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their dream rental
            through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="bg-[#FF4FA1] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 flex items-center gap-2">
                <FaSearch />
                Browse Properties
              </button>
            </Link>
            <Link href="/contact">
              <button className="border border-gray-500 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg font-semibold hover:border-[#00CFFF] hover:text-[#00CFFF] transition-colors duration-200 flex items-center gap-2">
                <FaPhone />
                Contact Our Team
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

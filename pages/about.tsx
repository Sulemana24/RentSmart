import Header from "../components/layout/Header";
import Link from "next/link";
import { useState } from "react";

export default function AboutPage() {
  const [showFullMission, setShowFullMission] = useState(false);

  const features = [
    {
      title: "Easy Booking",
      description:
        "Simple and straightforward booking process for all properties",
      icon: "📅",
    },
    {
      title: "Verified Properties",
      description:
        "All properties are verified and quality-checked for your safety",
      icon: "✅",
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist you anytime",
      icon: "📞",
    },
    {
      title: "Best Prices",
      description: "Competitive pricing with no hidden charges",
      icon: "💰",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Properties Listed" },
    { number: "50,000+", label: "Happy Customers" },
    { number: "100+", label: "Cities Covered" },
    { number: "24/7", label: "Customer Support" },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 text-white">
        {/* Background Image with Overlay */}
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Us</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200">
            We're revolutionizing the way people find and book rental properties
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                We believe everyone deserves to find their perfect home without
                the hassle. Our platform connects property owners with potential
                tenants in a seamless, transparent, and efficient way.
              </p>

              {/* Expanded Mission Content */}
              {showFullMission && (
                <div className="space-y-4 mb-6">
                  <p className="text-lg text-gray-300">
                    Founded with the vision to simplify rental processes, we've
                    helped thousands of people find their dream homes and
                    property owners to maximize their returns.
                  </p>
                  <p className="text-lg text-gray-300">
                    Our team of real estate experts and technology professionals
                    work tirelessly to ensure every property listing meets our
                    high standards for quality and accuracy.
                  </p>
                  <p className="text-lg text-gray-300">
                    We're committed to creating a rental experience that's not
                    just easy, but enjoyable for everyone involved.
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowFullMission(!showFullMission)}
                  className="bg-[#00CFFF] text-white px-6 py-3 rounded-lg hover:bg-[#FF4FA1] transition-colors duration-200 font-semibold"
                >
                  {showFullMission ? "Show Less" : "Learn More"}
                </button>
                <Link href="/contact">
                  <button className="border border-[#00CFFF] text-[#00CFFF] px-6 py-3 rounded-lg hover:bg-[#00CFFF] hover:text-white transition-colors duration-200 font-semibold">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-700">
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
      <section className="py-16 bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-3xl md:text-4xl font-bold text-[#00CFFF] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              We provide the best rental experience with these key features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-700"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-800 border-t border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their dream rental
            through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="bg-[#FF4FA1] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#00CFFF] transition-colors duration-200">
                Browse Properties
              </button>
            </Link>
            <Link href="/contact">
              <button className="border border-gray-500 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:border-[#00CFFF] hover:text-[#00CFFF] transition-colors duration-200">
                Contact Our Team
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

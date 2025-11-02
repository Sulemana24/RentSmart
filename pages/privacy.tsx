export default function PrivacyPolicy() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-20 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
          <div className="prose prose-lg max-w-none prose-invert">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-300 mb-4">
                Welcome to our rental platform. We are committed to protecting
                your personal information and your right to privacy. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our rental platform and
                services.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold text-gray-200 mb-3">
                Personal Information
              </h3>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Name, email address, and phone number</li>
                <li>
                  Payment information (processed securely through PayStack)
                </li>
                <li>Property preferences and booking history</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-200 mb-3">
                Automatically Collected Information
              </h3>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Usage data and interaction with our platform</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>To provide and maintain our rental services</li>
                <li>To process your bookings and payments</li>
                <li>To communicate with you about your account and bookings</li>
                <li>
                  To personalize your experience and provide relevant property
                  recommendations
                </li>
                <li>To improve our platform and develop new features</li>
                <li>To ensure the security and integrity of our services</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                4. Information Sharing
              </h2>
              <p className="text-gray-300 mb-4">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except in the
                following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>With property owners for booking coordination</li>
                <li>
                  With payment processors (PayStack) for transaction processing
                </li>
                <li>With service providers who assist our operations</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                5. Data Security
              </h2>
              <p className="text-gray-300 mb-4">
                We implement appropriate technical and organizational security
                measures designed to protect your personal information. However,
                no electronic transmission over the internet or information
                storage technology can be guaranteed to be 100% secure.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                6. Your Rights
              </h2>
              <p className="text-gray-300 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Access and receive a copy of your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete your personal information</li>
                <li>
                  Restrict or object to our processing of your information
                </li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                7. Cookies and Tracking
              </h2>
              <p className="text-gray-300 mb-4">
                We use cookies and similar tracking technologies to track
                activity on our platform and hold certain information. You can
                instruct your browser to refuse all cookies or to indicate when
                a cookie is being sent.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                8. Children's Privacy
              </h2>
              <p className="text-gray-300 mb-4">
                Our service is not intended for individuals under the age of 18.
                We do not knowingly collect personal information from children
                under 18.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                9. Changes to This Policy
              </h2>
              <p className="text-gray-300 mb-4">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                10. Contact Us
              </h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                <p className="text-gray-300">
                  <strong className="text-white">Email:</strong>{" "}
                  iddrisusulemana665@gmail.com
                  <br />
                  <strong className="text-white">Phone:</strong> +233 55 133
                  3780
                  <br />
                  <strong className="text-white">Address:</strong> AAMUSTED,
                  Tanoso - Kumasi, Ghana
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}

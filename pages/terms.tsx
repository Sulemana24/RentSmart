export default function TermsOfService() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-20 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Effective date: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
          <div className="prose prose-lg max-w-none prose-invert">
            {/* Agreement */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                1. Agreement to Terms
              </h2>
              <p className="text-gray-300 mb-4">
                By accessing or using our rental platform, you agree to be bound
                by these Terms of Service and our Privacy Policy. If you
                disagree with any part of these terms, you may not access our
                services.
              </p>
            </section>

            {/* User Accounts */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                2. User Accounts
              </h2>
              <p className="text-gray-300 mb-4">
                When you create an account with us, you must provide accurate,
                complete, and current information. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>
                  Maintaining the confidentiality of your account credentials
                </li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>
                  Ensuring you logout from your account at the end of each
                  session
                </li>
              </ul>
            </section>

            {/* User Responsibilities */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                3. User Responsibilities
              </h2>

              <h3 className="text-xl font-semibold text-gray-200 mb-3">
                Renters/Tenants
              </h3>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Provide accurate booking information</li>
                <li>Respect property rules and regulations</li>
                <li>Make timely payments as agreed</li>
                <li>Treat properties with care and respect</li>
                <li>Communicate honestly with property owners</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-200 mb-3">
                Home Owners/Landlords
              </h3>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Provide accurate property information and photos</li>
                <li>Maintain properties in safe and habitable condition</li>
                <li>Respond promptly to booking inquiries</li>
                <li>Honor confirmed bookings and pricing</li>
                <li>Respect tenant privacy and rights</li>
              </ul>
            </section>

            {/* Booking and Payments */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                4. Booking and Payments
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>All bookings are subject to property availability</li>
                <li>Payments are processed securely through PayStack</li>
                <li>Booking fees and agent commissions are non-refundable</li>
                <li>
                  Property owners receive payment after successful check-in
                </li>
                <li>
                  We reserve the right to cancel bookings that violate our
                  policies
                </li>
              </ul>
            </section>

            {/* Cancellation and Refunds */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                5. Cancellation and Refunds
              </h2>

              <h3 className="text-xl font-semibold text-gray-200 mb-3">
                Cancellation by Renter
              </h3>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>
                  More than 30 days before check-in: Full refund (minus fees)
                </li>
                <li>15-30 days before check-in: 50% refund</li>
                <li>Less than 15 days before check-in: No refund</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-200 mb-3">
                Cancellation by Owner
              </h3>
              <p className="text-gray-300 mb-4">
                If a property owner cancels a confirmed booking, we will help
                you find alternative accommodation and provide a full refund.
              </p>
            </section>

            {/* Property Listings */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                6. Property Listings
              </h2>
              <p className="text-gray-300 mb-4">
                Property owners are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Accurate and truthful property descriptions</li>
                <li>Current and representative photos</li>
                <li>Disclosing any property issues or restrictions</li>
                <li>Maintaining valid ownership or management rights</li>
                <li>Complying with local rental regulations and laws</li>
              </ul>
            </section>

            {/* Prohibited Activities */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                7. Prohibited Activities
              </h2>
              <p className="text-gray-300 mb-4">
                You may not use our platform to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Post false, misleading, or fraudulent information</li>
                <li>Harass, abuse, or harm another person</li>
                <li>Violate any applicable laws or regulations</li>
                <li>
                  Use the platform for any illegal or unauthorized purpose
                </li>
                <li>Interfere with or disrupt the platform's functionality</li>
                <li>Attempt to gain unauthorized access to other accounts</li>
                <li>Transmit any viruses or malicious code</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                8. Intellectual Property
              </h2>
              <p className="text-gray-300 mb-4">
                The platform and its original content, features, and
                functionality are owned by us and are protected by international
                copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                9. Limitation of Liability
              </h2>
              <p className="text-gray-300 mb-4">
                To the maximum extent permitted by law, we shall not be liable
                for any indirect, incidental, special, consequential, or
                punitive damages, including without limitation, loss of profits,
                data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>
                  Your access to or use of or inability to access or use the
                  platform
                </li>
                <li>
                  Any conduct or content of any third party on the platform
                </li>
                <li>Any content obtained from the platform</li>
                <li>
                  Unauthorized access, use, or alteration of your transmissions
                  or content
                </li>
              </ul>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                10. Termination
              </h2>
              <p className="text-gray-300 mb-4">
                We may terminate or suspend your account immediately, without
                prior notice or liability, for any reason whatsoever, including
                without limitation if you breach the Terms.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                11. Governing Law
              </h2>
              <p className="text-gray-300 mb-4">
                These Terms shall be governed and construed in accordance with
                the laws of Ghana, without regard to its conflict of law
                provisions.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                12. Changes to Terms
              </h2>
              <p className="text-gray-300 mb-4">
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. By continuing to access or use
                our platform after those revisions become effective, you agree
                to be bound by the revised terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">
                13. Contact Information
              </h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about these Terms, please contact us:
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

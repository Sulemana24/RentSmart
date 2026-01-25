import {
  FaBriefcase,
  FaHome,
  FaMoneyBillWave,
  FaUsers,
  FaFileAlt,
  FaHeadset,
  FaBullhorn,
  FaCogs,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";

export default function CareerPage() {
  const openPositions: any[] = [
    // Currently no open positions
  ];

  const benefits = [
    {
      icon: <FaBriefcase className="text-3xl mx-auto" />,
      title: "Professional Growth",
      description: "Career development opportunities",
    },
    {
      icon: <FaHome className="text-3xl mx-auto" />,
      title: "Flexible Work",
      description: "Remote work options and flexible hours",
    },
    {
      icon: <FaMoneyBillWave className="text-3xl mx-auto" />,
      title: "Competitive Salary",
      description: "Attractive compensation package",
    },
    {
      icon: <FaUsers className="text-3xl mx-auto" />,
      title: "Great Team",
      description: "Work with passionate people",
    },
  ];

  const futureRoles = [
    {
      icon: <FaFileAlt className="text-lg" />,
      name: "Frontend Development",
    },
    {
      icon: <FaHeadset className="text-lg" />,
      name: "Customer Support",
    },
    {
      icon: <FaBullhorn className="text-lg" />,
      name: "Marketing",
    },
    {
      icon: <FaCogs className="text-lg" />,
      name: "Operations",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-20 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Help us revolutionize the rental industry
            </p>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold dark:text-white mb-4">
            Why Work With RentSmart?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Build your career while making a difference in the rental industry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border dark:border-gray-700 hover:border-[#00CFFF] transition-colors duration-200"
            >
              <div className="text-[#00CFFF] mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold dark:text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold dark:text-white mb-4">
            Current Openings
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
            Explore career opportunities with RentSmart
          </p>
        </div>

        {openPositions.length > 0 ? (
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border dark:border-gray-700 hover:border-[#FF4FA1] transition-colors duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold dark:text-white mb-2">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                        {position.department}
                      </span>
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                        {position.type}
                      </span>
                      <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                        {position.location}
                      </span>
                    </div>
                  </div>
                  <button className="bg-[#00CFFF] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#FF4FA1] transition-colors lg:ml-4 mt-4 lg:mt-0">
                    Apply Now
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {position.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                <FaFileAlt className="text-4xl text-[#00CFFF]" />
              </div>
              <h3 className="text-2xl font-bold dark:text-white mb-4">
                No Open Positions Currently
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                We are not currently hiring, but we're always interested in
                connecting with talented individuals. Check back soon for new
                opportunities or submit your resume for future consideration.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 max-w-2xl mx-auto">
              <h4 className="text-xl font-semibold dark:text-white mb-4">
                Future Opportunities
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                While we don't have open positions right now, we may have
                opportunities in the following areas in the future:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {futureRoles.map((role, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="text-[#00CFFF]">{role.icon}</div>
                    <span className="dark:text-gray-300">{role.name}</span>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Want to be the first to know when we're hiring?
                </p>
                <button className="bg-[#FF4FA1] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00CFFF] transition-colors flex items-center justify-center gap-2 mx-auto">
                  <FaEnvelope />
                  Join Talent Community
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default function CareerPage() {
  const openPositions = [
    {
      title: "Frontend Developer",
      department: "Technology",
      type: "Full-time",
      location: "Accra, Ghana",
      description:
        "Join our tech team to build amazing user experiences for our rental platform.",
    },
    {
      title: "Customer Support Specialist",
      department: "Operations",
      type: "Full-time",
      location: "Remote",
      description:
        "Help our users with their booking inquiries and provide exceptional support.",
    },
  ];

  const benefits = [
    {
      icon: "💼",
      title: "Professional Growth",
      description: "Career development opportunities",
    },
    {
      icon: "🏠",
      title: "Flexible Work",
      description: "Remote work options and flexible hours",
    },
    {
      icon: "💰",
      title: "Competitive Salary",
      description: "Attractive compensation package",
    },
    {
      icon: "👥",
      title: "Great Team",
      description: "Work with passionate people",
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
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Why Work With RentSmart?
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
            Build your career while making a difference in the rental industry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700 hover:border-[#00CFFF] transition-colors duration-200"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-400">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Open Positions
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
            Explore current career opportunities
          </p>
        </div>

        <div className="space-y-6">
          {openPositions.map((position, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-[#FF4FA1] transition-colors duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
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
              <p className="text-gray-400">{position.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

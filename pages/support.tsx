import {
  FaEnvelope,
  FaPhone,
  FaQuestionCircle,
  FaCalendarAlt,
  FaCreditCard,
  FaHeadset,
} from "react-icons/fa";

export default function SupportPage() {
  const supportMethods = [
    {
      icon: <FaEnvelope className="text-4xl" />,
      title: "Email Support",
      description: "Get help via email",
      details: "iddrisusulemana665@gmail.com",
      responseTime: "Within 24 hours",
    },
    {
      icon: <FaPhone className="text-4xl" />,
      title: "Phone Support",
      description: "Call our support team",
      details: "+233 55 133 3780",
      responseTime: "Mon-Fri, 8AM-6PM",
    },
  ];

  const commonIssues = [
    {
      icon: <FaQuestionCircle className="text-xl" />,
      question: "How do I reset my password?",
      answer:
        "Click 'Forgot Password' on the login page and follow the instructions sent to your email.",
    },
    {
      icon: <FaCalendarAlt className="text-xl" />,
      question: "How can I update my booking?",
      answer:
        "Contact support with your booking code and requested changes at least 48 hours before check-in.",
    },
    {
      icon: <FaCreditCard className="text-xl" />,
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards and mobile money through our secure PayStack integration.",
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
              'url("https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <FaHeadset className="text-4xl text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Support Center
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              We're here to help you with any questions or issues
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold dark:text-white mb-4">
            Get Help
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-500 max-w-2xl mx-auto">
            Choose your preferred support method
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {supportMethods.map((method, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border dark:border-gray-700 hover:border-[#00CFFF] transition-colors duration-200 hover:shadow-xl"
            >
              <div className="text-[#00CFFF] mb-4">{method.icon}</div>
              <h3 className="text-2xl font-bold dark:text-white mb-2">
                {method.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {method.description}
              </p>
              <p className="text-[#00CFFF] text-lg font-semibold mb-2">
                {method.details}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Response: {method.responseTime}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border dark:border-gray-700 shadow-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00CFFF]/10 mb-4">
              <FaQuestionCircle className="text-3xl text-[#00CFFF]" />
            </div>
            <h2 className="text-3xl font-bold dark:text-white">
              Common Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Quick answers to frequently asked questions
            </p>
          </div>

          <div className="space-y-6">
            {commonIssues.map((issue, index) => (
              <div
                key={index}
                className="border dark:border-gray-700 rounded-xl p-6 hover:border-[#00CFFF] transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <div className="flex items-start gap-4">
                  <div className="text-[#00CFFF] mt-1">{issue.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold dark:text-white mb-3">
                      {issue.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {issue.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

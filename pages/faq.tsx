"use client";
import { useState } from "react";

export default function FAQPage() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const faqCategories = [
    {
      category: "Booking & Reservations",
      questions: [
        {
          question: "How do I make a booking?",
          answer:
            "Browse properties, select your dates and duration, fill in your details, and proceed to payment. You'll receive a booking confirmation with your unique code.",
        },
        {
          question: "What is the minimum rental duration?",
          answer:
            "Most properties have a minimum 1-year rental duration. Some properties may offer shorter terms - check individual property details.",
        },
      ],
    },
    {
      category: "Payments & Pricing",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit/debit cards and mobile money payments through our secure PayStack integration.",
        },
        {
          question: "Are there any hidden fees?",
          answer:
            "No hidden fees. The total price includes property rent, agent fee, and walking fee. All charges are clearly displayed before booking.",
        },
      ],
    },
  ];

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const globalIndex = categoryIndex * 10 + questionIndex;
    setOpenQuestion(openQuestion === globalIndex ? null : globalIndex);
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-20 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1436262513933-a0b06755c784?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Find answers to common questions about our rental platform
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {faqCategories.map((category, categoryIndex) => (
          <div
            key={categoryIndex}
            className="bg-gray-800 rounded-2xl p-8 border border-gray-700"
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              {category.category}
            </h2>
            <div className="space-y-4">
              {category.questions.map((item, questionIndex) => {
                const globalIndex = categoryIndex * 10 + questionIndex;
                return (
                  <div
                    key={questionIndex}
                    className="border-b border-gray-700 last:border-b-0 pb-4 last:pb-0"
                  >
                    <button
                      onClick={() =>
                        toggleQuestion(categoryIndex, questionIndex)
                      }
                      className="flex justify-between items-center w-full text-left"
                    >
                      <h3 className="text-lg font-semibold text-white pr-4">
                        {item.question}
                      </h3>
                      <span className="text-[#00CFFF] text-xl flex-shrink-0">
                        {openQuestion === globalIndex ? "−" : "+"}
                      </span>
                    </button>
                    {openQuestion === globalIndex && (
                      <div className="mt-3 pl-2">
                        <p className="text-gray-400 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Still Need Help */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FF4FA1] rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="mb-6 opacity-90">
            Can't find the answer you're looking for? Our support team is here
            to help.
          </p>
          <a
            href="contact"
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
}

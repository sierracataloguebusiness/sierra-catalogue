import React, { useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";

const faqs = [
  {
    question: "What is Sierra Catalogue?",
    answer:
      "Sierra Catalogue is an online marketplace where you can easily discover and purchase products from trusted vendors across Sierra Leone without having to move an inch.",
  },
  {
    question: "How do I create an account?",
    answer:
      "Click the user icon, fill in your basic details, and you’ll have your account ready within minutes.",
  },
  {
    question: "Do I need an account to buy?",
    answer:
      "Yes, you need an account so we can securely track your orders, delivery details, and payment history.",
  },
  {
    question: "What payment methods are supported?",
    answer: "Currently we support mobile money and cash on delivery.",
  },
  {
    question: "How do deliveries work?",
    answer:
      "Once your order is confirmed, our logistics partners deliver products straight to your location, usually within 1–3 working days depending on the vendor and your location.",
  },
  {
    question: "How do I contact support?",
    answer:
      "You can reach our support team through the 'Contact' page or WhatsApp for quick assistance.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto min-h-[40vh] px-4 py-12">
      <h1 className="heading text-center mb-10">Frequently Asked Questions</h1>

      <div className="max-w-[734px] grid md:grid-cols-2 gap-4 items-start justify-center mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-700 rounded overflow-hidden max-w-[360px]"
          >
            <button
              className="w-full flex justify-between items-center gap-4 p-4 font-medium text-left"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              {openIndex === index ? (
                <FaChevronUp className="size-5" />
              ) : (
                <FaChevronDown className="size-5" />
              )}
            </button>
            {openIndex === index && (
              <div className="p-4 pt-0 text-gray-300">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;

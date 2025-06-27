import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Lock, Zap, RefreshCw } from 'lucide-react';

const faqs = [
  {
    id: 1,
    icon: Lock,
    question: 'Are the accounts safe and secure?',
    answer: 'Absolutely! All our accounts are hand-leveled, never botted, and come with full email access. We guarantee account security and provide 30-day protection against any issues.',
    category: 'Security'
  },
  {
    id: 2,
    icon: Zap,
    question: 'How fast is the delivery?',
    answer: 'Lightning fast! Most accounts are delivered within 5 minutes of purchase confirmation. Complex custom orders may take up to 2 hours maximum.',
    category: 'Delivery'
  },
  {
    id: 3,
    icon: RefreshCw,
    question: 'What if I have issues with my account?',
    answer: 'We offer 24/7 customer support and a 30-day money-back guarantee. Our team will resolve any issues or provide a full refund if needed.',
    category: 'Support'
  },
  {
    id: 4,
    icon: HelpCircle,
    question: 'Can I change the account details after purchase?',
    answer: 'Yes! You get full access to change email, password, and other account settings. We provide detailed instructions on how to secure your new account.',
    category: 'Account'
  },
  {
    id: 5,
    icon: Lock,
    question: 'Will my payment information be secure?',
    answer: 'We use industry-standard encryption and work with trusted payment processors. Your financial information is never stored on our servers.',
    category: 'Security'
  },
  {
    id: 6,
    icon: Zap,
    question: 'Do you offer custom account requirements?',
    answer: 'Yes! Contact our team with your specific requirements. We can source accounts with particular ranks, skins, or achievements for an additional fee.',
    category: 'Custom'
  }
];

const FAQ =() => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Security': return 'from-red-500 to-orange-500';
      case 'Delivery': return 'from-blue-500 to-cyan-500';
      case 'Support': return 'from-purple-500 to-pink-500';
      case 'Account': return 'from-green-500 to-emerald-500';
      case 'Custom': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <section className="py-20 px-4 bg-white relative">
      {/* Mission Briefing Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h120v120H0z' fill='none'/%3E%3Cg fill='none' stroke='%230e4fae' stroke-width='1' stroke-opacity='0.04'%3E%3Cpath d='M60 0v120M0 60h120'/%3E%3Cpath d='M30 0v120M90 0v120M0 30h120M0 90h120'/%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-blue-100 border border-blue-300 px-6 py-2 rounded-full mb-6">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-blue-600 font-bold text-sm tracking-wider">FAQ SECTION</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-blue-700">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access critical intel about our premium gaming accounts. All questions answered.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const Icon = faq.icon;
            const isOpen = openFAQ === faq.id;
            
            return (
              <div
                key={faq.id}
                className="group bg-white border border-blue-100 rounded-xl overflow-hidden shadow hover:border-blue-400 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-6 flex items-center justify-between text-left hover:bg-blue-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-1 rounded bg-blue-200 text-blue-700`}>
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-blue-700 group-hover:text-blue-500 transition-colors duration-200">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-blue-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-gray-600 text-base animate-scale-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-gray-200 mb-4">Our elite support team is standing by 24/7</p>
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform duration-200">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
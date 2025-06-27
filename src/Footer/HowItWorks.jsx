import React, { useEffect, useState } from 'react';
import { Search, CreditCard, Download, PlayCircle } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Browse & Select',
    description: 'Explore our premium collection of Valorant and BGMI accounts with detailed stats and previews',
    color: 'from-red-500 to-orange-500'
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Complete your purchase using our encrypted payment system with multiple secure options',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Download,
    title: 'Instant Delivery',
    description: 'Receive your account credentials immediately via email with full login instructions',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: PlayCircle,
    title: 'Start Gaming',
    description: 'Log in and start dominating with your new premium account loaded with exclusive content',
    color: 'from-green-500 to-emerald-500'
  }
];

const HowItWorks = () => {
  const [visibleSteps, setVisibleSteps] = useState([false, false, false, false]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-step') || '0');
            setTimeout(() => {
              setVisibleSteps(prev => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }, index * 300);
          }
        });
      },
      { threshold: 0.3 }
    );

    const stepElements = document.querySelectorAll('[data-step]');
    stepElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M0 0h100M0 25h100M0 50h100M0 75h100M0 100h100M0 0v100M25 0v100M50 0v100M75 0v100M100 0v100' stroke='%230e4fae' stroke-width='0.5' stroke-opacity='0.06'/%3E%3C/svg%3E')] opacity-20"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-blue-700">
            HOW IT WORKS
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your premium gaming account in 4 simple steps. No complicated processes, just pure gaming excellence.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent transform -translate-x-1/2"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isVisible = visibleSteps[idx];
              return (
                <div
                  key={idx}
                  data-step={idx}
                  className={`relative flex flex-col items-center text-center bg-white rounded-3xl shadow-xl p-10 border border-blue-100 transition-all duration-500 ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-95'}`}
                  style={{ zIndex: 2 + idx }}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg transition-all duration-300 ${isVisible ? 'scale-110' : 'scale-100'}`}
                    style={{ background: `linear-gradient(135deg, #e0e7ef 0%, #dbeafe 100%)` }}>
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-700 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-lg mb-4">{step.description}</p>
                  <div className={`absolute left-1/2 -bottom-8 w-2 h-2 rounded-full bg-blue-200 ${idx === steps.length - 1 ? 'hidden' : ''}`}></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

import { Upload, Brain, CheckCircle } from 'lucide-react';
import { howItWorksSteps } from '../mock';

const iconMap = {
  1: Upload,
  2: Brain,
  3: CheckCircle
};

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-gray-50"> 
      <div className="container mx-auto px-6"> 
        <div className="text-center mb-16"> 
          <h2 className="section-title">How It Works</h2> 
          <p className="section-subtitle"> 
            Get from recording to insights in three simple steps
          </p>
        </div>

        <div className="max-w-5xl mx-auto"> 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"> 
            {howItWorksSteps.map((step, index) => {
              const Icon = iconMap[step.id];
              return (
                <div key={step.id} className="relative"> 
                  {/* Step Card */}
                  <div className="step-card group"> 
                    {/* Step Number */}
                    <div className="step-number"> 
                      {step.id}
                    </div>
                    
                    {/* Icon */}
                    <div className="step-icon-wrapper"> 
                      <Icon className="w-8 h-8 text-blue-600 group-hover:text-purple-600 transition-colors" /> 
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3"> 
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed"> 
                      {step.description}
                    </p>
                  </div>

                  {/* Connector Arrow */}
                    {index < howItWorksSteps.length - 1 && (
                      <div className="hidden md:block absolute top-20 -right-6 w-12 h-0.5 bg-gradient-to-r from-blue-200 to-purple-200"></div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

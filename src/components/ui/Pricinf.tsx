
import { Check } from 'lucide-react';
import { Button } from './button';
import { pricingPlans } from '../mock';
import { useNavigate } from 'react-router-dom';

export const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="section-padding bg-white"> 
      <div className="container mx-auto px-6"> 
        <div className="text-center mb-16"> 
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle"> 
            Start free, upgrade when you need more power
          </p>
        </div>

        <div className="max-w-5xl mx-auto"> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> 
            {pricingPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`pricing-card ${plan.highlighted ? 'pricing-card-highlighted' : ''}`}
              >
                {plan.highlighted && (
                  <div className="pricing-badge">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-6"> 
                  <h3 className="text-2xl font-bold text-gray-900 mb-2"> 
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4"> 
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-2"> 
                    <span className="text-5xl font-bold text-gray-900"> 
                      {plan.price}
                    </span>
                    <span className="text-gray-600"> 
                      / {plan.period}
                    </span>
                  </div>
                </div>

                <Button 
                  className={`w-full mb-8 ${plan.highlighted ? 'btn-primary' : 'btn-secondary'}`}
                  size="lg"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  onClick={() => navigate('/signup')}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-4"> 
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3"> 
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" /> 
                      <span className="text-gray-700">{feature}</span> 
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

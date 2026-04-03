
import { FileAudio, Sparkles, ListChecks, Zap, LayoutDashboard } from 'lucide-react';
import { features } from '../mock';

const iconMap = {
  1: FileAudio,
  2: Sparkles,
  3: ListChecks,
  4: Zap,
  5: LayoutDashboard
};

export const Features = () => {
  return (
    <section id="features" className="section-padding bg-white"> 
      <div className="container mx-auto px-6"> 
        <div className="text-center mb-16"> 
          <h2 className="section-title">Powerful Features</h2> 
          <p className="section-subtitle"> 
            Everything you need to transform meetings into actionable insights
          </p>
        </div>

        <div className="max-w-6xl mx-auto"> 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> 
            {features.map((feature) => {
              const Icon = iconMap[feature.id];
              return (
                <div key={feature.id} className="feature-card group"> 
                  <div className="feature-icon-wrapper"> 
                    <Icon className="w-6 h-6 text-blue-600 group-hover:text-purple-600 transition-colors" /> 
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3"> 
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed"> 
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
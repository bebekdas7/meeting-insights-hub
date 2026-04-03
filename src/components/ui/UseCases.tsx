
import React from 'react';
import { Briefcase, Rocket, GraduationCap, Users } from 'lucide-react';
import { useCases } from '../mock';

const iconMap = {
  1: Briefcase,
  2: Rocket,
  3: GraduationCap,
  4: Users
};

export const UseCases = () => {
  return (
    <section className="section-padding bg-gray-50"> 
      <div className="container mx-auto px-6"> 
        <div className="text-center mb-16"> 
          <h2 className="section-title">Built For Everyone</h2>
          <p className="section-subtitle"> 
            Whether you're a freelancer, founder, student, or recruiter
          </p>
        </div>

        <div className="max-w-6xl mx-auto"> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> 
            {useCases.map((useCase) => {
              const Icon = iconMap[useCase.id];
              return (
                <div key={useCase.id} className="use-case-card group"> 
                  <div className="flex items-start gap-4"> 
                    <div className="use-case-icon"> 
                      <Icon className="w-6 h-6 text-blue-600 group-hover:text-purple-600 transition-colors" /> 
                    </div>
                    
                    <div className="flex-1"> 
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2"> 
                        {useCase.title}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium mb-3"> 
                        {useCase.audience}
                      </p>
                      <p className="text-gray-600 leading-relaxed"> 
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

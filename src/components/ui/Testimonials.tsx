
import React from 'react';
import { Quote } from 'lucide-react';
import { testimonials } from '../mock';

export const Testimonials = () => {
  return (
    <section className="section-padding bg-gray-50"> 
      <div className="container mx-auto px-6"> 
        <div className="text-center mb-16"> 
          <h2 className="section-title">Loved By Professionals</h2>
          <p className="section-subtitle"> 
            See what our users have to say about AI Meeting Intelligence
          </p>
        </div>

        <div className="max-w-6xl mx-auto"> 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> 
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card"> 
                <Quote className="w-10 h-10 text-blue-200 mb-4" /> 
                
                <p className="text-gray-700 leading-relaxed mb-6"> 
                  "{testimonial.content}" 
                </p>

                <div className="flex items-center gap-3"> 
                  <div className="avatar"> 
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900"> 
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600"> 
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


import React from 'react';
import { Button } from './button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="section-padding bg-gradient-to-br from-gray-900 to-gray-800"> 
      <div className="container mx-auto px-6"> 
        <div className="max-w-3xl mx-auto text-center"> 
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6"> 
            Stop Wasting Time on Meetings. Let AI Do the Work.
          </h2>
          <p className="text-xl text-gray-300 mb-10"> 
            Join thousands of professionals who have reclaimed their time and boosted productivity with AI Meeting Intelligence.
          </p>
          <Button 
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8"
            onClick={() => navigate('/signup')}
          >
            Start Free Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

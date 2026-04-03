import { Button } from './button';
import { ArrowRight, Upload, Sparkles } from 'lucide-react';
import { heroData } from '../mock';
import { useNavigate } from 'react-router-dom';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section"> 
      <div className="container mx-auto px-6 py-20 lg:py-32"> 
        <div className="max-w-4xl mx-auto text-center"> 
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8 animate-fade-in"> 
            <Sparkles className="w-4 h-4 text-blue-600" /> 
            <span className="text-sm font-medium text-blue-900">AI-Powered Meeting Intelligence</span> 
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up"> 
            {heroData.headline}
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up-delay"> 
            {heroData.subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 animate-slide-up-delay-2"> 
            <Button 
              size="lg" 
              className="btn-primary w-full sm:w-auto"
              onClick={() => navigate('/signup')}
            >
              {heroData.ctaPrimary}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="btn-secondary w-full sm:w-auto"
              onClick={() => navigate('/dashboard')}
            >
              <Upload className="mr-2 w-5 h-5" />
              {heroData.ctaSecondary}
            </Button>
          </div>

          {/* Trust Text */}
          <p className="text-sm text-gray-500 animate-fade-in-delay"> 
            {heroData.trustText}
          </p>
        </div>

        {/* Hero Visual Element */}
        <div className="mt-16 max-w-5xl mx-auto animate-slide-up-delay-3"> 
          <div className="dashboard-preview"> 
            <div className="preview-header"> 
              <div className="flex items-center gap-2"> 
                <div className="w-3 h-3 rounded-full bg-red-400"></div> 
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div> 
                <div className="w-3 h-3 rounded-full bg-green-400"></div> 
              </div>
              <div className="text-sm text-gray-500 font-medium">AI Meeting Dashboard</div> 
              <div></div>
            </div>
            <div className="preview-content"> 
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6"> 
                <div className="stat-card"> 
                  <div className="text-3xl font-bold text-gray-900">127</div> 
                  <div className="text-sm text-gray-600">Meetings Processed</div> 
                </div> 
                <div className="stat-card"> 
                  <div className="text-3xl font-bold text-blue-600">98.5%</div> 
                  <div className="text-sm text-gray-600">Accuracy Rate</div> 
                </div> 
                <div className="stat-card"> 
                  <div className="text-3xl font-bold text-purple-600">45h</div> 
                  <div className="text-sm text-gray-600">Time Saved</div> 
                </div> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

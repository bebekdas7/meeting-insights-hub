
import React from 'react';
import { Brain } from 'lucide-react';
import { footerLinks } from '../mock';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200"> 
      <div className="container mx-auto px-6 py-12"> 
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8"> 
          {/* Brand */}
          <div className="col-span-2 md:col-span-1"> 
            <div className="flex items-center gap-2 mb-4"> 
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"> 
                <Brain className="w-6 h-6 text-white" /> 
              </div>
              <span className="font-bold text-xl text-gray-900">AI Meeting</span> 
            </div>
            <p className="text-sm text-gray-600"> 
              Transform meetings into actionable insights with AI.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2"> 
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-600 hover:text-blue-600 text-sm transition-colors"> 
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2"> 
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-600 hover:text-blue-600 text-sm transition-colors"> 
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2"> 
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-600 hover:text-blue-600 text-sm transition-colors"> 
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Account</h3>
            <ul className="space-y-2"> 
              {footerLinks.auth.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-600 hover:text-blue-600 text-sm transition-colors"> 
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200"> 
          <div className="flex flex-col md:flex-row justify-between items-center gap-4"> 
            <p className="text-sm text-gray-600"> 
              © 2025 AI Meeting Intelligence. All rights reserved.
            </p>
            <div className="flex items-center gap-6"> 
              <a href="/privacy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors"> 
                Privacy Policy
              </a>
              <a href="/terms" className="text-sm text-gray-600 hover:text-blue-600 transition-colors"> 
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

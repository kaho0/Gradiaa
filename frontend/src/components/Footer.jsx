import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowRight } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1 - Brand */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-wider">Gradia</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering education through innovative school management solutions. Transform your institution with our comprehensive platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors duration-300">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-300">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-300">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-300">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 tracking-wider">Quick Links</h3>
            <ul className="space-y-4">
              {["Home", "Pricing", "Use Cases", "Location", "FAQ", "Company"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <FaArrowRight className="mr-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 tracking-wider">Support</h3>
            <ul className="space-y-4">
              {["Help Center", "Documentation", "Community", "Contact Us", "API Reference"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <FaArrowRight className="mr-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 tracking-wider">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and educational insights.
            </p>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center bg-blue-800/50 rounded-lg p-1">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white flex-1 text-sm px-4 py-2 outline-none placeholder-gray-400 mr-2"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-400">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              ©2024 Gradia School Management. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Cookie Settings</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Search, Database, FileText } from 'lucide-react';

// Define prop types for FeatureCard
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Define prop types for PlatformLogo
interface PlatformLogoProps {
  src: string;
  alt: string;
}

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Social Media Investigation Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Comprehensive digital investigation tool for law enforcement agencies
            </p>
            <div className="space-x-4">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Access Portal
              </Link>
              <Link
                to="/register"
                className="bg-slate-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-slate-600 transition-colors"
              >
                Register Department
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Investigation Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="h-8 w-8 text-blue-500" />}
              title="Deep Profile Analysis"
              description="Extract complete user data including posts, stories, and archived content"
            />
            <FeatureCard
              icon={<Database className="h-8 w-8 text-blue-500" />}
              title="Network Mapping"
              description="Comprehensive follower and following lists with connection analysis"
            />
            <FeatureCard
              icon={<FileText className="h-8 w-8 text-blue-500" />}
              title="Evidence Collection"
              description="Automated screenshot capture and report generation for legal proceedings"
            />
          </div>
        </div>
      </div>

      {/* Platform Support Section */}
      <div className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Supported Platforms</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <PlatformLogo
              src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
              alt="Facebook"
            />
            <PlatformLogo
              src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg"
              alt="Instagram"
            />
            <PlatformLogo
              src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg"
              alt="Twitter"
            />
            <PlatformLogo
              src="https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg"
              alt="LinkedIn"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">SocialScan</h3>
              <p className="text-sm">Advanced social media investigation platform for law enforcement agencies.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/register" className="hover:text-white">Register</Link></li>
                <li><Link to="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="/compliance" className="hover:text-white">Compliance</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li>Support: support@socialscan.gov</li>
                <li>Emergency: +1 (888) 555-0123</li>
                <li>Available 24/7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} SocialScan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// FeatureCard Component
const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="p-6 border border-slate-700 rounded-lg hover:border-blue-500 transition-colors bg-slate-800">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

// PlatformLogo Component
const PlatformLogo = ({ src, alt }: PlatformLogoProps) => (
  <div className="bg-white p-4 rounded-lg w-24 h-24 flex items-center justify-center">
    <img src={src} alt={alt} className="w-16 h-16 object-contain" />
  </div>
);

export default LandingPage;

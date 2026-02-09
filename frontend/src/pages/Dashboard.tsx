import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Camera,
  MessageCircle,
  Compass,
  ArrowRight,
  Award,
  Users,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'Credential Translator',
      description: 'Upload your degrees and certificates for instant analysis and equivalency mapping',
      icon: FileText,
      link: '/',
      color: 'blue',
      stats: '90%+ accuracy'
    },
    {
      title: 'Camera Translation',
      description: 'Point your camera at any text for real-time translation and explanation',
      icon: Camera,
      link: '/camera',
      color: 'purple',
      stats: '50+ languages'
    },
    {
      title: 'AI Advocate',
      description: 'Chat with your personal AI advocate for emotional support and guidance',
      icon: MessageCircle,
      link: '/advocate',
      color: 'green',
      stats: '24/7 available'
    },
    {
      title: 'AI Navigator',
      description: 'Get help with bureaucracy, forms, and legal processes in your new country',
      icon: Compass,
      link: '/navigator',
      color: 'orange',
      stats: '20+ countries'
    },
  ];

  const stats = [
    { label: 'Credentials Analyzed', value: '12,500+', icon: Award },
    { label: 'Users Helped', value: '5,000+', icon: Users },
    { label: 'Success Rate', value: '87%', icon: TrendingUp },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.full_name || 'Friend'}! 👋
        </h1>
        <p className="text-xl text-gray-600">
          Your journey to integration starts here
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Features Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Explore Our Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorClasses = {
              blue: 'bg-blue-50 border-blue-200 hover:border-blue-400 text-blue-600',
              purple: 'bg-purple-50 border-purple-200 hover:border-purple-400 text-purple-600',
              green: 'bg-green-50 border-green-200 hover:border-green-400 text-green-600',
              orange: 'bg-orange-50 border-orange-200 hover:border-orange-400 text-orange-600',
            }[feature.color];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link to={feature.link}>
                  <div
                    className={`${colorClasses} rounded-xl p-6 border-2 transition-all duration-200 hover:shadow-lg group`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <Icon className={`w-12 h-12 ${feature.color === 'blue' ? 'text-blue-600' : feature.color === 'purple' ? 'text-purple-600' : feature.color === 'green' ? 'text-green-600' : 'text-orange-600'}`} />
                      <span className="text-sm font-semibold px-3 py-1 bg-white rounded-full">
                        {feature.stats}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>

                    <p className="text-gray-600 mb-4">
                      {feature.description}
                    </p>

                    <div className="flex items-center text-sm font-semibold group-hover:translate-x-2 transition-transform">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white"
      >
        <h2 className="text-2xl font-bold mb-4">💡 Quick Tips for Success</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">1. Start with Credentials</h3>
            <p className="text-blue-100">
              Upload your educational documents first to understand your equivalency
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2. Use Camera Translation</h3>
            <p className="text-blue-100">
              Navigate your new city by translating signs, menus, and documents instantly
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">3. Ask Your Navigator</h3>
            <p className="text-blue-100">
              Don't struggle with bureaucracy alone - let AI guide you through complex processes
            </p>
          </div>
        </div>
      </motion.div>

      {/* Impact Statement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center py-12 bg-gray-50 rounded-xl"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          You're Not Alone
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join 5,000+ refugees and displaced people who are rebuilding their lives
          with RefugeeConnect AI. Your skills and experience matter.
        </p>
      </motion.div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  StarIcon,
  CheckCircleIcon,
  HeartIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const team = [
    {
      name: "MD Hasib Ullah Khan Alvie",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Visionary leader with 10+ years of experience in real estate and technology.",
      email: "hasibullah.khan.alvie@g.bracu.ac.bd"
    },
    {
      name: "Sarah Rahman",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=300&h=300&fit=crop&crop=face",
      bio: "Expert in property management and customer relations with extensive market knowledge."
    },
    {
      name: "Ahmed Karim",
      role: "Technology Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Leading our tech innovations to provide the best user experience in property search."
    },
    {
      name: "Fatima Ahmed",
      role: "Customer Success Manager",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Dedicated to ensuring every customer finds their perfect home with exceptional service."
    }
  ];

  const values = [
    {
      icon: ShieldCheckIcon,
      title: "Trust & Transparency",
      description: "Every property is verified, every process is transparent, and every interaction builds lasting trust.",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: HeartIcon,
      title: "Customer First",
      description: "We put our customers at the center of everything we do, ensuring exceptional service and support.",
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      icon: StarIcon,
      title: "Excellence in Service",
      description: "We strive for excellence in every aspect of our service, from property listings to customer support.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      icon: UserGroupIcon,
      title: "Community Building",
      description: "We're building a strong community of property owners and tenants across Bangladesh.",
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ];

  const stats = [
    { number: "25,000+", label: "Properties Listed", icon: HomeIcon },
    { number: "50,000+", label: "Happy Customers", icon: UserGroupIcon },
    { number: "64", label: "Districts Covered", icon: MapPinIcon },
    { number: "24/7", label: "Customer Support", icon: ClockIcon },
    { number: "4.9/5", label: "Customer Rating", icon: StarIcon },
    { number: "99.8%", label: "Uptime Guarantee", icon: ShieldCheckIcon }
  ];

  const achievements = [
    "🏆 Best Real Estate Platform 2024",
    "🌟 Customer Choice Award 2024", 
    "🎯 Fastest Growing Platform in Bangladesh",
    "🔒 Most Trusted Property Portal",
    "📱 Best Mobile Experience Award",
    "🏅 Excellence in Customer Service"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              About 
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Basha Lagbe
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Your trusted partner in finding the perfect rental home across Bangladesh
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Who We Are
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Welcome to <strong>Basha Lagbe</strong>, your one-stop solution to finding the perfect house for rent! 
                  In a fast-paced world where time and convenience matter, Basha Lagbe strives to make the 
                  house-hunting process as easy and stress-free as possible.
                </p>
                <p>
                  Whether you are a student, a working professional, or a family looking for a new place, 
                  our platform connects you to a wide range of rental properties that match your needs. 
                  With an intuitive interface and a vast database of listings, Basha Lagbe helps you 
                  discover your ideal home without the hassle.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop"
                alt="Modern apartment interior"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <HomeIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">25,000+</div>
                    <div className="text-gray-600">Properties</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop"
                alt="Team meeting"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <StarIcon className="w-8 h-8 text-green-600 fill-current" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                    <div className="text-gray-600">Rating</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  At Basha Lagbe, our goal is to <strong>revolutionize the way people find rental homes</strong>. 
                  We aim to be the most trusted and user-friendly platform where renters can easily access 
                  real-time, accurate listings with detailed information about properties.
                </p>
                <p>
                  We envision a world where renters no longer need to face uncertainty, stress, or 
                  overwhelming choices. Our mission is to create a seamless, transparent, and efficient 
                  rental experience for everyone in Bangladesh.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These numbers reflect our commitment to serving the Bangladesh rental market
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-10 h-10 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Basha Lagbe
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
              >
                <div className={`${value.bgColor} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <value.icon className={`w-10 h-10 ${value.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Commitment
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Our team of agents has a wealth of experience and knowledge in the real estate industry, 
                  and we are committed to providing the <strong>highest level of service</strong> to our clients.
                </p>
                <p>
                  We believe that buying or selling a property should be an exciting and rewarding experience, 
                  and we are dedicated to making that a reality for each and every one of our clients.
                </p>
              </div>

              {/* Achievements */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg"
                    >
                      <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{achievement}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=500&fit=crop"
                alt="Team collaboration"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The dedicated professionals behind Basha Lagbe's success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
              >
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Contact
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Join thousands of satisfied customers who trust Basha Lagbe for their rental needs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <button
                onClick={() => window.location.href = '/search'}
                className="bg-white text-blue-900 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <HomeIcon className="w-5 h-5" />
                Find Properties
              </button>
              <button
                onClick={() => window.location.href = '/add-property'}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold py-4 px-8 rounded-xl transition duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <BuildingOfficeIcon className="w-5 h-5" />
                List Property
              </button>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-blue-200">
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-5 h-5" />
                <span>+880 1234-567890</span>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="w-5 h-5" />
                <span>hasibullah.khan.alvie@g.bracu.ac.bd</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;

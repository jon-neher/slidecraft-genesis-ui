
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Image, FileText } from 'lucide-react';

const features = [
  {
    icon: Star,
    title: "Data-Driven Narratives",
    description: "Thread together your raw data into compelling visual stories with AI-powered design intelligence.",
    gradient: "from-blue-500 to-cyan-500",
    status: "Coming Soon"
  },
  {
    icon: Image,
    title: "Brand-Safe Templates",
    description: "Pre-approved templates that automatically maintain your brand guidelines and visual identity.",
    gradient: "from-purple-500 to-pink-500",
    status: "Coming Soon"
  },
  {
    icon: FileText,
    title: "1-Click Export",
    description: "Export to PowerPoint, Google Slides, or PDF with perfect formatting and high-resolution assets.",
    gradient: "from-orange-500 to-red-500",
    status: "Coming Soon"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 sm:mb-6">
            <span className="text-gradient">Revolutionary Features</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Everything you'll need to create professional presentations in seconds, not hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="card-gradient rounded-2xl p-6 sm:p-8 hover:scale-105 transition-transform duration-300 will-change-transform relative"
              >
                {/* Coming Soon Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gold-400 text-navy-950 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">
                  {feature.status}
                </div>

                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${feature.gradient} p-2 sm:p-3 mb-4 sm:mb-6 mx-auto`}
                >
                  <IconComponent className="w-full h-full text-white" />
                </motion.div>
                
                <h3 className="text-xl sm:text-2xl font-display font-semibold mb-3 sm:mb-4 text-center">
                  {feature.title}
                </h3>
                
                <p className="text-slate-300 text-center leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>

                {/* Animated accent line */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 mt-4 sm:mt-6 rounded-full"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;


import React from 'react';
import { motion } from 'framer-motion';
import { Star, Image, FileText } from 'lucide-react';

const features = [
  {
    icon: Star,
    title: "Data-Driven Designs",
    description: "Transform your raw data into stunning visual narratives with AI-powered design intelligence.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Image,
    title: "Brand-Safe Templates",
    description: "Pre-approved templates that automatically maintain your brand guidelines and visual identity.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: FileText,
    title: "1-Click Export",
    description: "Export to PowerPoint, Google Slides, or PDF with perfect formatting and high-resolution assets.",
    gradient: "from-orange-500 to-red-500"
  }
];

const FeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            <span className="text-gradient">Powerful Features</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Everything you need to create professional presentations in seconds, not hours.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="card-gradient rounded-2xl p-8 hover:scale-105 transition-transform duration-300 will-change-transform"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-6 mx-auto`}
                >
                  <IconComponent className="w-full h-full text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-display font-semibold mb-4 text-center">
                  {feature.title}
                </h3>
                
                <p className="text-slate-300 text-center leading-relaxed">
                  {feature.description}
                </p>

                {/* Animated accent line */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 mt-6 rounded-full"
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;

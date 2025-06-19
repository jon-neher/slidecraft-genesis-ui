
import React from 'react';
import { motion } from 'framer-motion';
import { Database, Wand2, Download, Zap } from 'lucide-react';

const features = [
  {
    icon: Database,
    title: "Data-Driven Narratives",
    description: "Transform raw data into compelling visual stories with AI-powered design intelligence that understands your content.",
    color: "from-electric-indigo to-neon-mint"
  },
  {
    icon: Wand2,
    title: "Smart Templates",
    description: "Pre-approved templates that automatically maintain your brand guidelines while adapting to your specific content needs.",
    color: "from-neon-mint to-electric-indigo"
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description: "One-click export to PowerPoint, Google Slides, or PDF with perfect formatting and high-resolution assets.",
    color: "from-electric-indigo to-soft-coral"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate professional presentations in seconds, not hours. Focus on your message while we handle the design.",
    color: "from-soft-coral to-neon-mint"
  }
];

const ModernFeatures = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60
    },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  return (
    <section className="section-padding bg-ice-white">
      <div className="container mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="display-lg text-slate-gray mb-6">
            Everything you need to create
            <br />
            <span className="text-gradient">professional presentations</span>
          </h2>
          <p className="text-xl text-slate-gray/70 max-w-2xl mx-auto">
            Powerful features designed to transform how you create and share your ideas
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="card-modern rounded-2xl p-8 group hover:subtle-shadow transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-full h-full text-white" />
                </div>
                
                <h3 className="text-2xl font-semibold text-slate-gray mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-slate-gray/70 leading-relaxed">
                  {feature.description}
                </p>

                {/* Subtle accent line */}
                <div className="w-12 h-1 bg-gradient-to-r from-electric-indigo to-neon-mint rounded-full mt-6 group-hover:w-16 transition-all duration-300" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ModernFeatures;

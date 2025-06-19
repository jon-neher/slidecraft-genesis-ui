
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    rotateY: -15,
    scale: 0.8
  },
  visible: { 
    opacity: 1, 
    y: 0,
    rotateY: 0,
    scale: 1
  }
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { 
    scale: 1, 
    rotate: 0
  },
  hover: { 
    scale: 1.2, 
    rotate: 10
  }
};

const FeaturesSection = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 sm:mb-6"
            initial={{ opacity: 0, rotateX: -20 }}
            whileInView={{ opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="text-gradient">Revolutionary Features</span>
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            Everything you'll need to create professional presentations in seconds, not hours.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto"
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
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  duration: 0.8
                }}
                className="card-gradient rounded-2xl p-6 sm:p-8 relative group cursor-pointer"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 10,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Coming Soon Badge */}
                <motion.div 
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gold-400 text-navy-950 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  {feature.status}
                </motion.div>

                <motion.div
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${feature.gradient} p-2 sm:p-3 mb-4 sm:mb-6 mx-auto`}
                  variants={iconVariants}
                  whileHover="hover"
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.3
                  }}
                >
                  <IconComponent className="w-full h-full text-white" />
                </motion.div>
                
                <motion.h3 
                  className="text-xl sm:text-2xl font-display font-semibold mb-3 sm:mb-4 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {feature.title}
                </motion.h3>
                
                <motion.p 
                  className="text-slate-300 text-center leading-relaxed text-sm sm:text-base"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  {feature.description}
                </motion.p>

                {/* Animated accent line */}
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  whileInView={{ width: "100%", opacity: 1 }}
                  transition={{ 
                    delay: 1 + index * 0.1, 
                    duration: 0.8,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true }}
                  className="h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 mt-4 sm:mt-6 rounded-full"
                />

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-gold-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
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

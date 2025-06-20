
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { containerVariants, cardVariants } from '../lib/variants';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "VP of Marketing",
    company: "TechFlow",
    avatar: "SC",
    content: "Threadline transformed how our team creates presentations. What used to take hours now takes minutes, and the results look professionally designed.",
    rating: 5
  },
  {
    name: "Marcus Rodriguez", 
    role: "Data Analyst",
    company: "DataCorp",
    avatar: "MR",
    content: "The AI understands our data better than we expected. It automatically suggests the best chart types and layouts for our quarterly reports.",
    rating: 5
  },
  {
    name: "Emily Watson",
    role: "Product Manager",
    company: "InnovateLab",
    avatar: "EW",
    content: "Our investor presentations went from good to exceptional. The brand consistency and visual hierarchy are exactly what we needed.",
    rating: 5
  }
];

const ModernTestimonials = () => {

  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="display-lg text-slate-gray mb-6">
            Loved by teams at
            <br />
            <span className="text-gradient">forward-thinking companies</span>
          </h2>
          <p className="text-xl text-slate-gray/70 max-w-2xl mx-auto">
            See what professionals are saying about Threadline
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="card-modern rounded-2xl p-8 relative group hover:subtle-shadow transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-electric-indigo/20 mb-4" />
              
              {/* Rating stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-neon-mint text-neon-mint" />
                ))}
              </div>

              {/* Testimonial content */}
              <p className="text-slate-gray/80 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-indigo to-neon-mint flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-gray">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-gray/60">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-electric-indigo/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ModernTestimonials;

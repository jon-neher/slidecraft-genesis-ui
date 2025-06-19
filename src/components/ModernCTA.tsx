
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const ModernCTA = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    console.log('Email submitted:', email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <section className="section-padding bg-ice-white">
        <div className="container mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="card-modern rounded-3xl p-12">
              <CheckCircle className="w-16 h-16 text-neon-mint mx-auto mb-6" />
              <h2 className="text-3xl font-semibold text-slate-gray mb-4">
                You're on the list! 🎉
              </h2>
              <p className="text-xl text-slate-gray/70">
                We'll notify you as soon as Threadline is ready for early access.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-ice-white">
      <div className="container mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="card-modern rounded-3xl p-12 text-center relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-electric-indigo/5 to-neon-mint/5" />
            
            <div className="relative z-10">
              <h2 className="display-lg text-slate-gray mb-6">
                Ready to transform your
                <br />
                <span className="text-gradient">presentation workflow?</span>
              </h2>
              
              <p className="text-xl text-slate-gray/70 mb-12 max-w-2xl mx-auto">
                Join thousands of professionals who are already on the waitlist for early access to Threadline.
              </p>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 px-6 text-lg border-gray-200 focus:border-electric-indigo focus:ring-electric-indigo"
                      required
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="btn-primary h-14 px-8 group"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Get Early Access
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </form>

              <p className="text-sm text-slate-gray/60 mt-6">
                No spam, unsubscribe at any time. We respect your privacy.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModernCTA;

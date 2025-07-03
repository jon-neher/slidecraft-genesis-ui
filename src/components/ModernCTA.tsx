
import React from 'react';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, SignUpButton } from '@clerk/clerk-react';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

const ModernCTA = () => {
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
              <SignedOut>
                <h2 className="display-lg text-slate-gray mb-6">
                  Ready to create unlimited
                  <br />
                  <span className="text-gradient">presentations?</span>
                </h2>
                
                <div className="max-w-md mx-auto">
                  <SignUpButton mode="modal">
                    <Button className="btn-primary h-14 px-8 group">
                      Join the Waitlist
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </SignUpButton>
                </div>

                <p className="text-sm text-slate-gray/60 mt-6">
                  Secure authentication powered by Clerk. No spam, unsubscribe at any time.
                </p>
              </SignedOut>

              <SignedIn>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <CheckCircle className="w-16 h-16 text-neon-mint mx-auto mb-6" />
                  <h2 className="text-3xl font-semibold text-slate-gray mb-4">
                    You're already on the list! 🎉
                  </h2>
                  <p className="text-xl text-slate-gray/70">
                    We'll notify you as soon as Threadline is ready for early access.
                  </p>
                </motion.div>
              </SignedIn>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModernCTA;

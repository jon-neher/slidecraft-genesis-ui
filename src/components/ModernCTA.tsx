
import React from 'react';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, SignUpButton } from '@clerk/clerk-react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

const ModernCTA = () => {
  return (
    <section className="section-padding bg-background">
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
                <h2 className="display-lg text-foreground mb-6">
                  Ready to transform your
                  <br />
                  <span className="text-gradient">presentation workflow?</span>
                </h2>
                
                <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                  Join thousands of professionals who are already on the waitlist for early access to Threadline.
                </p>

                <div className="max-w-md mx-auto">
                  <SignUpButton mode="modal">
                    <Button className="btn-primary h-14 px-8 group">
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Get Early Access
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </SignUpButton>
                </div>

                <p className="text-sm text-muted-foreground mt-6">
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
                  <h2 className="text-3xl font-semibold text-foreground mb-4">
                    You're already on the list! 🎉
                  </h2>
                  <p className="text-xl text-muted-foreground">
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


import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, ExternalLink } from 'lucide-react';
import { SignedIn, SignedOut, SignUpButton } from '@clerk/clerk-react';

const PresentationCallToAction = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="text-center mt-6 lg:mt-8 p-4 sm:p-6 bg-gradient-to-r from-electric-indigo/5 to-neon-mint/5 rounded-xl border border-slate-gray/10"
    >
      <h4 className="text-base sm:text-lg font-semibold text-slate-gray mb-2">
        Ready to create unlimited presentations?
      </h4>
      <p className="text-sm sm:text-base text-slate-gray/70 mb-4">
        Join thousands of professionals already using Threadline
      </p>
      <SignedOut>
        <SignUpButton mode="modal">
          <Button className="bg-electric-indigo hover:bg-electric-indigo/90 text-ice-white touch-target">
            Join the Waitlist
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center justify-center gap-2 text-slate-gray">
          <CheckCircle className="w-5 h-5 text-neon-mint" />
          You're on the list!
        </div>
      </SignedIn>
    </motion.div>
  );
};

export default PresentationCallToAction;

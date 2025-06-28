
import React from 'react';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

const formVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      duration: 0.6
    }
  }
};
const successVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    rotateY: -20
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0
  }
};

const ClerkWaitlistForm = () => {
  return <motion.div variants={formVariants} initial="hidden" animate="visible" className="max-w-md mx-auto px-4">
      <SignedOut>
        <div className="flex flex-col gap-3 sm:gap-4">
          <motion.div whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.95
        }}>
            <SignUpButton mode="modal">
              <Button className="electric-gradient text-navy-950 font-semibold px-6 sm:px-8 py-3 h-11 sm:h-12 text-sm sm:text-base w-full relative overflow-hidden group">
                <motion.span className="relative z-10 flex items-center justify-center gap-2" initial={{
                y: 0
              }} whileHover={{
                y: -2
              }} transition={{
                type: "spring",
                stiffness: 300
              }}>
                  Join Waitlist
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.span>
                
                {/* Animated background effect */}
                <motion.div className="absolute inset-0 bg-gradient-to-r from-electric-indigo to-neon-mint opacity-0 group-hover:opacity-100" initial={{
                x: "-100%"
              }} whileHover={{
                x: "0%"
              }} transition={{
                duration: 0.3
              }} />
              </Button>
            </SignUpButton>
          </motion.div>
          
          <motion.div whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.95
        }}>
            <SignInButton mode="modal">
              <Button variant="outline" className="bg-slate-200/20 border-slate-400/30 text-slate-600 hover:bg-slate-200/30 hover:text-slate-700 backdrop-blur-sm h-11 sm:h-12 text-sm sm:text-base w-full">
                Already have an account? Sign In
              </Button>
            </SignInButton>
          </motion.div>
        </div>
      </SignedOut>

      <SignedIn>
        <motion.div variants={successVariants} initial="hidden" animate="visible" transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.8
      }} className="text-center">
          <motion.div className="text-lg sm:text-xl md:text-2xl text-neon-mint mb-2 flex items-center justify-center gap-2" animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }} transition={{
          duration: 0.6,
          repeat: 1
        }}>
            <CheckCircle className="w-6 h-6" />
            You're on the list!
          </motion.div>
          <motion.p className="text-slate-300 text-sm sm:text-base md:text-lg mb-4" initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3,
          duration: 0.5
        }}>
            We'll notify you when Threadline launches
          </motion.p>
          <div className="flex justify-center">
            <UserButton appearance={{
            elements: {
              avatarBox: "w-10 h-10 rounded-full border-2 border-neon-mint"
            }
          }} />
          </div>
          <div className="mt-3 flex justify-center">
            <SignOutButton>
              <Button variant="outline">Log Out</Button>
            </SignOutButton>
          </div>
        </motion.div>
      </SignedIn>
    </motion.div>;
};

export default ClerkWaitlistForm;

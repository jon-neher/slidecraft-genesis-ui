
import React from 'react';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

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
  const { user } = useUser();

  // Log user data for debugging
  React.useEffect(() => {
    if (user) {
      console.log('Clerk user data:', {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt
      });
    }
  }, [user]);

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="max-w-md mx-auto px-4"
    >
      <SignedOut>
        <div className="flex flex-col gap-3 sm:gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            <SignUpButton mode="modal">
              <Button className="gold-gradient text-navy-950 font-semibold px-6 sm:px-8 py-3 h-11 sm:h-12 text-sm sm:text-base w-full relative overflow-hidden group">
                <motion.span
                  className="relative z-10 flex items-center justify-center gap-2"
                  initial={{ y: 0 }}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Join Waitlist
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.span>
                
                {/* Animated background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-600 opacity-0 group-hover:opacity-100"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </SignUpButton>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            <SignInButton mode="modal">
              <Button 
                variant="outline" 
                className="bg-navy-800/50 border-slate-600 text-white hover:bg-navy-700/50 h-11 sm:h-12 text-sm sm:text-base w-full"
              >
                Already have an account? Sign In
              </Button>
            </SignInButton>
          </motion.div>
        </div>
      </SignedOut>

      <SignedIn>
        <motion.div
          variants={successVariants}
          initial="hidden"
          animate="visible"
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            duration: 0.8
          }}
          className="text-center bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200 shadow-lg"
        >
          <motion.div 
            className="text-2xl sm:text-3xl md:text-4xl text-green-600 mb-4 flex items-center justify-center gap-3"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 0.6,
              repeat: 1
            }}
          >
            <CheckCircle className="w-8 h-8" />
            <span className="font-bold">You're on the list!</span>
          </motion.div>
          
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="w-5 h-5 text-green-500" />
            <p className="text-green-700 text-lg font-medium">
              Welcome to Threadline Early Access
            </p>
            <Sparkles className="w-5 h-5 text-green-500" />
          </motion.div>
          
          <motion.p 
            className="text-green-600 text-base sm:text-lg mb-6 leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            We'll notify you as soon as Threadline launches.<br />
            <span className="text-sm text-green-500">
              {user?.primaryEmailAddress?.emailAddress && `Notifications will be sent to ${user.primaryEmailAddress.emailAddress}`}
            </span>
          </motion.p>
          
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-12 h-12 rounded-full border-3 border-green-400 shadow-lg"
                }
              }}
            />
          </motion.div>
          
          <motion.div
            className="text-xs text-green-500 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            User ID: {user?.id}
          </motion.div>
        </motion.div>
      </SignedIn>
    </motion.div>
  );
};

export default ClerkWaitlistForm;

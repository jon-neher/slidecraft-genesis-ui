
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Lightbulb, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockActivity, mockTips } from '@/data/mockData';
import { useIsMobile } from '@/hooks/use-mobile';

const ActivityPanel = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [currentTip, setCurrentTip] = useState(0);
  const isMobile = useIsMobile();

  // On mobile, always show expanded version in a card
  if (isMobile) {
    return (
      <Card className="border-gray-200 bg-white">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-electric-indigo" />
            <h2 className="font-semibold text-slate-gray">Activity & Tips</h2>
          </div>

          {/* Recent Activity - Condensed for mobile */}
          <div>
            <h3 className="text-sm font-medium text-slate-gray mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Activity
            </h3>
            <div className="space-y-2">
              {mockActivity.slice(0, 2).map((activity) => (
                <div key={activity.id} className="text-sm">
                  <p className="text-gray-700 text-xs">{activity.action}</p>
                  <p className="text-gray-400 text-xs">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips Carousel - Simplified for mobile */}
          <div>
            <h3 className="text-sm font-medium text-slate-gray mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Pro Tip
            </h3>
            <Card className="border-electric-indigo/20 bg-electric-indigo/5">
              <CardContent className="p-3">
                <h4 className="font-medium text-sm text-slate-gray mb-1">
                  {mockTips[currentTip].title}
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  {mockTips[currentTip].content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {mockTips.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full ${
                          index === currentTip ? 'bg-electric-indigo' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-5 h-5"
                      onClick={() => setCurrentTip((prev) => (prev - 1 + mockTips.length) % mockTips.length)}
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-5 h-5"
                      onClick={() => setCurrentTip((prev) => (prev + 1) % mockTips.length)}
                    >
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Desktop version with collapsible sidebar
  return (
    <motion.div
      className="relative"
      initial={{ width: 40 }}
      animate={{ width: isCollapsed ? 40 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Collapsed Tab */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-10 h-full bg-white border border-gray-200 rounded-l-xl flex flex-col items-center justify-start pt-6 gap-4"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(false)}
              className="w-8 h-8 text-gray-400 hover:text-electric-indigo"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="writing-mode-vertical text-xs text-gray-400 font-medium tracking-wider">
              ACTIVITY
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Panel */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="w-70 bg-white border border-gray-200 rounded-xl p-4 space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-gray">Activity & Tips</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(true)}
                className="w-8 h-8 text-gray-400 hover:text-electric-indigo"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-sm font-medium text-slate-gray mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {mockActivity.map((activity) => (
                  <div key={activity.id} className="text-sm">
                    <p className="text-gray-700">{activity.action}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tips Carousel */}
            <div>
              <h3 className="text-sm font-medium text-slate-gray mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Pro Tips
              </h3>
              <Card className="border-electric-indigo/20 bg-electric-indigo/5">
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm text-slate-gray mb-2">
                    {mockTips[currentTip].title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">
                    {mockTips[currentTip].content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {mockTips.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentTip ? 'bg-electric-indigo' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6"
                        onClick={() => setCurrentTip((prev) => (prev - 1 + mockTips.length) % mockTips.length)}
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6"
                        onClick={() => setCurrentTip((prev) => (prev + 1) % mockTips.length)}
                      >
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Nudges */}
            <div>
              <h3 className="text-sm font-medium text-slate-gray mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Performance Nudges
              </h3>
              <div className="space-y-2">
                <Card className="border-neon-mint/20 bg-neon-mint/5">
                  <CardContent className="p-3">
                    <p className="text-xs text-gray-700">
                      <strong>+15%</strong> engagement when using data visualizations
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-soft-coral/20 bg-soft-coral/5">
                  <CardContent className="p-3">
                    <p className="text-xs text-gray-700">
                      Consider updating your <strong>Sales Pitch</strong> template
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ActivityPanel;

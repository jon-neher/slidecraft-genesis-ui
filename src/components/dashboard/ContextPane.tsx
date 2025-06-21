
import React from 'react';
import { motion } from 'framer-motion';
import { Building, User, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mockEntity = {
  id: '1',
  name: 'Acme Corp',
  type: 'company',
  avatar: '/placeholder.svg',
  stats: [
    { label: 'Revenue', value: '$2.4M' },
    { label: 'Employees', value: '150' },
    { label: 'Industry', value: 'Technology' },
  ],
  recentDecks: [
    { id: '1', name: 'Q4 Review', date: '2 days ago' },
    { id: '2', name: 'Product Launch', date: '1 week ago' },
    { id: '3', name: 'Investor Pitch', date: '2 weeks ago' },
  ]
};

const ContextPane = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="card-modern border-gray-200 bg-white">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-electric-indigo to-neon-mint flex items-center justify-center">
              <Building className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-lg font-semibold text-slate-gray">{mockEntity.name}</h2>
                <Button variant="ghost" size="sm" className="text-electric-indigo hover:bg-electric-indigo/10 hover:text-electric-indigo transition-colors">
                  <Edit className="w-4 h-4 mr-1" />
                  Change
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                {mockEntity.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm text-gray-500">{stat.label}</div>
                    <div className="font-medium text-slate-gray">{stat.value}</div>
                  </div>
                ))}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-gray mb-2">Recent Decks</h3>
                <div className="flex gap-2 flex-wrap">
                  {mockEntity.recentDecks.map((deck) => (
                    <div
                      key={deck.id}
                      className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-electric-indigo/10 hover:text-electric-indigo cursor-pointer transition-colors"
                    >
                      {deck.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContextPane;

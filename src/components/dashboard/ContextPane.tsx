
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import EntitySelector from './shared/EntitySelector';
import { mockSelectedEntity } from '@/data/mockData';
import { slideInVariants } from '@/lib/variants';

const ContextPane = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={slideInVariants}
    >
      <Card className="card-modern border-gray-200 bg-white">
        <CardContent className="p-4 lg:p-6">
          <EntitySelector entity={mockSelectedEntity} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContextPane;

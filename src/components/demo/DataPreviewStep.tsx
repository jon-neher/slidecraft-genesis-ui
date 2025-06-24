
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, ArrowRight, FileText } from 'lucide-react';
import { DataScenario } from './types';
import { useIsMobile } from '@/hooks/use-mobile';

interface DataPreviewStepProps {
  scenario: DataScenario;
  onContinue: () => void;
}

const DataPreviewStep = ({ scenario, onContinue }: DataPreviewStepProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4 lg:mb-6"
      >
        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-gray mb-2">
          Review Your Data
        </h3>
        <p className="text-sm text-slate-gray/70">
          Here's the sample data we'll transform into your presentation
        </p>
      </motion.div>

      {/* Data Source Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4"
      >
        <Card className="border-slate-gray/10">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Database className="w-4 h-4 text-electric-indigo" />
              Data Source
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div>
                <div className="font-medium text-slate-gray">Source</div>
                <div className="text-slate-gray/70">{scenario.dataSource?.name || 'Sample Dataset'}</div>
              </div>
              <div>
                <div className="font-medium text-slate-gray">Records</div>
                <div className="text-slate-gray/70">{scenario.dataSource?.recordCount || scenario.sampleData.length} total</div>
              </div>
              <div>
                <div className="font-medium text-slate-gray">Last Updated</div>
                <div className="text-slate-gray/70">{scenario.dataSource?.lastUpdated || 'Today'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4 lg:mb-6"
      >
        <Card className="border-slate-gray/10">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <FileText className="w-4 h-4 text-electric-indigo" />
              Sample Data Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isMobile ? (
              // Mobile: Compact stacked cards
              <div className="space-y-2">
                {scenario.sampleData.slice(0, 2).map((item, index) => (
                  <div key={index} className="p-2 bg-slate-50 rounded-lg">
                    {Object.entries(item).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-0.5">
                        <span className="text-xs font-medium text-slate-gray capitalize truncate mr-2">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-xs text-slate-gray/70 truncate">
                          {typeof value === 'number' ? value.toLocaleString() : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="text-center text-xs text-slate-gray/60 pt-1">
                  Showing 2 of {scenario.sampleData.length} records
                </div>
              </div>
            ) : (
              // Desktop: Table view
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(scenario.sampleData[0] || {}).map((key) => (
                        <TableHead key={key} className="text-xs font-medium">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scenario.sampleData.slice(0, 4).map((item, index) => (
                      <TableRow key={index}>
                        {Object.values(item).map((value, cellIndex) => (
                          <TableCell key={cellIndex} className="text-xs">
                            {typeof value === 'number' ? value.toLocaleString() : String(value)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="text-center text-xs text-slate-gray/60 mt-2">
                  Showing 4 of {scenario.sampleData.length} records
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <Button 
          onClick={onContinue}
          className="bg-electric-indigo hover:bg-electric-indigo/90 text-ice-white px-6 py-2 sm:px-8 sm:py-3 touch-target"
          size={isMobile ? "default" : "lg"}
        >
          Process This Data
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <p className="text-xs text-slate-gray/60 mt-2">
          AI will analyze this data and create your presentation
        </p>
      </motion.div>
    </div>
  );
};

export default DataPreviewStep;

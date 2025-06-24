
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, Calendar, Users, ArrowRight, FileText } from 'lucide-react';
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
        className="text-center mb-6 lg:mb-8"
      >
        <h3 className="text-xl sm:text-2xl font-semibold text-slate-gray mb-2">
          Review Your Data
        </h3>
        <p className="text-sm sm:text-base text-slate-gray/70">
          Here's the sample data we'll transform into your presentation
        </p>
      </motion.div>

      {/* Data Source Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card className="border-slate-gray/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Database className="w-5 h-5 text-electric-indigo" />
              Data Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
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
        className="mb-6"
      >
        <Card className="border-slate-gray/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <FileText className="w-5 h-5 text-electric-indigo" />
              Sample Data Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isMobile ? (
              // Mobile: Stacked cards for each data point
              <div className="space-y-3">
                {scenario.sampleData.slice(0, 3).map((item, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-lg">
                    {Object.entries(item).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-1">
                        <span className="text-xs font-medium text-slate-gray capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-xs text-slate-gray/70">
                          {typeof value === 'number' ? value.toLocaleString() : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="text-center text-xs text-slate-gray/60 pt-2">
                  Showing 3 of {scenario.sampleData.length} records
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
                    {scenario.sampleData.slice(0, 5).map((item, index) => (
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
                <div className="text-center text-xs text-slate-gray/60 mt-3">
                  Showing 5 of {scenario.sampleData.length} records
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Insights Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6 lg:mb-8"
      >
        <Card className="border-slate-gray/10 bg-gradient-to-r from-electric-indigo/5 to-neon-mint/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Users className="w-5 h-5 text-electric-indigo" />
              What We'll Discover
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {scenario.insights.slice(0, 3).map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-electric-indigo mt-2 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-gray/80">{insight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <Button 
          onClick={onContinue}
          className="bg-electric-indigo hover:bg-electric-indigo/90 text-ice-white px-6 py-3 sm:px-8 touch-target"
          size="lg"
        >
          Process This Data
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <p className="text-xs text-slate-gray/60 mt-3">
          AI will analyze this data and create your presentation
        </p>
      </motion.div>
    </div>
  );
};

export default DataPreviewStep;

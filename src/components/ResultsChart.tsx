'use client';

import { motion } from 'framer-motion';
import type { QuestionWithResults } from '@/types';

interface ResultsChartProps {
  question: QuestionWithResults;
}

export default function ResultsChart({ question }: ResultsChartProps) {
  const majority = question.over_count > question.under_count ? 'OVER' :
                   question.under_count > question.over_count ? 'UNDER' : null;

  // Safely convert percentages to numbers (handle null/undefined/string)
  const overPct = Number(question.over_percentage) || 0;
  const underPct = Number(question.under_percentage) || 0;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {question.category && (
        <div className="text-xs uppercase tracking-wider text-verde-500 mb-2">
          {question.category}
        </div>
      )}

      <h3 className="text-lg font-semibold mb-6 text-white">
        {question.text}
      </h3>

      <div className="space-y-4">
        {/* Over Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-bold text-sm uppercase ${majority === 'OVER' ? 'text-verde-500' : 'text-gray-400'}`}>
              Over
            </span>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">
                {question.over_count} {question.over_count === 1 ? 'vote' : 'votes'}
              </span>
              <span className={`font-bold text-lg ${majority === 'OVER' ? 'text-verde-500' : 'text-white'}`}>
                {overPct.toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="h-10 bg-[#252525] rounded-lg overflow-hidden">
            {overPct > 0 && (
              <motion.div
                className="h-full rounded-lg"
                style={{
                  background: majority === 'OVER'
                    ? 'linear-gradient(to right, #00b140, #008f34)'
                    : '#4b5563'
                }}
                initial={{ width: 0 }}
                animate={{ width: `${overPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            )}
          </div>
        </div>

        {/* Under Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-bold text-sm uppercase ${majority === 'UNDER' ? 'text-verde-500' : 'text-gray-400'}`}>
              Under
            </span>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">
                {question.under_count} {question.under_count === 1 ? 'vote' : 'votes'}
              </span>
              <span className={`font-bold text-lg ${majority === 'UNDER' ? 'text-verde-500' : 'text-white'}`}>
                {underPct.toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="h-10 bg-[#252525] rounded-lg overflow-hidden">
            {underPct > 0 && (
              <motion.div
                className="h-full rounded-lg"
                style={{
                  background: majority === 'UNDER'
                    ? 'linear-gradient(to right, #00b140, #008f34)'
                    : '#4b5563'
                }}
                initial={{ width: 0 }}
                animate={{ width: `${underPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        {question.total_answers} total {question.total_answers === 1 ? 'response' : 'responses'}
      </div>
    </motion.div>
  );
}

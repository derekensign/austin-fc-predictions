'use client';

import { motion } from 'framer-motion';
import type { QuestionWithResults } from '@/types';

interface ResultsChartProps {
  question: QuestionWithResults;
}

export default function ResultsChart({ question }: ResultsChartProps) {
  const majority = question.over_count > question.under_count ? 'OVER' : 'UNDER';

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
            <span className={`font-bold ${majority === 'OVER' ? 'text-verde-500' : 'text-gray-400'}`}>
              {overPct.toFixed(1)}%
            </span>
          </div>
          <div className="h-8 bg-obsidian-lighter rounded-lg overflow-hidden relative">
            <motion.div
              className={`h-full rounded-lg ${majority === 'OVER' ? 'bg-verde-gradient' : 'bg-gray-700'}`}
              initial={{ width: 0 }}
              animate={{ width: `${overPct}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {question.over_count} {question.over_count === 1 ? 'vote' : 'votes'}
            </div>
          </div>
        </div>

        {/* Under Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-bold text-sm uppercase ${majority === 'UNDER' ? 'text-verde-500' : 'text-gray-400'}`}>
              Under
            </span>
            <span className={`font-bold ${majority === 'UNDER' ? 'text-verde-500' : 'text-gray-400'}`}>
              {underPct.toFixed(1)}%
            </span>
          </div>
          <div className="h-8 bg-obsidian-lighter rounded-lg overflow-hidden relative">
            <motion.div
              className={`h-full rounded-lg ${majority === 'UNDER' ? 'bg-verde-gradient' : 'bg-gray-700'}`}
              initial={{ width: 0 }}
              animate={{ width: `${underPct}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {question.under_count} {question.under_count === 1 ? 'vote' : 'votes'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-400">
        {question.total_answers} total {question.total_answers === 1 ? 'answer' : 'answers'}
      </div>
    </motion.div>
  );
}

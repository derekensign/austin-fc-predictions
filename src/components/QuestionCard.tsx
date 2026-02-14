'use client';

import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: {
    id: number;
    text: string;
    category?: string;
  };
  selectedAnswer?: 'OVER' | 'UNDER';
  onAnswer: (questionId: number, answer: 'OVER' | 'UNDER') => void;
  disabled?: boolean;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswer,
  disabled = false,
}: QuestionCardProps) {
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

      <h3 className="text-lg font-semibold mb-4 text-white">
        {question.text}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => !disabled && onAnswer(question.id, 'OVER')}
          disabled={disabled}
          className={`
            py-4 px-6 rounded-lg font-bold text-lg uppercase tracking-wide
            transition-all duration-200
            ${
              selectedAnswer === 'OVER'
                ? 'bg-verde-gradient text-black shadow-verde-lg scale-105'
                : 'bg-obsidian-lighter text-white border border-obsidian-lighter hover:border-verde-500'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          Over
        </button>

        <button
          type="button"
          onClick={() => !disabled && onAnswer(question.id, 'UNDER')}
          disabled={disabled}
          className={`
            py-4 px-6 rounded-lg font-bold text-lg uppercase tracking-wide
            transition-all duration-200
            ${
              selectedAnswer === 'UNDER'
                ? 'bg-verde-gradient text-black shadow-verde-lg scale-105'
                : 'bg-obsidian-lighter text-white border border-obsidian-lighter hover:border-verde-500'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          Under
        </button>
      </div>
    </motion.div>
  );
}

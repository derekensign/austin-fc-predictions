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

      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        <button
          type="button"
          onClick={() => !disabled && onAnswer(question.id, 'OVER')}
          disabled={disabled}
          className={`
            py-4 px-6 rounded-lg font-bold text-base sm:text-lg uppercase tracking-wide
            transition-all duration-300
            ${
              selectedAnswer === 'OVER'
                ? 'bg-verde-500 text-white shadow-[0_0_40px_rgba(0,177,64,0.8)] border-2 border-verde-400 font-extrabold ring-2 ring-verde-400 ring-offset-2 ring-offset-obsidian-900'
                : 'bg-obsidian-lighter text-white border-2 border-obsidian-lighter hover:border-verde-500 hover:text-verde-500 hover:shadow-verde hover:-translate-y-0.5'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-500 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-900
          `}
        >
          Over
        </button>

        <button
          type="button"
          onClick={() => !disabled && onAnswer(question.id, 'UNDER')}
          disabled={disabled}
          className={`
            py-4 px-6 rounded-lg font-bold text-base sm:text-lg uppercase tracking-wide
            transition-all duration-300
            ${
              selectedAnswer === 'UNDER'
                ? 'bg-verde-500 text-white shadow-[0_0_40px_rgba(0,177,64,0.8)] border-2 border-verde-400 font-extrabold ring-2 ring-verde-400 ring-offset-2 ring-offset-obsidian-900'
                : 'bg-obsidian-lighter text-white border-2 border-obsidian-lighter hover:border-verde-500 hover:text-verde-500 hover:shadow-verde hover:-translate-y-0.5'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-500 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-900
          `}
        >
          Under
        </button>
      </div>
    </motion.div>
  );
}

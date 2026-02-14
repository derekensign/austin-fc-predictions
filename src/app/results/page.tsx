'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ResultsChart from '@/components/ResultsChart';
import type { GetResultsResponse } from '@/types';

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<GetResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Check if user has submitted predictions OR is an admin
    const submitted = localStorage.getItem('predictions_submitted');
    const adminToken = localStorage.getItem('admin_token');

    if (!submitted && !adminToken) {
      // No access - redirect to home
      router.push('/?message=submit-first');
      return;
    }

    setHasAccess(true);

    // Initial load
    loadResults();

    // Poll every 3 seconds for updates
    const interval = setInterval(loadResults, 3000);

    return () => clearInterval(interval);
  }, [router]);

  async function loadResults() {
    try {
      const response = await fetch('/api/submissions');
      if (!response.ok) {
        throw new Error('Failed to load results');
      }
      const results = await response.json();
      setData(results);
      setError('');
    } catch (err: any) {
      console.error('Failed to load results:', err);
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  }

  if (!hasAccess || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-verde-500 text-xl">Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button onClick={loadResults} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-400 text-xl mb-4">No results yet</div>
          <Link href="/" className="btn-primary inline-block">
            Submit Predictions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-verde-500 mb-4">
            Live Results
          </h1>
          <p className="text-gray-300 text-lg mb-2">
            See how others are predicting the season
          </p>
          <div className="inline-block bg-verde-500/10 border border-verde-500 rounded-full px-6 py-2">
            <span className="text-verde-500 font-bold text-lg">
              {data.total_submissions} {data.total_submissions === 1 ? 'submission' : 'submissions'}
            </span>
          </div>
        </motion.div>

        {/* Results Charts */}
        <div className="space-y-6">
          {data.questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ResultsChart question={question} />
            </motion.div>
          ))}
        </div>

        {/* Footer Links */}
        <div className="mt-12 flex justify-center gap-4">
          <Link href="/" className="btn-secondary">
            Submit Your Predictions
          </Link>
          <Link href="/admin/login" className="text-gray-400 hover:text-verde-500 transition-colors px-4 py-2">
            Admin Login
          </Link>
        </div>

        {/* Live indicator */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-verde-500 rounded-full animate-pulse" />
          <span>Live updates every 3 seconds</span>
        </div>
      </div>
    </div>
  );
}

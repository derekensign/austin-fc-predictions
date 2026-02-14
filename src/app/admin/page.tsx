'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AdminResultsTable from '@/components/AdminResultsTable';
import type { AdminResultsResponse } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('admin_token');
    if (!storedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(storedToken);
    loadResults(storedToken);
  }, [router]);

  async function loadResults(authToken: string) {
    try {
      const response = await fetch('/api/admin/results', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.status === 401) {
        // Invalid or expired token
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to load results');
      }

      const results = await response.json();
      setData(results);
      setError('');
    } catch (err: any) {
      console.error('Failed to load admin results:', err);
      setError(err.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    if (!token) return;

    try {
      const response = await fetch('/api/admin/export', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      // Download CSV file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `austin-fc-predictions-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (err: any) {
      alert(err.message || 'Failed to export data');
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-verde-500 text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button onClick={() => token && loadResults(token)} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-4xl font-bold text-verde-500 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400">
              View all submissions and identify winners
            </p>
          </div>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </motion.div>

        {/* Results Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AdminResultsTable
            submissions={data.submissions}
            questions={data.questions}
            onExport={handleExport}
          />
        </motion.div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <a href="/results" className="text-gray-400 hover:text-verde-500 transition-colors">
            View Public Results →
          </a>
        </div>
      </div>
    </div>
  );
}

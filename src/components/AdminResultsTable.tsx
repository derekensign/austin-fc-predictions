'use client';

import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import type { SubmissionWithAnswers, QuestionWithResults } from '@/types';

interface AdminResultsTableProps {
  submissions: SubmissionWithAnswers[];
  questions: QuestionWithResults[];
  onExport: () => void;
}

type SortField = 'name' | 'email' | 'score' | 'submitted_at';
type SortDirection = 'asc' | 'desc';

export default function AdminResultsTable({
  submissions,
  questions,
  onExport,
}: AdminResultsTableProps) {
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Sort submissions
  const sortedSubmissions = [...submissions].sort((a, b) => {
    let aVal, bVal;

    switch (sortField) {
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'email':
        aVal = a.email.toLowerCase();
        bVal = b.email.toLowerCase();
        break;
      case 'score':
        aVal = a.score || 0;
        bVal = b.score || 0;
        break;
      case 'submitted_at':
        aVal = new Date(a.submitted_at).getTime();
        bVal = new Date(b.submitted_at).getTime();
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Filter by search term
  const filteredSubmissions = sortedSubmissions.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 max-w-md"
        />
        <button onClick={onExport} className="btn-primary">
          Export to CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="text-sm text-gray-400">Total Submissions</div>
          <div className="text-3xl font-bold text-verde-500">{submissions.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-400">Total Questions</div>
          <div className="text-3xl font-bold text-verde-500">{questions.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-400">Top Score</div>
          <div className="text-3xl font-bold text-verde-500">
            {submissions.length > 0 ? Math.max(...submissions.map(s => s.score || 0)) : 0}/{questions.length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="cursor-pointer hover:text-verde-500" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-2">
                  Name
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="cursor-pointer hover:text-verde-500" onClick={() => handleSort('email')}>
                <div className="flex items-center gap-2">
                  Email
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="cursor-pointer hover:text-verde-500" onClick={() => handleSort('score')}>
                <div className="flex items-center gap-2">
                  Score
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="cursor-pointer hover:text-verde-500" onClick={() => handleSort('submitted_at')}>
                <div className="flex items-center gap-2">
                  Submitted
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th>Answers</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((sub) => (
              <tr key={sub.id}>
                <td className="font-medium text-white">{sub.name}</td>
                <td className="text-gray-300">{sub.email}</td>
                <td>
                  <span className={`font-bold ${sub.score === questions.length ? 'text-verde-500' : 'text-white'}`}>
                    {sub.score || 0}/{questions.length}
                  </span>
                </td>
                <td className="text-gray-300">
                  {new Date(sub.submitted_at).toLocaleDateString()} {new Date(sub.submitted_at).toLocaleTimeString()}
                </td>
                <td>
                  <div className="flex gap-1">
                    {sub.answers.map((ans, i) => (
                      <span
                        key={i}
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          ans.answer === 'OVER'
                            ? 'bg-verde-500/20 text-verde-500'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                        title={`Q${i + 1}: ${ans.question_text}`}
                      >
                        {ans.answer === 'OVER' ? 'O' : 'U'}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No submissions found
        </div>
      )}
    </div>
  );
}

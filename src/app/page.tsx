import { Suspense } from 'react';
import SubmissionForm from '@/components/SubmissionForm';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-verde-500 text-xl">Loading...</div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SubmissionForm />
    </Suspense>
  );
}

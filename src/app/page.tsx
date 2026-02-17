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
    <div>
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://s3.us-west-1.amazonaws.com/redwood-labs/showpage/uploads/images/afab72a1-722c-49b7-a31b-2a2804fb0c71.png"
            width="200"
            height="200"
            alt="Moontower Soccer"
            className="mb-6 rounded"
          />
          <div className="text-center max-w-2xl px-4">
            <p className="text-lg leading-relaxed text-gray-300">
              Welcome to the 2026 Moontower Over/Under game. Please note that all of these choices need an "over" or "under" based on what you think will happen this season. Unless otherwise stated all props will be MLS only.
            </p>
          </div>
        </div>
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <SubmissionForm />
      </Suspense>
    </div>
  );
}

// @/app/request/page.tsx
import RequestForm from '@/components/requests/RequestForm';
import { Suspense } from 'react';

function RequestFormFallback() {
  return <div>Loading...</div>;
}

export default function RequestPage() {
  return (
    <Suspense fallback={<RequestFormFallback />}>
      <RequestForm />
    </Suspense>
  );
}

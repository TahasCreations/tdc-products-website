'use client';

import { useSession } from 'next-auth/react';
import DailyChallenges from './DailyChallenges';

/**
 * Wrapper for DailyChallenges - only shows for authenticated users
 */
export default function DailyChallengesWrapper() {
  const { data: session, status } = useSession();

  // Don't show if not logged in
  if (status === 'loading' || !session) {
    return null;
  }

  return <DailyChallenges />;
}


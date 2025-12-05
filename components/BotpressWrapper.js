'use client';

import dynamic from 'next/dynamic';

const BotpressWidget = dynamic(() => import('./BotpressWidget'), {
  ssr: false,
});

export default function BotpressWrapper() {
  return <BotpressWidget />;
}
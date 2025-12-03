'use client';

import { useEffect } from 'react';

export default function BotpressWidget() {
  useEffect(() => {
    // Add Botpress webchat script
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v2.2/inject.js';
    script.async = true;
    document.body.appendChild(script);

    // Add Botpress webchat configuration
    const configScript = document.createElement('script');
    configScript.src = 'https://files.bpcontent.cloud/2024/12/02/16/20241202160000-YOUR-BOT-ID.js';
    configScript.async = true;
    document.body.appendChild(configScript);

    // Cleanup on unmount
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (configScript.parentNode) {
        configScript.parentNode.removeChild(configScript);
      }
    };
  }, []);

  return null; // Widget renders via script injection
}

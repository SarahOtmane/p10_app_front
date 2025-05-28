import { useCallback } from 'react';

export const useMetrics = () => {
  const trackPageView = useCallback((pageName: string) => {
    // Envoyer la métrique au serveur
    fetch('/api/track-metric', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: 'page_view', 
        data: { page: pageName } 
      }),
    }).catch(console.error);
  }, []);

  const trackBet = useCallback((gpName: string, pilotName: string) => {
    fetch('/api/track-metric', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: 'bet_placed', 
        data: { gp_name: gpName, pilot_name: pilotName } 
      }),
    }).catch(console.error);
  }, []);

  const trackLeagueCreation = useCallback((type: 'private' | 'public') => {
    fetch('/api/track-metric', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: 'league_created', 
        data: { type } 
      }),
    }).catch(console.error);
  }, []);

  return {
    trackPageView,
    trackBet,
    trackLeagueCreation,
  };
};
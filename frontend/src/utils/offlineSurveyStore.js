/**
 * NLAMS Offline-First Field Survey Storage & Synchronization Engine
 * Handles persistent offline queuing, auto-sync upon reconnection, and network state.
 */

import { useState, useEffect, useCallback } from 'react';

const QUEUE_STORAGE_KEY = 'NLAMS_FIELD_SURVEYS_QUEUE_V1';
const SYNCED_STORAGE_KEY = 'NLAMS_FIELD_SURVEYS_HISTORY_V1';

/**
 * Retrieves all pending offline surveys from local storage
 */
export function getPendingOfflineSurveys() {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading offline survey queue:', err);
    return [];
  }
}

/**
 * Retrieves history of synced surveys
 */
export function getSyncedSurveyHistory() {
  try {
    const raw = localStorage.getItem(SYNCED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading synced survey history:', err);
    return [];
  }
}

/**
 * Queues a new or updated field survey locally
 */
export function queueOfflineSurvey(surveyData) {
  try {
    const currentQueue = getPendingOfflineSurveys();
    const surveyId = surveyData.id || `OFFLINE-SRV-${Date.now()}-${(surveyData.ulpin || '0000').slice(-4)}`;
    
    const preparedSurvey = {
      ...surveyData,
      id: surveyId,
      queued_at: new Date().toISOString(),
      sync_status: 'PENDING_OFFLINE',
      surveyor_name: surveyData.surveyor_name || 'Shri S. K. Sharma (Field Surveyor)',
      surveyor_id: surveyData.surveyor_id || 'SURV-UP-042',
      survey_date: surveyData.survey_date || new Date().toISOString().split('T')[0]
    };

    // Filter out if existing ID already in queue, then prepend
    const updatedQueue = [preparedSurvey, ...currentQueue.filter(s => s.id !== surveyId)];
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(updatedQueue));
    
    // Dispatch custom event so all open tabs / components update reactively
    window.dispatchEvent(new CustomEvent('nlams-queue-updated', { detail: { count: updatedQueue.length } }));
    
    return preparedSurvey;
  } catch (err) {
    console.error('Error saving survey to offline queue:', err);
    throw err;
  }
}

/**
 * Removes a specific survey from the queue (e.g. manual delete)
 */
export function removePendingSurvey(id) {
  try {
    const currentQueue = getPendingOfflineSurveys();
    const updatedQueue = currentQueue.filter(s => s.id !== id);
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(updatedQueue));
    window.dispatchEvent(new CustomEvent('nlams-queue-updated', { detail: { count: updatedQueue.length } }));
    return updatedQueue;
  } catch (err) {
    console.error('Error removing survey from queue:', err);
    return [];
  }
}

/**
 * Clears the entire offline survey queue
 */
export function clearPendingQueue() {
  try {
    localStorage.removeItem(QUEUE_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('nlams-queue-updated', { detail: { count: 0 } }));
  } catch (err) {
    console.error('Error clearing offline queue:', err);
  }
}

/**
 * Synchronizes all pending offline surveys to the backend database
 */
export async function syncPendingSurveysToBackend(apiBase = 'http://localhost:8000') {
  const pending = getPendingOfflineSurveys();
  if (!pending || pending.length === 0) {
    return { success: true, count: 0, message: 'No pending surveys to synchronize.' };
  }

  try {
    const response = await fetch(`${apiBase}/api/field-surveys/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pending)
    });

    if (!response.ok) {
      throw new Error(`Sync failed with server status ${response.status}`);
    }

    const data = await response.json();

    // Mark items as synced and archive them to synced history
    const history = getSyncedSurveyHistory();
    const newlySynced = pending.map(s => ({
      ...s,
      sync_status: 'SYNCED',
      synced_at: new Date().toISOString()
    }));
    
    localStorage.setItem(SYNCED_STORAGE_KEY, JSON.stringify([...newlySynced, ...history].slice(0, 50)));
    clearPendingQueue();

    window.dispatchEvent(new CustomEvent('nlams-surveys-synced', { detail: { count: newlySynced.length } }));

    return {
      success: true,
      count: newlySynced.length,
      message: data.message || `Successfully synchronized ${newlySynced.length} surveys into national database.`
    };
  } catch (err) {
    console.warn('[NLAMS Sync] Sync attempt encountered network/server error:', err.message);
    return {
      success: false,
      count: 0,
      error: err.message,
      message: 'Failed to reach server. Surveys remain safely stored in offline queue.'
    };
  }
}

/**
 * React Hook to monitor Online/Offline network state with auto-sync capability
 */
export function useNetworkSync(apiBase) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [pendingCount, setPendingCount] = useState(() => getPendingOfflineSurveys().length);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState(null);

  const refreshCount = useCallback(() => {
    setPendingCount(getPendingOfflineSurveys().length);
  }, []);

  const triggerSync = useCallback(async () => {
    if (!navigator.onLine) {
      return { success: false, message: 'Cannot sync while device is offline.' };
    }

    setIsSyncing(true);
    try {
      const result = await syncPendingSurveysToBackend(apiBase);
      setLastSyncResult(result);
      refreshCount();
      return result;
    } finally {
      setIsSyncing(false);
    }
  }, [apiBase, refreshCount]);

  useEffect(() => {
    const handleOnline = () => {
      console.log('[NLAMS] Network connection restored! Triggering auto-sync...');
      setIsOnline(true);
      // Auto-sync whenever internet comes back online
      triggerSync();
    };

    const handleOffline = () => {
      console.log('[NLAMS] Network disconnected. Switched to offline field mode.');
      setIsOnline(false);
    };

    const handleQueueUpdate = (e) => {
      if (e.detail && typeof e.detail.count === 'number') {
        setPendingCount(e.detail.count);
      } else {
        refreshCount();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('nlams-queue-updated', handleQueueUpdate);
    window.addEventListener('nlams-surveys-synced', refreshCount);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('nlams-queue-updated', handleQueueUpdate);
      window.removeEventListener('nlams-surveys-synced', refreshCount);
    };
  }, [triggerSync, refreshCount]);

  return {
    isOnline,
    pendingCount,
    isSyncing,
    lastSyncResult,
    triggerSync,
    refreshCount
  };
}

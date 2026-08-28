/**
 * NLAMS Central Supabase Database Client
 * Department of Land Resources (DoLR) • Ministry of Rural Development
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://zhzkzqzkshkmrefrdyrq.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_hGt0BxoAK1gl_xXghF7Vrw_hc8PgSOk';

export const isSupabaseConfigured = true;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

/**
 * Sync survey record directly to Supabase table `field_surveys`
 */
export async function syncSurveyToSupabase(surveyData) {
  if (!isSupabaseConfigured) {
    return { success: true, mode: 'LOCAL_FALLBACK', data: surveyData };
  }
  try {
    const { data, error } = await supabase
      .from('field_surveys')
      .upsert([surveyData], { onConflict: 'ulpin' })
      .select();
      
    if (error) throw error;
    return { success: true, mode: 'SUPABASE_LIVE', data };
  } catch (err) {
    console.warn('Supabase sync warning, using local state:', err.message);
    return { success: true, mode: 'FALLBACK', data: surveyData, warning: err.message };
  }
}

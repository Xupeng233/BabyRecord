import { supabase } from './supabase';
import { Entry } from '../types';

export const entriesService = {
  async getAll(userId: string): Promise<Entry[]> {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data.map((row: any) => ({
      id: row.id,
      date: row.date,
      photoBase64: row.photo_base64,
      daysOld: row.days_old,
      height: row.height,
      weight: row.weight,
      createdAt: row.created_at,
    }));
  },

  async add(
    userId: string,
    entry: Omit<Entry, 'id' | 'createdAt'>
  ): Promise<Entry> {
    const { data, error } = await supabase
      .from('entries')
      .insert({
        user_id: userId,
        photo_base64: entry.photoBase64,
        date: entry.date,
        days_old: entry.daysOld,
        height: entry.height,
        weight: entry.weight,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      date: data.date,
      photoBase64: data.photo_base64,
      daysOld: data.days_old,
      height: data.height,
      weight: data.weight,
      createdAt: data.created_at,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('entries').delete().eq('id', id);
    if (error) throw error;
  },
};
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
      photoUrls: Array.isArray(row.photo_urls) ? row.photo_urls : (row.photo_urls ? [row.photo_urls] : []),
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
        photo_urls: entry.photoUrls,
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
      photoUrls: Array.isArray(data.photo_urls) ? data.photo_urls : (data.photo_urls ? [data.photo_urls] : []),
      daysOld: data.days_old,
      height: data.height,
      weight: data.weight,
      createdAt: data.created_at,
    };
  },

  async update(id: string, entry: Partial<Entry>): Promise<Entry> {
    const updateData: any = {};
    if (entry.date !== undefined) updateData.date = entry.date;
    if (entry.daysOld !== undefined) updateData.days_old = entry.daysOld;
    if (entry.photoUrls !== undefined) updateData.photo_urls = entry.photoUrls;
    if (entry.height !== undefined) updateData.height = entry.height;
    if (entry.weight !== undefined) updateData.weight = entry.weight;

    const { data, error } = await supabase
      .from('entries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      date: data.date,
      photoUrls: Array.isArray(data.photo_urls) ? data.photo_urls : (data.photo_urls ? [data.photo_urls] : []),
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

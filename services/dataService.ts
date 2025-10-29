import { supabase } from './supabaseClient';
import { OPTData } from '../types';

// Tipe data yang diterima dari form, tanpa 'id'
export type OPTDataInput = Omit<OPTData, 'id' | 'status'> & { status?: 'Not Approved' | 'Approved' };

export const getOptData = async (): Promise<OPTData[]> => {
  const { data, error } = await supabase
    .from('opt_data')
    .select('*')
    .order('tanggal_update', { ascending: false });

  if (error) {
    console.error('Error fetching OPT data:', error);
    throw new Error(error.message);
  }

  // Menambahkan log untuk diagnostik yang lebih baik
  console.log(`[dataService] Successfully fetched ${data ? data.length : 0} records from 'opt_data' table.`);

  // Supabase mengembalikan id sebagai number, jadi kita pastikan cocok dengan tipe kita
  return data as OPTData[];
};

export const addOptData = async (newData: OPTDataInput): Promise<OPTData> => {
    // Menghapus properti id jika ada secara tidak sengaja
    const { ...insertData } = newData;

    const { data, error } = await supabase
        .from('opt_data')
        .insert({ ...insertData, status: 'Not Approved' })
        .select()
        .single();

    if (error) {
        console.error('Error adding OPT data:', error);
        throw new Error(error.message);
    }
    return data as OPTData;
};


export const updateOptData = async (id: number, updatedData: Partial<OPTDataInput>): Promise<OPTData> => {
  const { data, error } = await supabase
    .from('opt_data')
    .update(updatedData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating OPT data:', error);
    throw new Error(error.message);
  }
  return data as OPTData;
};

export const deleteOptData = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('opt_data')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting OPT data:', error);
    throw new Error(error.message);
  }
};
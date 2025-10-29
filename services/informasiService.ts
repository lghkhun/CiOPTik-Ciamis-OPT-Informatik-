import { supabase } from './supabaseClient';
import { InformasiOPT } from '../types';

export const getInformasiData = async (): Promise<InformasiOPT[]> => {
  const { data, error } = await supabase
    .from('informasi_opt')
    .select('*')
    .order('title', { ascending: true });
    
  if (error) {
    console.error('Error fetching informasi data:', error);
    throw new Error(error.message);
  }
  return data as InformasiOPT[];
};

/**
 * Uploads an image file to the 'opt-images' bucket in Supabase Storage.
 * @param file The image file to upload.
 * @returns The public URL of the uploaded image.
 */
export const uploadOptImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = fileName; // Simplified: No 'public/' prefix

  const { error: uploadError } = await supabase.storage
    .from('opt-images') // This must match the bucket name in your Supabase project
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage
    .from('opt-images')
    .getPublicUrl(filePath);
    
  if (!data || !data.publicUrl) {
    throw new Error('Could not get public URL for uploaded image.');
  }

  return data.publicUrl;
};


export const updateInformasiData = async (id: string, updatedData: Partial<InformasiOPT>): Promise<InformasiOPT> => {
  const { data, error } = await supabase
    .from('informasi_opt')
    .update(updatedData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating informasi data:', error);
    throw new Error(error.message);
  }
  return data as InformasiOPT;
};
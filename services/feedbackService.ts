import { supabase } from './supabaseClient';
import { Feedback } from '../types';

type FeedbackInput = Omit<Feedback, 'id' | 'timestamp' | 'status'>;

export const getFeedback = async (): Promise<Feedback[]> => {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching feedback data:', error);
    throw new Error(error.message);
  }
  // Map Supabase 'created_at' to 'timestamp'
  return data.map(fb => ({ ...fb, timestamp: fb.created_at })) as Feedback[];
};

export const addFeedback = async (feedback: FeedbackInput): Promise<Feedback> => {
  const { data, error } = await supabase
    .from('feedback')
    .insert({ ...feedback, status: 'new' })
    .select()
    .single();

  if (error) {
    console.error('Error adding feedback:', error);
    throw new Error(error.message);
  }
  return { ...data, timestamp: data.created_at } as Feedback;
};

export const markAsRead = async (id: string): Promise<Feedback> => {
  const { data, error } = await supabase
    .from('feedback')
    .update({ status: 'read' })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error marking feedback as read:', error);
    throw new Error(error.message);
  }
  return { ...data, timestamp: data.created_at } as Feedback;
};

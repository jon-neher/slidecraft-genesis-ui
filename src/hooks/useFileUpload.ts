import { useState } from 'react';
import { useSupabaseClient } from './useSupabaseClient';
import { useAuth } from '@clerk/clerk-react';

export const useFileUpload = () => {
  const supabase = useSupabaseClient();
  const { getToken, userId } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      setError(null);
      
      if (!userId) {
        throw new Error('No authentication session');
      }

      const token = await getToken();
      
      const filePath = `${userId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);
      if (uploadError) {
        throw uploadError;
      }
      const { data } = await supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      console.error('File upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error };
};

import { supabase } from "@/integrations/supabase/client";

export const createTestMeme = async () => {
  const { data, error } = await supabase
    .from('Memes')
    .insert([
      {
        title: 'Test Telegram Notification',
        description: 'This is a test meme to verify Telegram notifications 🚀',
        image_url: 'https://dpybiegurkiqwponvxac.supabase.co/storage/v1/object/public/memecardstore/placeholder.png',
        blockchain: 'Test',
        created_by: (await supabase.auth.getUser()).data.user?.id
      }
    ])
    .select();

  if (error) {
    console.error('Error creating test meme:', error);
    throw error;
  }

  console.log('Test meme created successfully:', data);
  return data;
};
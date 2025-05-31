import { supabase } from './user';

/**
 * Uploads an image file to the 'job-images' bucket in Supabase Storage.
 * Returns the public URL of the uploaded image.
 * @param file The image file to upload
 * @param jobId The job ID to associate the image with (used in the file path)
 */
export async function uploadJobImage(
  file: File,
  jobId: string,
): Promise<string> {
  const filePath = `jobs/${jobId}/${file.name}`;
  const { error } = await supabase.storage
    .from('job-images')
    .upload(filePath, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from('job-images').getPublicUrl(filePath);
  if (!data?.publicUrl) throw new Error('Kunne ikke hente billede-URL');

  return data.publicUrl;
}

export async function getJobImageBlob(
  jobId: string,
  fileName: string,
): Promise<string> {
  const filePath = `jobs/${jobId}/${fileName}`;
  const { data, error } = await supabase.storage
    .from('job-images')
    .download(filePath);

  if (error || !data) throw new Error('Kunne ikke hente billede');

  return URL.createObjectURL(data);
}

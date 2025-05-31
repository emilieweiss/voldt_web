// Place this in any file, e.g. TempImageUploader.tsx
import { useEffect, useState } from 'react';
import { getJobImageBlob, uploadJobImage } from '../api/images';
import { supabase } from '../api/user';

const TempImageUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const jobId = '123';
  const [securedUrl, setSecuredUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = await getJobImageBlob('123', 'selfie.PNG');
        setSecuredUrl(url);
      } catch (err) {
        console.error('Kunne ikke hente privat billede:', err);
      }
    };

    fetchImage();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setImageUrl(null);
    setError(null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {});
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      // Use a random jobId for testing
      const url = await uploadJobImage(file, jobId);
      setImageUrl(url);
    } catch (err: any) {
      setError(err.message || 'Fejl ved upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, border: '1px solid #ccc', maxWidth: 400 }}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        style={{ marginLeft: 10 }}
      >
        {loading ? 'Uploader...' : 'Upload'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      {imageUrl && (
        <div style={{ marginTop: 10 }}>
          <div>
            URL:{' '}
            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
              {imageUrl}
            </a>
          </div>
          <img
            src={imageUrl}
            alt="Preview"
            style={{ maxWidth: 200, marginTop: 10 }}
          />
        </div>
      )}
      {securedUrl && <img src={securedUrl} alt="Privat billede" />}
    </div>
  );
};

export default TempImageUploader;

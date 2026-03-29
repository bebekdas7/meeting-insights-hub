
import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { toast } from 'sonner';
import { api } from '@/services/api';

export default function UploadPage() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'failed'>('idle');

  const handleUpload = async (file: File) => {
    setStatus('uploading');
    setProgress(0);
    try {
      const res = await api.meetings.upload(file, (pct) => setProgress(pct));
      if (res && res.success) {
        setStatus('completed');
        toast.success('Meeting uploaded! AI will process it soon.');
      } else {
        setStatus('failed');
        toast.error(res?.message || 'Upload failed. Please try again.');
      }
    } catch (err: any) {
      setStatus('failed');
      toast.error(err?.message || 'Upload failed. Please try again.');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setProgress(0);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>Upload Meeting</h1>
        <p className="mt-1 text-sm text-muted-foreground animate-fade-in opacity-0" style={{ animationDelay: '80ms', animationFillMode: 'forwards' }}>
          Upload a recording and let AI extract insights
        </p>
      </div>
      <FileUpload
        onUpload={handleUpload}
        isUploading={status === 'uploading'}
        progress={progress}
        status={status}
        onRetry={handleRetry}
      />
    </div>
  );
}

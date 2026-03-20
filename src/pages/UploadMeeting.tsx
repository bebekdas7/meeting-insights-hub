import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { toast } from 'sonner';

export default function UploadPage() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'failed'>('idle');

  const handleUpload = async (_file: File) => {
    setStatus('uploading');
    setProgress(0);

    // Simulate upload
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 80));
      setProgress(i);
    }

    setStatus('processing');
    toast.info('Processing your meeting with AI...');

    await new Promise(r => setTimeout(r, 2500));

    // Simulate success (80%) or failure (20%)
    if (Math.random() > 0.2) {
      setStatus('completed');
      toast.success('Meeting processed successfully!');
    } else {
      setStatus('failed');
      toast.error('Processing failed. Please try again.');
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

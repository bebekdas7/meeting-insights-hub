
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '@/components/FileUpload';
import { toast } from 'sonner';
import { api } from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UploadPage() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'failed'>('idle');
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (file: File) => {
    console.log('Starting upload for file:', file);
    setStatus('uploading');
    setProgress(0);
    try {
      const res = await api.meetings.upload(file, (pct) => setProgress(pct));
      console.log('Upload response:', res);
      if (res && res.success) {
        setStatus('completed');
        toast.success('Meeting uploaded! AI will process it soon.');
      } else {
        const msg: string = res?.message || res?.error || '';
        console.log('Upload failed:', msg);
        if (msg.toLowerCase().includes('insufficient credits')) {
          setStatus('failed');
          setShowCreditsModal(true);
        } else {
          setStatus('failed');
          toast.error(msg || 'Upload failed. Please try again.');
        }
      }
    } catch (err: any) {
      const msg: string = err?.message || '';
      if (msg.toLowerCase().includes('insufficient credits')) {
        setStatus('failed');
        setShowCreditsModal(true);
      } else {
        setStatus('failed');
        toast.error(msg || 'Upload failed. Please try again.');
      }
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

      {/* Insufficient Credits Modal */}
      <Dialog open={showCreditsModal} onOpenChange={setShowCreditsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 mx-auto mb-3">
              <Zap className="w-7 h-7 text-amber-500" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              You've Used All Your Free Credits
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground mt-1">
              Your free plan credits have been exhausted. Upgrade to a paid plan to continue uploading meetings and unlocking AI-powered insights.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 rounded-lg border bg-muted/40 p-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
              <span>Get more meetings per month with unlimited AI summaries</span>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
              <span>Action items, speaker insights & priority processing</span>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
              <span>Plans starting at just ₹149/month</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowCreditsModal(false);
                handleRetry();
              }}
            >
              Maybe Later
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setShowCreditsModal(false);
                navigate('/pricing');
              }}
            >
              View Pricing Plans
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

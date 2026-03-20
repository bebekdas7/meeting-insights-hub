import { useState, useRef, useCallback } from 'react';
import { Upload, FileVideo, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';
  onRetry?: () => void;
}

const ACCEPTED = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];

export function FileUpload({ onUpload, isUploading, progress, status, onRetry }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = useCallback((file: File) => {
    setError(null);
    if (!ACCEPTED.includes(file.type)) {
      setError('Please upload a video file (MP4, WebM, MOV, or AVI)');
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      setError('File size must be under 500MB');
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSet(file);
  }, [validateAndSet]);

  const handleSubmit = () => {
    if (selectedFile) onUpload(selectedFile);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="mx-auto max-w-2xl animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
      {status === 'idle' && !selectedFile && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'relative cursor-pointer rounded-2xl border-2 border-dashed p-16 text-center transition-all duration-200',
            dragOver
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-border hover:border-primary/40 hover:bg-muted/50'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) validateAndSet(e.target.files[0]); }}
          />
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-2xl bg-primary/8 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground">Drop your meeting recording here</p>
              <p className="mt-1 text-sm text-muted-foreground">or click to browse · MP4, WebM, MOV up to 500MB</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {selectedFile && status === 'idle' && (
        <div className="mt-4 animate-scale-in rounded-xl border border-border bg-card p-4" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/8 p-2">
              <FileVideo className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-card-foreground">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{formatSize(selectedFile.size)}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleSubmit} className="mt-4 w-full" disabled={isUploading}>
            Upload Meeting
          </Button>
        </div>
      )}

      {(status === 'uploading' || status === 'processing') && (
        <div className="mt-4 rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/8 p-2">
              <FileVideo className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-card-foreground">{selectedFile?.name}</p>
              <p className="text-xs text-muted-foreground">
                {status === 'uploading' ? `Uploading... ${progress}%` : 'Processing with AI...'}
              </p>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                status === 'processing' ? 'bg-warning animate-pulse w-full' : 'bg-primary'
              )}
              style={status === 'uploading' ? { width: `${progress}%` } : undefined}
            />
          </div>
        </div>
      )}

      {status === 'completed' && (
        <div className="mt-4 animate-scale-in rounded-xl border border-success/20 bg-success/5 p-6 text-center" style={{ animationFillMode: 'forwards' }}>
          <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
          <p className="mt-3 font-medium text-foreground">Upload complete!</p>
          <p className="mt-1 text-sm text-muted-foreground">Your meeting is being processed. You'll be notified when it's ready.</p>
        </div>
      )}

      {status === 'failed' && (
        <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <p className="mt-3 font-medium text-foreground">Upload failed</p>
          <p className="mt-1 text-sm text-muted-foreground">Something went wrong. Please try again.</p>
          {onRetry && <Button variant="outline" onClick={onRetry} className="mt-4">Retry Upload</Button>}
        </div>
      )}
    </div>
  );
}

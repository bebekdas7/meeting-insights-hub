import { useEffect, useMemo, useState } from 'react';
import { ReceiptText } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { SkeletonTable } from '@/components/SkeletonLoaders';
import { api } from '@/services/api';
import type { CreditHistoryEntry, PaginationMeta } from '@/types';

const SOURCE_CLASS_MAP: Record<string, string> = {
  purchase: 'bg-emerald-100 text-emerald-700',
  signup_free: 'bg-blue-100 text-blue-700'
};

const formatDate = (dateLike: string) => {
  const parsed = new Date(dateLike);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const PLAN_ID_MAP: Record<string, string> = {
  '1': 'Free',
  '2': 'One Time',
  '3': 'Starter',
  '4': 'Pro'
};

const getReferenceLabel = (entry: CreditHistoryEntry) => {
  if (!entry.reference_id) return '-';
  const plan = PLAN_ID_MAP[entry.reference_id];
  return plan ? `${entry.reference_id} (${plan})` : entry.reference_id;
};

export default function PurchaseHistoryPage() {
  const [history, setHistory] = useState<CreditHistoryEntry[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.payment
      .getPurchaseHistory()
      .then((res) => {
        setHistory(Array.isArray(res.data) ? res.data : []);
        setPagination(res.pagination ?? null);
      })
      .catch(() => {
        setHistory([]);
        setPagination(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [history]);

  const totalRecords = pagination?.total ?? sortedHistory.length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
          Purchase History
        </h1>
        <p className="mt-1 text-sm text-muted-foreground animate-fade-in opacity-0" style={{ animationDelay: '80ms', animationFillMode: 'forwards' }}>
          Credit ledger entries from purchases and free signup credits.
        </p>
        {!loading && (
          <p className="mt-2 text-xs text-muted-foreground">Total records: {totalRecords}</p>
        )}
      </div>

      {loading ? (
        <SkeletonTable rows={5} />
      ) : sortedHistory.length === 0 ? (
        <EmptyState
          icon={<ReceiptText className="h-8 w-8" />}
          title="No purchases yet"
          description="When you purchase a plan or credits, it will appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Credits</th>
                <th className="hidden sm:table-cell px-4 py-3 text-left font-medium text-muted-foreground">Source</th>
                <th className="hidden md:table-cell px-4 py-3 text-left font-medium text-muted-foreground">Reference</th>
                <th className="hidden lg:table-cell px-4 py-3 text-left font-medium text-muted-foreground">Expiry</th>
                <th className="hidden lg:table-cell px-4 py-3 text-left font-medium text-muted-foreground">Created On</th>
              </tr>
            </thead>
            <tbody>
              {sortedHistory.map((entry, i) => (
                <tr
                  key={entry.id}
                  className="border-b border-border last:border-0 animate-fade-up opacity-0"
                  style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'forwards' }}
                >
                  <td className="px-4 py-3.5 font-medium text-card-foreground">{entry.type}</td>
                  <td className="px-4 py-3.5 text-muted-foreground tabular-nums">{entry.amount}</td>
                  <td className="hidden sm:table-cell px-4 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${SOURCE_CLASS_MAP[entry.source] || 'bg-slate-100 text-slate-700'}`}>
                      {entry.source}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-4 py-3.5 text-muted-foreground">{getReferenceLabel(entry)}</td>
                  <td className="hidden lg:table-cell px-4 py-3.5 text-muted-foreground">
                    {entry.expiry ? formatDate(entry.expiry) : '-'}
                  </td>
                  <td className="hidden lg:table-cell px-4 py-3.5 text-muted-foreground">{formatDate(entry.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

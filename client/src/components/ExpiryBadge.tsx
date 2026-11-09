import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, AlertOctagon, XCircle } from 'lucide-react';

interface ExpiryBadgeProps {
  status: 'SAFE' | 'EXPIRING_SOON' | 'URGENT' | 'EXPIRES_TODAY' | 'EXPIRED';
  remainingDays?: number;
}

export const ExpiryBadge: React.FC<ExpiryBadgeProps> = ({ status, remainingDays }) => {
  switch (status) {
    case 'SAFE':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SAFE {remainingDays !== undefined ? `(${remainingDays}d)` : ''}</span>
        </span>
      );
    case 'EXPIRING_SOON':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <Clock className="w-3.5 h-3.5" />
          <span>EXPIRING SOON {remainingDays !== undefined ? `(${remainingDays}d)` : ''}</span>
        </span>
      );
    case 'URGENT':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>URGENT {remainingDays !== undefined ? `(${remainingDays}d)` : ''}</span>
        </span>
      );
    case 'EXPIRES_TODAY':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/40 animate-pulse">
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>EXPIRES TODAY</span>
        </span>
      );
    case 'EXPIRED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-950/80 text-red-300 border border-red-800/80">
          <XCircle className="w-3.5 h-3.5 text-red-400" />
          <span>EXPIRED</span>
        </span>
      );
    default:
      return null;
  }
};

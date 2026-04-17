import React from 'react';
import { StatusBadgeProps, StatusType } from './types';
const statusConfig: Record<
  StatusType,
  {
    bg: string;
    fg: string;
    defaultLabel: string;
  }> =
{
  completed: {
    bg: 'bg-[#69606326]',
    fg: 'text-[#0A0A0A]',
    defaultLabel: 'Completed'
  },
  pending: {
    bg: 'bg-[#C1820026]',
    fg: 'text-[#A87200]',
    defaultLabel: 'Pending'
  },
  review: {
    bg: 'bg-[#2B62EF26]',
    fg: 'text-[#244EB6]',
    defaultLabel: 'Under Review'
  },
  rejected: {
    bg: 'bg-[#D4092426]',
    fg: 'text-[#D40924]',
    defaultLabel: 'Rejected'
  },
  confirmed: {
    bg: 'bg-[#00766826]',
    fg: 'text-[#006458]',
    defaultLabel: 'Confirmed'
  }
};
export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status];
  const displayLabel = label || config.defaultLabel;
  return (
    <span
      className={`inline-flex items-center justify-center h-6 px-2 rounded-full font-sans text-[11px] leading-[11px] font-medium ${config.bg} ${config.fg}`}>
      
      {displayLabel}
    </span>);

}
"use client";

interface SectionHeaderProps {
  title: string;
  total?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  total,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <p className="text-xs font-semibold tracking-wider text-text-muted uppercase">
        {title}
      </p>
      {total && (
        <p className="text-xs font-semibold text-text-secondary">{total}</p>
      )}
    </div>
  );
}

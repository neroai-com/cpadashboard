export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = { sm: 32, md: 40, lg: 56 }[size];
  const textSize = { sm: "text-sm", md: "text-base", lg: "text-xl" }[size];

  return (
    <div className="flex items-center gap-2" aria-label="myCPA Dashboard">
      <svg
        width={dims}
        height={dims}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="20" cy="16" r="12" fill="#22c55e" />
        <circle cx="28" cy="16" r="12" fill="#16a34a" />
        <circle cx="24" cy="26" r="12" fill="#15803d" />
      </svg>
      <div className={`font-bold leading-tight ${textSize}`}>
        <span className="text-white">
          my <span className="text-accent-green">CPA</span>
        </span>
        <div className="text-[0.6em] tracking-widest text-text-secondary uppercase">
          Dashboard
        </div>
      </div>
    </div>
  );
}

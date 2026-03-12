"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import Pill from "@/components/Pill";
import ProgressBar from "@/components/ProgressBar";
import { entities, chartOfAccountsData } from "@/lib/data";
import { toggleArray } from "@/lib/utils";
import {
  Link2,
  Calculator,
  BookOpen,
  CheckCircle2,
  Check,
  Plus,
  ArrowLeft,
} from "lucide-react";

const stepsMeta = [
  { label: "Connect", icon: Link2 },
  { label: "Accounting", icon: Calculator },
  { label: "Chart", icon: BookOpen },
  { label: "Review", icon: CheckCircle2 },
];

function SetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const entityId = searchParams.get("entity");
  const entity = entityId
    ? entities.find((e) => e.id === entityId)
    : undefined;

  const [step, setStep] = useState(1);

  // Step 1
  const [connectionType, setConnectionType] = useState<string | null>(null);

  // Step 2
  const [accountingMethod, setAccountingMethod] = useState("Accrual");
  const [fiscalYear, setFiscalYear] = useState("Calendar (Jan - Dec)");
  const [closeRule, setCloseRule] = useState("Allow soft close");
  const [controlAccounts, setControlAccounts] = useState([
    "Accounts receivable",
    "Accounts payable",
  ]);
  const [coreSpaces, setCoreSpaces] = useState(["Books health"]);

  // Step 3
  const [coaSearches, setCoaSearches] = useState<Record<string, string>>({});

  const totalSteps = 4;
  const progressPercent = (step / totalSteps) * 100;

  if (!entity) {
    return (
      <div className="min-h-dvh bg-bg-primary flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <h1 className="text-xl font-bold text-text-primary mb-2">
            Entity not found
          </h1>
          <p className="text-sm text-text-secondary mb-6">
            No valid entity was provided for setup. Please go back and select
            an entity.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 rounded-lg bg-accent-green hover:bg-accent-green-dark text-white font-semibold transition-colors text-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  function next() {
    if (step < totalSteps) setStep(step + 1);
    else router.push(`/entity/${entityId}`);
  }

  function back() {
    if (step > 1) setStep(step - 1);
    else router.push(`/entity/${entityId}`);
  }

  return (
    <div className="min-h-dvh bg-bg-primary">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 animate-fade-in">
          <Logo size="sm" />
          <span className="text-xs text-text-secondary border border-border-secondary rounded-full px-3 py-1">
            Step {step} of {totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <ProgressBar
          percent={progressPercent}
          height={3}
          className="mb-4 animate-fade-in"
        />

        {/* Step indicator dots */}
        <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
          {stepsMeta.map((s, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isComplete = step > stepNum;
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all text-xs font-bold ${
                    isComplete
                      ? "bg-accent-green text-white"
                      : isActive
                      ? "bg-accent-green/20 text-accent-green border border-accent-green"
                      : "bg-bg-input text-text-muted border border-border-secondary"
                  }`}
                >
                  {isComplete ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <Icon size={14} />
                  )}
                </div>
                <span
                  className={`text-[9px] font-medium ${
                    isActive || isComplete
                      ? "text-text-secondary"
                      : "text-text-muted"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Connect */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold mb-2">
              Let&apos;s set up {entity.name}.
            </h1>
            <p className="text-text-secondary text-sm mb-6">
              We&apos;ll connect your accounts, build a chart of accounts, and
              get Accounting home ready.
            </p>

            <p className="text-xs text-text-muted mb-4">
              What we&apos;ll do:
            </p>

            <div className="space-y-3 mb-6">
              {[
                {
                  title: "Connect accounts",
                  desc: `Link bank(s) and credit cards for "${entity.type === "Operating" ? "operating" : "holding"}" GL feed.`,
                },
                {
                  title: "Choose methods",
                  desc: "Cash vs accrual, fiscal year, and close rules.",
                },
                {
                  title: "Chart of accounts",
                  desc: "Real-estate ready COA, customized for you.",
                },
                {
                  title: "Map AP/AR",
                  desc: "Control accounts for payables, receivables, payroll, and more.",
                },
              ].map((item) => (
                <button
                  key={item.title}
                  onClick={() => setConnectionType(item.title)}
                  className={`w-full text-left p-3 rounded-lg border transition-all focus-visible:ring-2 focus-visible:ring-accent-green outline-none ${
                    connectionType === item.title
                      ? "border-accent-green bg-accent-green/5"
                      : "border-border-primary hover:bg-bg-card-hover"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    {connectionType === item.title && (
                      <div className="w-5 h-5 rounded-full bg-accent-green flex items-center justify-center flex-shrink-0 ml-3 animate-scale-in">
                        <Check size={12} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Accounting setup */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold mb-2">
              Set up your accounting
            </h1>
            <p className="text-text-secondary text-sm mb-6">
              Configure your bookkeeping method, connect to GL accounts, and
              choose what matters most. You can adjust these later in Settings.
            </p>

            <div className="bg-bg-card rounded-xl border border-border-primary p-4 space-y-6">
              <div>
                <p className="text-sm font-medium mb-2">Accounting method</p>
                <div className="flex gap-2">
                  {["Accrual", "Cash"].map((m) => (
                    <Pill
                      key={m}
                      label={m}
                      active={accountingMethod === m}
                      onClick={() => setAccountingMethod(m)}
                    />
                  ))}
                </div>
                <p className="text-xs text-text-muted mt-2">
                  Most multi-entity real estate and operating companies use
                  accrual for better reporting.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Fiscal year</p>
                <div className="flex flex-wrap gap-2">
                  {["Calendar (Jan - Dec)", "Fiscal (pick month)"].map((f) => (
                    <Pill
                      key={f}
                      label={f}
                      active={fiscalYear === f}
                      onClick={() => setFiscalYear(f)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Close rules</p>
                <div className="flex flex-wrap gap-2">
                  {["Allow soft close", "Require CPA lock"].map((c) => (
                    <Pill
                      key={c}
                      label={c}
                      active={closeRule === c}
                      onClick={() => setCloseRule(c)}
                    />
                  ))}
                </div>
                <p className="text-xs text-text-muted mt-2">
                  &quot;Soft close&quot; means you can still adjust with tracked
                  JEs; CPA lock freezes the period.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Control Accounts</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Accounts receivable",
                    "Accounts payable",
                    "Rent & tenant income",
                    "Payroll clearing",
                  ].map((a) => (
                    <Pill
                      key={a}
                      label={a}
                      active={controlAccounts.includes(a)}
                      onClick={() =>
                        setControlAccounts(toggleArray(controlAccounts, a))
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Core Spaces</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Books health",
                    "Uncoded transactions",
                    "Accruals & schedules",
                    "Journal entries",
                  ].map((s) => (
                    <Pill
                      key={s}
                      label={s}
                      active={coreSpaces.includes(s)}
                      onClick={() =>
                        setCoreSpaces(toggleArray(coreSpaces, s))
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Chart of Accounts */}
        {step === 3 && (
          <div className="animate-fade-in-up">
            <ChartOfAccountsStep
              coaSearches={coaSearches}
              setCoaSearches={setCoaSearches}
            />
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold mb-2">
              Review &amp; finish
            </h1>
            <p className="text-text-secondary text-sm mb-6">
              Everything looks good. You can always change these in Settings.
            </p>

            <div className="bg-bg-card rounded-xl border border-border-primary p-4 space-y-4">
              {[
                { label: "Entity", value: entity.name },
                { label: "Accounting method", value: accountingMethod },
                { label: "Fiscal year", value: fiscalYear },
                { label: "Close rule", value: closeRule },
                {
                  label: "Control accounts",
                  value: controlAccounts.join(", ") || "None selected",
                },
                {
                  label: "Core spaces",
                  value: coreSpaces.join(", ") || "None selected",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-4">
                  <p className="text-xs text-text-muted flex-shrink-0">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-right">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-accent-green/5 border border-accent-green/20 flex items-start gap-2">
              <CheckCircle2 size={16} className="text-accent-green flex-shrink-0 mt-0.5" />
              <p className="text-xs text-text-secondary">
                All settings can be changed later from the entity&apos;s Settings page.
              </p>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={next}
            className="w-full py-3.5 rounded-lg bg-accent-green hover:bg-accent-green-dark text-white font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {step === totalSteps ? "Finish Setup" : "Continue"}
          </button>
          <button
            onClick={back}
            className="w-full py-3.5 rounded-lg border border-border-secondary text-text-secondary font-semibold hover:bg-bg-card transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

function ChartOfAccountsStep({
  coaSearches,
  setCoaSearches,
}: {
  coaSearches: Record<string, string>;
  setCoaSearches: (v: Record<string, string>) => void;
}) {
  const categories = Object.keys(chartOfAccountsData);

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">Chart of accounts</h1>
      <p className="text-text-secondary text-sm mb-6">
        We&apos;ll start with a real-estate-ready COA. You can tune what you
        care about most.
      </p>

      <div className="bg-bg-card rounded-xl border border-border-primary p-4">
        <p className="text-xs text-text-muted mb-4">
          If a desired chart of account isn&apos;t listed, tap the plus button
          to add it.
        </p>

        <div className="space-y-6">
          {categories.map((category) => (
            <COACategory
              key={category}
              category={category}
              accounts={chartOfAccountsData[category]}
              search={coaSearches[category] ?? ""}
              onSearch={(val) =>
                setCoaSearches({ ...coaSearches, [category]: val })
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}

function COACategory({
  category,
  accounts,
  search,
  onSearch,
}: {
  category: string;
  accounts: string[];
  search: string;
  onSearch: (v: string) => void;
}) {
  const filtered = useMemo(
    () =>
      search
        ? accounts.filter((a) =>
            a.toLowerCase().includes(search.toLowerCase())
          )
        : accounts,
    [accounts, search]
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-text-secondary">{category}</p>
        <button
          aria-label={`Add ${category} account`}
          className="w-8 h-8 rounded-full bg-accent-green flex items-center justify-center hover:bg-accent-green-dark transition-colors focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-card outline-none"
          onClick={() =>
            alert(`Add new ${category} account — coming soon.`)
          }
        >
          <Plus size={14} className="text-white" strokeWidth={3} />
        </button>
      </div>
      <input
        type="text"
        placeholder="Search accounts..."
        aria-label={`Search ${category} accounts`}
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-bg-input border border-border-secondary text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-green transition-all mb-2"
      />
      <div className="max-h-48 overflow-y-auto no-scrollbar">
        {filtered.map((account) => (
          <div
            key={account}
            className="py-2 px-1 text-sm text-text-primary border-b border-border-primary/50 last:border-0"
          >
            {account}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-text-muted py-2">No accounts found.</p>
        )}
      </div>
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-bg-primary flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SetupContent />
    </Suspense>
  );
}

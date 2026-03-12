"use client";

import { use, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/lib/auth";
import Logo from "@/components/Logo";
import Card from "@/components/Card";
import { entities, businessServices, entityInsights } from "@/lib/data";
import {
  Receipt,
  FileText,
  Calculator,
  Users,
  Landmark,
  Shield,
  Building,
  HandCoins,
  FolderOpen,
  Brain,
  Settings,
  Sparkles,
  ArrowLeft,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

const serviceIcons: Record<string, LucideIcon> = {
  ap: Receipt,
  ar: FileText,
  accounting: Calculator,
  payroll: Users,
  banking: Landmark,
  insurance: Shield,
  "property-tax": Building,
  loans: HandCoins,
  documents: FolderOpen,
  cfo: Brain,
  settings: Settings,
};

function EntityContent({ id }: { id: string }) {
  const authed = useAuthGuard();
  const router = useRouter();
  const entity = entities.find((e) => e.id === id);

  if (!authed) {
    return (
      <div className="min-h-dvh bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="min-h-dvh bg-bg-primary flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <h1 className="text-xl font-bold text-text-primary mb-2">
            Entity not found
          </h1>
          <p className="text-sm text-text-secondary mb-6">
            The entity you&apos;re looking for doesn&apos;t exist or has been
            removed.
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

  return (
    <div className="min-h-dvh bg-bg-primary">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-accent-green rounded-lg outline-none p-1"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={20} className="text-text-secondary" />
            <Logo size="sm" />
          </button>
          <span className="text-xs text-text-secondary border border-border-secondary rounded-full px-3 py-1">
            {entity.name}
          </span>
        </div>

        {/* Title */}
        <div className="animate-fade-in-up delay-1">
          <h1 className="text-2xl font-bold mb-1">Business services.</h1>
          <p className="text-text-secondary text-sm mb-6">
            Choose what you want to work on for this entity. Each service opens
            its own view.
          </p>
        </div>

        {/* Services */}
        <Card className="mb-6 !p-0 overflow-hidden animate-fade-in-up delay-2">
          <div className="p-4 pb-2">
            <h2 className="text-xs font-semibold tracking-wider text-text-secondary uppercase mb-1">
              Services
            </h2>
            <p className="text-text-secondary text-xs mb-4">
              Tap a category to manage it for {entity.name}.
            </p>
          </div>

          <div className="divide-y divide-border-primary">
            {businessServices.map((service) => {
              const hasAction = service.id === "settings";
              const Icon = serviceIcons[service.id];
              return (
                <button
                  key={service.id}
                  onClick={
                    hasAction
                      ? () => router.push(`/setup?entity=${entity.id}`)
                      : undefined
                  }
                  disabled={!hasAction}
                  className={`w-full flex items-center gap-3 py-3.5 px-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-inset outline-none ${
                    hasAction
                      ? "hover:bg-bg-card-hover cursor-pointer"
                      : "cursor-default"
                  }`}
                >
                  {Icon && (
                    <div className="w-8 h-8 rounded-lg bg-bg-input/80 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-text-secondary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="font-semibold text-sm">{service.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {service.description}
                    </p>
                  </div>
                  {service.rightLabel && (
                    <div className="text-right flex-shrink-0">
                      {service.rightSub ? (
                        <>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-green/10 text-accent-green">
                            {service.rightLabel}
                          </span>
                          <p className="text-xs text-text-muted mt-0.5">
                            {service.rightSub}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-medium text-text-secondary">
                          {service.rightLabel}
                        </p>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-text-muted px-4 py-3">
            You can enable or disable services for this entity from its
            settings &amp; modules.
          </p>
        </Card>

        {/* AI CFO for entity */}
        <Card variant="hero" className="mb-6 animate-fade-in-up delay-3">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-accent-green" />
            <h2 className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
              AI CFO &middot; {entity.name}
            </h2>
          </div>
          <p className="text-text-secondary text-xs mb-4">
            Entity-specific opportunities and risks.
          </p>

          <div className="space-y-3">
            {entityInsights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-border-primary/50"
              >
                <div className="w-7 h-7 rounded-md bg-bg-input/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle size={14} className="text-accent-yellow" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{insight.title}</p>
                  <p className="text-xs text-text-muted">
                    {insight.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() =>
              alert("AI CFO advisory for this entity coming soon.")
            }
            className="w-full mt-5 py-3 rounded-lg bg-accent-green hover:bg-accent-green-dark text-white font-semibold transition-colors text-sm active:scale-[0.98]"
          >
            Open AI CFO for this business
          </button>
        </Card>

        {/* Bottom nav */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-md border-t border-border-primary safe-bottom"
          aria-label="Entity navigation"
        >
          <div className="max-w-lg mx-auto flex">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex-1 min-h-[48px] py-3 flex items-center justify-center gap-2 text-xs font-medium text-accent-green focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-inset outline-none"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default function EntityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-bg-primary flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <EntityContent id={id} />
    </Suspense>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { clearAuth } from "@/lib/auth";
import Logo from "@/components/Logo";
import Card from "@/components/Card";
import {
  User,
  CreditCard,
  Users,
  Link,
  Bell,
  Lock,
  Database,
  ChevronRight,
  LogOut,
  type LucideIcon,
} from "lucide-react";

const settingsItems: {
  label: string;
  desc: string;
  icon: LucideIcon;
  iconColor: string;
}[] = [
  {
    label: "Profile & account",
    desc: "Name, email, password, and preferences.",
    icon: User,
    iconColor: "text-accent-blue",
  },
  {
    label: "Billing & subscription",
    desc: "Your plan, invoices, and payment method.",
    icon: CreditCard,
    iconColor: "text-accent-green",
  },
  {
    label: "Team & permissions",
    desc: "Invite team members and manage roles.",
    icon: Users,
    iconColor: "text-accent-purple",
  },
  {
    label: "Connected accounts",
    desc: "Bank feeds, integrations, and APIs.",
    icon: Link,
    iconColor: "text-accent-teal",
  },
  {
    label: "Notifications",
    desc: "Email, push, and in-app alert preferences.",
    icon: Bell,
    iconColor: "text-accent-orange",
  },
  {
    label: "Security",
    desc: "Two-factor auth, sessions, and login history.",
    icon: Lock,
    iconColor: "text-accent-yellow",
  },
  {
    label: "Data & export",
    desc: "Download reports, backups, and audit logs.",
    icon: Database,
    iconColor: "text-text-secondary",
  },
];

export default function SettingsView() {
  const router = useRouter();

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <Logo size="sm" />
        <span className="text-xs text-text-secondary border border-border-secondary rounded-full px-3 py-1">
          Settings
        </span>
      </div>

      <div className="animate-fade-in-up delay-1">
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-text-secondary text-sm mb-6">
          Manage your account, team, and preferences.
        </p>
      </div>

      <Card className="!p-0 overflow-hidden animate-fade-in-up delay-2">
        <div className="divide-y divide-border-primary">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 py-4 px-4 text-left hover:bg-bg-card-hover transition-colors focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-inset outline-none"
              >
                <div
                  className={`w-8 h-8 rounded-lg bg-bg-input/80 flex items-center justify-center flex-shrink-0 ${item.iconColor}`}
                >
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-text-muted flex-shrink-0"
                />
              </button>
            );
          })}
        </div>
      </Card>

      <div className="mt-8 text-center animate-fade-in-up delay-3">
        <button
          onClick={() => { clearAuth(); router.push("/"); }}
          className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
        >
          <LogOut size={14} />
          Sign out
        </button>
        <p className="text-xs text-text-muted mt-4">myCPA Dashboard v1.0.0</p>
      </div>
    </div>
  );
}

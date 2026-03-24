import { ScrollView, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../components/Logo";
import Card from "../components/Card";
import { useAuth } from "../contexts/AuthContext";
import { clearAuth } from "../lib/auth";
import { colors } from "../lib/theme";
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
} from "lucide-react-native";

const settingsItems = [
  { label: "Profile & account", desc: "Name, email, password, and preferences.", icon: User, iconColor: colors.accentBlue },
  { label: "Billing & subscription", desc: "Your plan, invoices, and payment method.", icon: CreditCard, iconColor: colors.accentGreen },
  { label: "Team & permissions", desc: "Invite team members and manage roles.", icon: Users, iconColor: colors.accentPurple },
  { label: "Connected accounts", desc: "Bank feeds, integrations, and APIs.", icon: Link, iconColor: colors.accentTeal },
  { label: "Notifications", desc: "Email, push, and in-app alert preferences.", icon: Bell, iconColor: colors.accentOrange },
  { label: "Security", desc: "Two-factor auth, sessions, and login history.", icon: Lock, iconColor: colors.accentYellow },
  { label: "Data & export", desc: "Download reports, backups, and audit logs.", icon: Database, iconColor: colors.textSecondary },
];

export default function SettingsScreen() {
  const { setAuthed } = useAuth();

  const handleSignOut = async () => {
    await clearAuth();
    setAuthed(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-primary" edges={["top"]}>
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Logo size="sm" />
          <View className="border border-border-secondary rounded-full px-3 py-1">
            <Text className="text-xs text-text-secondary">Settings</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-2xl font-bold text-text-primary mb-1">Settings</Text>
          <Text className="text-text-secondary text-sm">
            Manage your account, team, and preferences.
          </Text>
        </View>

        <Card className="!p-0 overflow-hidden">
          {settingsItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <Pressable
                key={item.label}
                className={`flex-row items-center gap-3 py-4 px-4 ${i > 0 ? "border-t border-border-primary" : ""}`}
              >
                <View className="w-8 h-8 rounded-lg bg-bg-input/80 items-center justify-center">
                  <Icon size={16} color={item.iconColor} />
                </View>
                <View className="flex-1">
                  <Text className="font-medium text-sm text-text-primary">{item.label}</Text>
                  <Text className="text-xs text-text-muted mt-0.5">{item.desc}</Text>
                </View>
                <ChevronRight size={16} color={colors.textMuted} />
              </Pressable>
            );
          })}
        </Card>

        <View className="mt-8 items-center">
          <Pressable onPress={handleSignOut} className="flex-row items-center gap-2">
            <LogOut size={14} color="#f87171" />
            <Text className="text-sm text-red-400 font-medium">Sign out</Text>
          </Pressable>
          <Text className="text-xs text-text-muted mt-4">myCPA Dashboard v1.0.0</Text>
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}

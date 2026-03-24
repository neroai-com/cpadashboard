import { useState, useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Logo from "../components/Logo";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import Pill from "../components/Pill";
import ToggleSwitch from "../components/ToggleSwitch";
import { colors } from "../lib/theme";
import { chartOfAccountsData } from "../lib/data";
import { RootStackParamList } from "../navigation/types";
import {
  ArrowLeft,
  Link2,
  Calculator,
  BookOpen,
  CheckCircle2,
  Check,
  Plus,
  Upload,
  PenLine,
  Landmark,
  Search,
} from "lucide-react-native";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const stepsMeta = [
  { label: "Connect", Icon: Link2 },
  { label: "Accounting", Icon: Calculator },
  { label: "Chart", Icon: BookOpen },
  { label: "Review", Icon: CheckCircle2 },
];

const connectionOptions = [
  {
    id: "bank",
    title: "Connect bank accounts",
    desc: "Securely link your bank and credit card accounts for automatic transaction feeds.",
    Icon: Landmark,
  },
  {
    id: "csv",
    title: "Import from CSV",
    desc: "Upload transaction data from spreadsheets or exported bank files.",
    Icon: Upload,
  },
  {
    id: "manual",
    title: "Manual entry",
    desc: "Enter transactions and balances by hand. Best for simple setups.",
    Icon: PenLine,
  },
];

const entityTypes = ["LLC", "S-Corp", "C-Corp", "Sole Proprietor", "Partnership"];

const coreSpaceOptions = [
  "Books health",
  "Uncoded transactions",
  "Accruals & schedules",
  "Journal entries",
];

export default function SetupScreen() {
  const navigation = useNavigation<Nav>();

  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const progressPercent = (step / totalSteps) * 100;

  // Step 1
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);

  // Step 2
  const [accountingMethod, setAccountingMethod] = useState("Accrual");
  const [fiscalYear, setFiscalYear] = useState("Calendar (Jan - Dec)");
  const [entityType, setEntityType] = useState("LLC");
  const [coreSpaces, setCoreSpaces] = useState<Record<string, boolean>>({
    "Books health": true,
    "Uncoded transactions": false,
    "Accruals & schedules": false,
    "Journal entries": false,
  });

  // Step 3
  const [coaSearches, setCoaSearches] = useState<Record<string, string>>({});

  function next() {
    if (step < totalSteps) setStep(step + 1);
    else navigation.goBack();
  }

  function back() {
    if (step > 1) setStep(step - 1);
    else navigation.goBack();
  }

  function toggleCoreSpace(key: string) {
    setCoreSpaces((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  /* ───── Step renderers ───── */

  function renderStep1() {
    return (
      <View>
        <Text className="text-2xl font-bold text-text-primary mb-2">
          Welcome to Setup
        </Text>
        <Text className="text-text-secondary text-sm mb-6">
          Let's get your accounts connected and your books configured. Choose how
          you'd like to bring in your financial data.
        </Text>

        <View className="gap-3">
          {connectionOptions.map((opt) => {
            const isSelected = selectedConnection === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setSelectedConnection(opt.id)}
                className={`p-4 rounded-xl border ${
                  isSelected
                    ? "border-accent-green bg-accent-green/5"
                    : "border-border-primary bg-bg-card"
                }`}
              >
                <View className="flex-row items-start gap-3">
                  <View
                    className={`w-10 h-10 rounded-lg items-center justify-center ${
                      isSelected ? "bg-accent-green/15" : "bg-bg-input"
                    }`}
                  >
                    <opt.Icon
                      size={18}
                      color={isSelected ? colors.accentGreen : colors.textSecondary}
                    />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm font-semibold text-text-primary">
                        {opt.title}
                      </Text>
                      {isSelected && (
                        <View className="w-5 h-5 rounded-full bg-accent-green items-center justify-center">
                          <Check size={12} color="#ffffff" strokeWidth={3} />
                        </View>
                      )}
                    </View>
                    <Text className="text-xs text-text-muted mt-0.5">{opt.desc}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  function renderStep2() {
    return (
      <View>
        <Text className="text-2xl font-bold text-text-primary mb-2">
          Accounting Configuration
        </Text>
        <Text className="text-text-secondary text-sm mb-6">
          Configure your bookkeeping method, fiscal year, and entity details. You
          can adjust these later in Settings.
        </Text>

        <Card>
          {/* Accounting method */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-text-primary mb-2">
              Accounting method
            </Text>
            <View className="flex-row gap-2">
              {["Cash", "Accrual"].map((m) => (
                <Pill
                  key={m}
                  label={m}
                  active={accountingMethod === m}
                  onClick={() => setAccountingMethod(m)}
                />
              ))}
            </View>
            <Text className="text-xs text-text-muted mt-2">
              Accrual is recommended for multi-entity and real estate businesses.
            </Text>
          </View>

          {/* Fiscal year */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-text-primary mb-2">
              Fiscal year
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {["Calendar (Jan - Dec)", "Fiscal (pick month)"].map((f) => (
                <Pill
                  key={f}
                  label={f}
                  active={fiscalYear === f}
                  onClick={() => setFiscalYear(f)}
                />
              ))}
            </View>
          </View>

          {/* Entity type */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-text-primary mb-2">
              Entity type
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {entityTypes.map((t) => (
                <Pill
                  key={t}
                  label={t}
                  active={entityType === t}
                  onClick={() => setEntityType(t)}
                />
              ))}
            </View>
          </View>

          {/* Core Spaces */}
          <View>
            <Text className="text-sm font-medium text-text-primary mb-3">
              Core spaces
            </Text>
            <View className="gap-3">
              {coreSpaceOptions.map((space) => (
                <ToggleSwitch
                  key={space}
                  label={space}
                  checked={coreSpaces[space] ?? false}
                  onChange={() => toggleCoreSpace(space)}
                />
              ))}
            </View>
            <Text className="text-xs text-text-muted mt-3">
              Enable the workspaces you need. These can be changed later.
            </Text>
          </View>
        </Card>
      </View>
    );
  }

  function renderStep3() {
    const categories = Object.keys(chartOfAccountsData);

    return (
      <View>
        <Text className="text-2xl font-bold text-text-primary mb-2">
          Chart of Accounts
        </Text>
        <Text className="text-text-secondary text-sm mb-6">
          We'll start with a standard COA. Search and customize accounts for each
          category.
        </Text>

        <Card>
          <Text className="text-xs text-text-muted mb-4">
            If a desired account isn't listed, tap the plus button to add it.
          </Text>

          <View className="gap-6">
            {categories.map((category) => (
              <COACategory
                key={category}
                category={category}
                accounts={chartOfAccountsData[category]}
                search={coaSearches[category] ?? ""}
                onSearch={(val) =>
                  setCoaSearches((prev) => ({ ...prev, [category]: val }))
                }
              />
            ))}
          </View>
        </Card>
      </View>
    );
  }

  function renderStep4() {
    const enabledSpaces = Object.entries(coreSpaces)
      .filter(([, v]) => v)
      .map(([k]) => k);

    const reviewItems = [
      {
        label: "Connection method",
        value:
          connectionOptions.find((c) => c.id === selectedConnection)?.title ||
          "Not selected",
      },
      { label: "Accounting method", value: accountingMethod },
      { label: "Fiscal year", value: fiscalYear },
      { label: "Entity type", value: entityType },
      {
        label: "Core spaces",
        value: enabledSpaces.length > 0 ? enabledSpaces.join(", ") : "None selected",
      },
      {
        label: "Chart of accounts",
        value: `${Object.keys(chartOfAccountsData).length} categories configured`,
      },
    ];

    return (
      <View>
        <Text className="text-2xl font-bold text-text-primary mb-2">
          Review & Confirm
        </Text>
        <Text className="text-text-secondary text-sm mb-6">
          Everything looks good. You can always change these in Settings.
        </Text>

        <Card>
          {reviewItems.map((item, i) => (
            <View
              key={item.label}
              className={`flex-row items-start justify-between py-3 ${
                i > 0 ? "border-t border-border-primary/50" : ""
              }`}
            >
              <Text className="text-xs text-text-muted flex-shrink-0">{item.label}</Text>
              <Text className="text-sm font-medium text-text-primary text-right flex-1 ml-4">
                {item.value}
              </Text>
            </View>
          ))}
        </Card>

        <View className="mt-4 p-3 rounded-lg bg-accent-green/5 border border-accent-green/20 flex-row items-start gap-2">
          <CheckCircle2 size={16} color={colors.accentGreen} />
          <Text className="text-xs text-text-secondary flex-1">
            All settings can be changed later from the entity's Settings page.
          </Text>
        </View>
      </View>
    );
  }

  const stepRenderers = [renderStep1, renderStep2, renderStep3, renderStep4];

  return (
    <SafeAreaView className="flex-1 bg-bg-primary" edges={["top"]}>
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Pressable
            onPress={() => navigation.goBack()}
            className="flex-row items-center gap-2"
          >
            <ArrowLeft size={20} color={colors.textSecondary} />
            <Logo size="sm" />
          </Pressable>
          <View className="border border-border-secondary rounded-full px-3 py-1">
            <Text className="text-xs text-text-secondary">
              Step {step} of {totalSteps}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <ProgressBar percent={progressPercent} height={3} className="mb-4" />

        {/* Step Indicator */}
        <View className="flex-row items-center justify-center gap-4 mb-6">
          {stepsMeta.map((s, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isComplete = step > stepNum;
            return (
              <View key={s.label} className="items-center gap-1">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    isComplete
                      ? "bg-accent-green"
                      : isActive
                      ? "bg-accent-green/20 border border-accent-green"
                      : "bg-bg-input border border-border-secondary"
                  }`}
                >
                  {isComplete ? (
                    <Check size={14} color="#ffffff" strokeWidth={3} />
                  ) : (
                    <s.Icon
                      size={14}
                      color={isActive ? colors.accentGreen : colors.textMuted}
                    />
                  )}
                </View>
                <Text
                  className={`text-[9px] font-medium ${
                    isActive || isComplete ? "text-text-secondary" : "text-text-muted"
                  }`}
                >
                  {s.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Step Content */}
        {stepRenderers[step - 1]()}

        {/* Navigation Buttons */}
        <View className="mt-8 gap-3">
          <Pressable
            onPress={next}
            className="w-full py-3.5 rounded-lg bg-accent-green items-center"
          >
            <Text className="text-white font-semibold text-sm">
              {step === totalSteps ? "Finish Setup" : "Continue"}
            </Text>
          </Pressable>
          <Pressable
            onPress={back}
            className="w-full py-3.5 rounded-lg border border-border-secondary items-center flex-row justify-center gap-2"
          >
            <ArrowLeft size={14} color={colors.textSecondary} />
            <Text className="text-text-secondary font-semibold text-sm">Back</Text>
          </Pressable>
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ───── Chart of Accounts sub-components ───── */

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
        ? accounts.filter((a) => a.toLowerCase().includes(search.toLowerCase()))
        : accounts,
    [accounts, search]
  );

  return (
    <View>
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-medium text-text-secondary">{category}</Text>
        <Pressable className="w-8 h-8 rounded-full bg-accent-green items-center justify-center">
          <Plus size={14} color="#ffffff" strokeWidth={3} />
        </Pressable>
      </View>

      <View className="flex-row items-center bg-bg-input border border-border-secondary rounded-lg px-3 py-2 mb-2">
        <Search size={14} color={colors.textMuted} />
        <TextInput
          value={search}
          onChangeText={onSearch}
          placeholder="Search accounts..."
          placeholderTextColor={colors.textMuted}
          className="flex-1 text-sm text-text-primary ml-2"
        />
      </View>

      <View className="max-h-48">
        {filtered.map((account) => (
          <View
            key={account}
            className="py-2 px-1 border-b border-border-primary/50"
          >
            <Text className="text-sm text-text-primary">{account}</Text>
          </View>
        ))}
        {filtered.length === 0 && (
          <Text className="text-xs text-text-muted py-2">No accounts found.</Text>
        )}
      </View>
    </View>
  );
}

import { ScrollView, View, Text, Pressable } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../components/Logo";
import Card from "../components/Card";
import { entities, businessServices, entityInsights } from "../lib/data";
import { colors } from "../lib/theme";
import { RootStackParamList } from "../navigation/types";
import {
  Receipt, FileText, Calculator, Users, Landmark, Shield,
  Building, HandCoins, FolderOpen, Brain, Settings,
  Sparkles, ArrowLeft, AlertTriangle,
} from "lucide-react-native";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const serviceIcons: Record<string, any> = {
  ap: Receipt, ar: FileText, accounting: Calculator, payroll: Users,
  banking: Landmark, insurance: Shield, "property-tax": Building,
  loans: HandCoins, documents: FolderOpen, cfo: Brain, settings: Settings,
};

export default function EntityDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<any>();
  const { id } = route.params;
  const entity = entities.find((e) => e.id === id);

  if (!entity) {
    return (
      <SafeAreaView className="flex-1 bg-bg-primary items-center justify-center px-6">
        <Text className="text-xl font-bold text-text-primary mb-2">Entity not found</Text>
        <Text className="text-sm text-text-secondary mb-6">The entity doesn't exist or has been removed.</Text>
        <Pressable onPress={() => navigation.goBack()} className="px-6 py-3 rounded-lg bg-accent-green">
          <Text className="text-white font-semibold text-sm">Back to Dashboard</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg-primary" edges={["top"]}>
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => navigation.goBack()} className="flex-row items-center gap-2">
            <ArrowLeft size={20} color={colors.textSecondary} />
            <Logo size="sm" />
          </Pressable>
          <View className="border border-border-secondary rounded-full px-3 py-1">
            <Text className="text-xs text-text-secondary">{entity.name}</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-2xl font-bold text-text-primary mb-1">Business services.</Text>
          <Text className="text-text-secondary text-sm">
            Choose what you want to work on for this entity.
          </Text>
        </View>

        {/* Services */}
        <Card className="mb-6 !p-0 overflow-hidden">
          <View className="p-4 pb-2">
            <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase mb-1">Services</Text>
            <Text className="text-text-secondary text-xs mb-4">Tap a category to manage it for {entity.name}.</Text>
          </View>
          {businessServices.map((service, i) => {
            const Icon = serviceIcons[service.id];
            const hasAction = service.id === "settings";
            return (
              <Pressable
                key={service.id}
                onPress={hasAction ? () => navigation.navigate("Setup") : undefined}
                className={`flex-row items-center gap-3 py-3.5 px-4 ${i > 0 ? "border-t border-border-primary" : ""}`}
              >
                {Icon && (
                  <View className="w-8 h-8 rounded-lg bg-bg-input/80 items-center justify-center">
                    <Icon size={16} color={colors.textSecondary} />
                  </View>
                )}
                <View className="flex-1 mr-3">
                  <Text className="font-semibold text-sm text-text-primary">{service.name}</Text>
                  <Text className="text-xs text-text-muted mt-0.5">{service.description}</Text>
                </View>
                {service.rightLabel && (
                  <View className="items-end">
                    {service.rightSub ? (
                      <>
                        <View className="px-2 py-0.5 rounded-full bg-accent-green/10">
                          <Text className="text-xs font-medium text-accent-green">{service.rightLabel}</Text>
                        </View>
                        <Text className="text-xs text-text-muted mt-0.5">{service.rightSub}</Text>
                      </>
                    ) : (
                      <Text className="text-sm font-medium text-text-secondary">{service.rightLabel}</Text>
                    )}
                  </View>
                )}
              </Pressable>
            );
          })}
          <Text className="text-xs text-text-muted px-4 py-3">
            You can enable or disable services for this entity from its settings.
          </Text>
        </Card>

        {/* AI CFO */}
        <Card variant="hero" className="mb-6">
          <View className="flex-row items-center gap-2 mb-1">
            <Sparkles size={14} color={colors.accentGreen} />
            <Text className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
              AI CFO · {entity.name}
            </Text>
          </View>
          <Text className="text-text-secondary text-xs mb-4">Entity-specific opportunities and risks.</Text>
          <View className="gap-3">
            {entityInsights.map((insight) => (
              <View key={insight.id} className="flex-row items-start gap-3 p-3 rounded-lg border border-border-primary/50">
                <View className="w-7 h-7 rounded-md bg-bg-input/80 items-center justify-center mt-0.5">
                  <AlertTriangle size={14} color={colors.accentYellow} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-text-primary">{insight.title}</Text>
                  <Text className="text-xs text-text-muted">{insight.description}</Text>
                </View>
              </View>
            ))}
          </View>
          <Pressable className="w-full mt-5 py-3 rounded-lg bg-accent-green items-center">
            <Text className="text-white font-semibold text-sm">Open AI CFO for this business</Text>
          </Pressable>
        </Card>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import { LayoutDashboard, Briefcase, Users, Settings } from "lucide-react-native";
import { colors } from "../lib/theme";
import type { DashboardTabParamList } from "./types";
import CombinedScreen from "../screens/CombinedScreen";
import BusinessScreen from "../screens/BusinessScreen";
import IndividualScreen from "../screens/IndividualScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator<DashboardTabParamList>();

const iconMap = {
  Combined: LayoutDashboard,
  Business: Briefcase,
  Individual: Users,
  Settings: Settings,
};

const labelMap = {
  Combined: "Combined",
  Business: "Business",
  Individual: "Family",
  Settings: "Settings",
};

export default function DashboardTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgPrimary,
          borderTopColor: colors.borderPrimary,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 6,
          paddingTop: 4,
        },
        tabBarActiveTintColor: colors.accentGreen,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
        },
        tabBarIcon: ({ color, size }) => {
          const Icon = iconMap[route.name];
          return <Icon size={20} color={color} strokeWidth={1.8} />;
        },
        tabBarLabel: labelMap[route.name],
        lazy: false,
      })}
    >
      <Tab.Screen name="Combined" component={CombinedScreen} />
      <Tab.Screen name="Business" component={BusinessScreen} />
      <Tab.Screen name="Individual" component={IndividualScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

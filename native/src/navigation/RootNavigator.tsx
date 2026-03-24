import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import type { RootStackParamList } from "./types";
import DashboardTabs from "./DashboardTabs";
import LoginScreen from "../screens/LoginScreen";
import NetWorthScreen from "../screens/NetWorthScreen";
import LiabilitiesScreen from "../screens/LiabilitiesScreen";
import CashFlowScreen from "../screens/CashFlowScreen";
import AssetsScreen from "../screens/AssetsScreen";
import InsuranceScreen from "../screens/InsuranceScreen";
import AIAdvisorScreen from "../screens/AIAdvisorScreen";
import EntityDetailScreen from "../screens/EntityDetailScreen";
import SetupScreen from "../screens/SetupScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { authed } = useAuth();

  if (authed === null) {
    return (
      <View className="flex-1 bg-bg-primary items-center justify-center">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      initialRouteName={authed ? "Dashboard" : "Login"}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={DashboardTabs} />
      <Stack.Screen name="NetWorth" component={NetWorthScreen} />
      <Stack.Screen name="Liabilities" component={LiabilitiesScreen} />
      <Stack.Screen name="CashFlow" component={CashFlowScreen} />
      <Stack.Screen name="Assets" component={AssetsScreen} />
      <Stack.Screen name="Insurance" component={InsuranceScreen} />
      <Stack.Screen name="AIAdvisor" component={AIAdvisorScreen} />
      <Stack.Screen name="EntityDetail" component={EntityDetailScreen} />
      <Stack.Screen name="Setup" component={SetupScreen} />
    </Stack.Navigator>
  );
}

import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../components/Logo";
import { validateCredentials, setAuthenticated } from "../lib/auth";
import { useAuth } from "../contexts/AuthContext";
import { colors } from "../lib/theme";
import { Eye, EyeOff, Fingerprint, ShieldCheck } from "lucide-react-native";

export default function LoginScreen() {
  const { setAuthed } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = email.trim().length > 0 && password.trim().length > 0;

  async function handleLogin() {
    setError("");
    if (!isValid) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      if (validateCredentials(email, password)) {
        await setAuthenticated();
        setAuthed(true);
      } else {
        setLoading(false);
        setError("Invalid email or password. Please try again.");
      }
    }, 600);
  }

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-sm">
          {/* Logo */}
          <View className="items-center mb-10">
            <Logo size="lg" />
          </View>

          <Text className="text-2xl font-bold text-text-primary mb-2">
            Login to your account
          </Text>
          <Text className="text-text-secondary text-sm mb-8">
            One login for your personal, business, and family finances.
          </Text>

          {error !== "" && (
            <View className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <Text className="text-red-400 text-sm">{error}</Text>
            </View>
          )}

          {/* Email */}
          <View className="mb-5">
            <Text className="text-sm text-text-secondary mb-1.5">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg bg-bg-input border border-border-secondary text-text-primary"
            />
          </View>

          {/* Password */}
          <View className="mb-5">
            <Text className="text-sm text-text-secondary mb-1.5">Password</Text>
            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                autoComplete="password"
                className="w-full px-4 py-3 rounded-lg bg-bg-input border border-border-secondary text-text-primary pr-12"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.textMuted} />
                ) : (
                  <Eye size={20} color={colors.textMuted} />
                )}
              </Pressable>
            </View>
            <Pressable onPress={() => Alert.alert("Coming soon", "Password reset flow coming soon.")} className="self-end mt-2">
              <Text className="text-sm text-accent-green">Forgot Password?</Text>
            </Pressable>
          </View>

          {/* Login button */}
          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className={`w-full py-3.5 rounded-lg bg-accent-green items-center justify-center ${loading ? "opacity-60" : ""}`}
          >
            {loading ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator size="small" color="#fff" />
                <Text className="text-white font-semibold">Signing in...</Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-base">Login</Text>
            )}
          </Pressable>

          <Text className="text-center text-sm text-text-secondary mt-6">
            Don't have an account?{" "}
            <Text
              onPress={() => Alert.alert("Coming soon", "Sign up flow coming soon.")}
              className="text-accent-green font-medium"
            >
              Sign Up
            </Text>
          </Text>

          {/* Biometric buttons */}
          <View className="flex-row items-center justify-center gap-6 mt-10">
            <View className="w-12 h-12 rounded-full bg-bg-input border border-border-secondary items-center justify-center">
              <Fingerprint size={22} color={colors.accentGreen} />
            </View>
            <View className="w-12 h-12 rounded-full bg-bg-input border border-border-secondary items-center justify-center">
              <ShieldCheck size={22} color={colors.accentGreen} />
            </View>
          </View>
          <Text className="text-center text-xs text-text-muted mt-2">
            Enable biometric login
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

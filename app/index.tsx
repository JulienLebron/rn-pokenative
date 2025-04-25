import { Link } from "expo-router";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "./components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Card } from "./components/Card";

export default function Index() {
  const colors = useThemeColors();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
      <StatusBar backgroundColor={colors.tint} barStyle="light-content" />
      <Card>
        <ThemedText variant="headline">Pokédex</ThemedText>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 24 },
});

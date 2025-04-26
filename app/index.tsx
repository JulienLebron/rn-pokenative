import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "./components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Card } from "./components/Card";
import { PokemonCard } from "./components/pokemon/PokemonCard";
import { useFetchQuery } from "@/hooks/useFecthQuery";
import { getPokemonId } from "./functions/pokemon";

export default function Index() {
  const colors = useThemeColors();
  const { data } = useFetchQuery("/pokemon?limit=200");
  const pokemons = data?.results ?? [];
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
      <StatusBar backgroundColor={colors.tint} barStyle="light-content" />
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/pokeball.png")}
          width={24}
          height={24}
        />
        <ThemedText variant="headline" color="grayLight">
          Pokédex
        </ThemedText>
      </View>
      <Card style={styles.body}>
        <FlatList
          data={pokemons}
          numColumns={3}
          contentContainerStyle={[styles.gridGap, styles.list]}
          columnWrapperStyle={styles.gridGap}
          renderItem={({ item }) => (
            <PokemonCard
              id={getPokemonId(item.url)}
              name={item.name}
              style={{ flex: 1 / 3 }}
            />
          )}
          keyExtractor={(item) => item.url}
        />
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 4 },
  header: { flexDirection: "row", alignItems: "center", gap: 16, padding: 12 },
  body: { flex: 1 },
  gridGap: {
    gap: 8,
  },
  list: {
    padding: 12,
  },
});

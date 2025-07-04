import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { RootView } from "../components/RootView";
import { Row } from "../components/Row";
import { ThemedText } from "../components/ThemedText";
import { useFetchQuery } from "@/hooks/useFecthQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Colors } from "../constants/Colors";
import {
  basePokemonStats,
  formatSize,
  formatWeight,
  getPokemonArtwork,
} from "../functions/pokemon";
import { Card } from "../components/Card";
import { PokemonType } from "../components/pokemon/PokemonType";
import { PokemonSpec } from "../components/pokemon/PokemonSpec";
import { PokemonStat } from "../components/pokemon/PokemonStat";
import { Audio } from "expo-av";
import PagerView from "react-native-pager-view";
import { useEffect, useRef, useState } from "react";

export default function Pokemon() {
  const [id, setId] = useState(
    parseInt((useLocalSearchParams() as { id: string }).id, 10)
  );
  const pager = useRef<PagerView>(null);
  const offset = useRef(1);
  useEffect(() => {
    pager.current?.setPageWithoutAnimation(1);
  }, [id]);

  const onPageSelected = (e: { nativeEvent: { position: number } }) => {
    if (!e.nativeEvent) {
      return;
    }
    offset.current = e.nativeEvent.position - 1;
  };

  const onPageScrollStateChanged = (e: {
    nativeEvent: { pageScrollState: string };
  }) => {
    if (e.nativeEvent.pageScrollState === "idle" && offset.current !== 0) {
      setId((v) => {
        const o = offset.current;
        offset.current = 0;
        return v + o;
      });
    }
  };

  const onNext = () => {
    pager.current?.setPage(2);
  };

  const onPrevious = () => {
    pager.current?.setPage(0);
  };

  return (
    <PagerView
      ref={pager}
      initialPage={id === 1 ? 0 : 1}
      onPageSelected={onPageSelected}
      onPageScrollStateChanged={onPageScrollStateChanged}
      style={{ flex: 1 }}
    >
      <PokemonView
        key={id - 1}
        id={id - 1}
        onPrevious={onPrevious}
        onNext={onNext}
      />
      <PokemonView key={id} id={id} onPrevious={onPrevious} onNext={onNext} />
      <PokemonView
        key={id + 1}
        id={id + 1}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </PagerView>
  );
}

type Props = {
  id: number;
  onPrevious: () => void;
  onNext: () => void;
};

function PokemonView({ id, onPrevious, onNext }: Props) {
  const colors = useThemeColors();
  const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: id });
  const { data: species } = useFetchQuery("/pokemon-species/[id]", {
    id: id,
  });
  const mainType = pokemon?.types?.[0].type.name;
  const colorType = mainType ? Colors.type[mainType] : colors.tint;
  const types = pokemon?.types ?? [];
  const bio = species?.flavor_text_entries
    ?.find(({ language }) => language.name === "en")
    ?.flavor_text.replaceAll("\n", ". ");
  const stats = pokemon?.stats ?? basePokemonStats;

  const onImagePress = async () => {
    const cry = pokemon?.cries.latest;
    if (!cry) {
      return;
    }
    const { sound } = await Audio.Sound.createAsync(
      {
        uri: cry,
      },
      { shouldPlay: true }
    );
    sound.playAsync();
  };

  const isFirst = id === 1;
  const isLast = id === 151;

  return (
    <RootView backgroundColor={colorType}>
      <View>
        <Image
          source={require("@/assets/images/pokeball_big.png")}
          style={[styles.pokeball, { width: 208, height: 208 }]}
        />
        <Row style={styles.header}>
          <Pressable onPress={router.back}>
            <Row gap={8}>
              <Image
                source={require("@/assets/images/back.png")}
                style={{ width: 24, height: 24 }}
              />
              <ThemedText
                color="grayWhite"
                variant="headline"
                style={{ textTransform: "capitalize" }}
              >
                {pokemon?.name}
              </ThemedText>
            </Row>
          </Pressable>
          <ThemedText color="grayWhite" variant="subtitle2">
            #{id.toString().padStart(3, "0")}
          </ThemedText>
        </Row>
        <Card style={styles.card}>
          <Row style={styles.imageRow}>
            {isFirst ? (
              <View style={{ width: 24, height: 24 }} />
            ) : (
              <Pressable onPress={onPrevious}>
                <Image
                  source={require("@/assets/images/prev.png")}
                  style={{ width: 24, height: 24 }}
                />
              </Pressable>
            )}
            <Pressable onPress={onImagePress}>
              <Image
                source={{
                  uri: getPokemonArtwork(id),
                }}
                style={[styles.artwork, { width: 200, height: 200 }]}
              />
            </Pressable>
            {isLast ? (
              <View style={{ width: 24, height: 24 }} />
            ) : (
              <Pressable onPress={onNext}>
                <Image
                  style={{ width: 24, height: 24 }}
                  source={require("@/assets/images/next.png")}
                />
              </Pressable>
            )}
          </Row>
          <Row gap={16} style={{ height: 20 }}>
            {types.map((type) => (
              <PokemonType name={type.type.name} key={type.type.name} />
            ))}
          </Row>

          {/* About */}
          <ThemedText variant="subtitle1" style={{ color: colorType }}>
            About
          </ThemedText>
          <Row>
            <PokemonSpec
              style={{
                borderStyle: "solid",
                borderRightWidth: 1,
                borderColor: colors.grayLight,
              }}
              title={formatWeight(pokemon?.weight)}
              description="Weight"
              image={require("@/assets/images/weight.png")}
            />
            <PokemonSpec
              style={{
                borderStyle: "solid",
                borderRightWidth: 1,
                borderColor: colors.grayLight,
              }}
              title={formatSize(pokemon?.height)}
              description="Size"
              image={require("@/assets/images/size.png")}
            />
            <PokemonSpec
              title={pokemon?.moves
                .slice(0, 2)
                .map((m) => m.move.name)
                .join("\n")}
              description="Moves"
            />
          </Row>
          <ThemedText>{bio}</ThemedText>

          {/* Base Stats */}
          <ThemedText variant="subtitle1" style={{ color: colorType }}>
            Base Stats
          </ThemedText>
          <View style={{ alignSelf: "stretch" }}>
            {stats.map((stat) => (
              <PokemonStat
                key={stat.stat.name}
                name={stat.stat.name}
                value={stat.base_stat}
                color={colorType}
              />
            ))}
          </View>
        </Card>
      </View>
    </RootView>
  );
}

const styles = StyleSheet.create({
  header: {
    margin: 20,
    justifyContent: "space-between",
  },
  pokeball: {
    opacity: 0.1,
    position: "absolute",
    right: 8,
    top: 8,
  },
  imageRow: {
    position: "absolute",
    top: -140,
    zIndex: 2,
    justifyContent: "space-between",
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  artwork: {},
  card: {
    marginTop: 144,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    gap: 16,
    alignItems: "center",
  },
});

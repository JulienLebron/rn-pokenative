import { Image, StyleSheet, TextInput, View } from "react-native";
import { Row } from "./Row";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = {
  value: string;
  onChange: (s: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  const colors = useThemeColors();
  return (
    <Row
      gap={8}
      style={[styles.wrapper, { backgroundColor: colors.grayWhite }]}
    >
      <Image
        source={require("@/assets/images/search.png")}
        style={{ width: 16, height: 16 }}
      />
      <TextInput style={styles.input} onChangeText={onChange} value={value} />
    </Row>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderRadius: 16,
    height: 32,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 16,
    fontSize: 20,
    lineHeight: 16,
    color: "black",
  },
});

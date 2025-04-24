import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function About() {
    return <View>
        <Text>A propos</Text>
        <Link href="/about">A propos</Link>
    </View>
}
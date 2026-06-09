import React, { useEffect } from "react";
import { Image, StatusBar, Text, View, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useTheme } from "../theme/ThemeProvider";
import { useWebSocketPing } from "../socket/UseWebSocketPing";

import "../../global.css";

import CircleShape from "../components/CircleShape";

const { width, height } = Dimensions.get("window");

type SplashProps = NativeStackNavigationProp<RootStack, "SplashScreen">;

const minimalistPalette = {
  base: "white",

  lightAccent: "#fde2e4",

  text: "#FFFFFF",

  shape: "#e0f7fa",
};

export default function SplashScreen() {
  const navigation = useNavigation<SplashProps>();
  const opacity = useSharedValue(0);

  const scale = useSharedValue(0.7);
  const floatY = useSharedValue(0);

  try {
    useWebSocketPing(60000);
  } catch (err) {
    console.warn("WebSocket ping not initialized yet", err);
  }

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1200 });
    scale.value = withTiming(1, { duration: 1200 });

    floatY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 3000 }),
        withTiming(12, { duration: 3000 })
      ),
      -1,
      true
    );

    const timeout = setTimeout(() => {
      // navigation.replace("SignInScreen");
    }, 3500);

    return () => clearTimeout(timeout);
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: floatY.value }],
  }));

  const themeContext = useTheme();

  const applied = themeContext?.applied || "light";

  const logo =
    applied === "dark"
      ? require("../../assets/logoDark.png")
      : require("../../assets/logo.png");

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{
        backgroundColor: minimalistPalette.base,
      }}
    >
      <StatusBar hidden={true} />

      <View className="absolute w-full h-full overflow-hidden">
        <CircleShape
          width={400}
          height={400}
          fillColor={minimalistPalette.lightAccent}
          borderRadius={999}
          topValue={height - 250}
          leftValue={-150}
        />

        <CircleShape
          width={300}
          height={300}
          fillColor={minimalistPalette.shape}
          borderRadius={999}
          topValue={-120}
          leftValue={width - 200}
        />

        <View
          className="absolute w-full h-full"
          style={{
            backgroundColor: minimalistPalette.base,
            opacity: 0.2,
          }}
        />
      </View>

      <Animated.View style={animatedLogoStyle}>
        <Image
          source={logo}
          style={{
            height: 200,
            width: 240,
            resizeMode: "contain",

            shadowColor: minimalistPalette.text,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
          }}
        />
      </Animated.View>

      <View
        style={{ 
          position: "absolute", 
          bottom: 40, 
          alignItems: "center",
        }}
      >
        <View className="items-center"> 
          <Text
            style={{ color: minimalistPalette.text }}
            className="text-xs font-semibold" 
          >
            POWERED BY: {process.env.EXPO_PUBLIC_APP_OWNER || "IMAGINE APPS"}
          </Text>
          <Text
            style={{ color: minimalistPalette.text }}
            className="text-xs font-semibold mt-1" 
          >
            VERSION: {process.env.EXPO_PUBLIC_APP_VERSION || "1.0.0"}
          </Text>
        </View>
      </View>
    </View>
  );
}

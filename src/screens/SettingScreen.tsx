import { StatusBar, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeOption, useTheme } from "../theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { useContext, useLayoutEffect, useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { AuthContext } from "../components/AuthProvider";
import { useUserProfile } from "../socket/UseUserProfile";

const options: ThemeOption[] = ["light", "dark", "system"];
type SettingScreenProps = NativeStackNavigationProp<RootStack, "SettingScreen">;

export default function SettingScreen() {
  const auth = useContext(AuthContext);
  const { preference, applied, setPreference } = useTheme();
  const navigation = useNavigation<SettingScreenProps>();
  const userProfile = useUserProfile();

  const [image, setImage] = useState<string>(
    "https://cdn-icons-png.flaticon.com/512/149/149071.png" 
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Settings",
      headerStyle: {
        backgroundColor: applied === "dark" ? "black" : "white",
      },
      headerTintColor: applied === "dark" ? "white" : "black",
    });
  }, [navigation, applied]);

  useEffect(() => {
    if (userProfile?.profileImage && userProfile.profileImage !== "") {
      setImage(userProfile.profileImage);
    } else {
      setImage("https://cdn-icons-png.flaticon.com/512/149/149071.png");
    }
  }, [userProfile]);

  return (
    <SafeAreaView
      className={`flex-1 ${
        applied === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle={applied === "dark" ? "light-content" : "dark-content"}
      />


      <View className="items-center mt-8 mb-6">
        <Image
          source={{ uri: image }}
          className="w-24 h-24 rounded-full mb-3 border-2 border-green-500"
        />

        <Text
          className={`text-xl font-semibold ${
            applied === "dark" ? "text-slate-100" : "text-slate-900"
          }`}
        >
          {userProfile?.firstName
            ? `${userProfile.firstName} ${userProfile.lastName ?? ""}`
            : "Loading..."}
        </Text>

      
      </View>

 
      <View className="px-5 mt-5 mb-3">
        <Text
          className={`font-bold text-lg mb-2 ${
            applied === "dark" ? "text-slate-100" : "text-slate-900"
          }`}
        >
          Choose App Theme
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-3 px-5">
        {options.map((option) => {
          const isSelected = preference === option;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => setPreference(option)}
              className={`py-3 px-6 rounded-2xl border ${
                isSelected
                  ? "bg-green-600 border-green-700"
                  : applied === "dark"
                  ? "bg-gray-800 border-gray-600"
                  : "bg-white border-gray-300"
              } shadow-sm`}
            >
              <Text
                className={`text-center font-bold ${
                  isSelected
                    ? "text-white"
                    : applied === "dark"
                    ? "text-slate-100"
                    : "text-slate-900"
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>


      <View className="mt-auto mb-5 items-center">
        <Text
          className={`text-xs ${
            applied === "dark" ? "text-slate-500" : "text-slate-500"
          }`}
        >
          App Version 1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
}

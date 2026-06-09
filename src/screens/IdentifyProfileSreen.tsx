import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { AuthContext } from "../components/AuthProvider";

type IdentifyProps = NativeStackScreenProps<RootStack, "IdentifyScreen">;

export default function IdentifyScreenProfile({ route }: IdentifyProps) {
  const { mobile, callingCode } = route.params;
  const auth = useContext(AuthContext);

  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_APP_URL}/TalkUp/IdentifyProfile?mobile=${mobile}`
        );

        if (!response.ok) throw new Error("Network response was not ok");

        const json = await response.json();

        if (json.status && json.user) {
          setUserName(json.user.name);
          setProfileImage(json.user.profileImage || null);
          setUserId(json.user.id);
        } else {
          Toast.show({
            type: ALERT_TYPE.WARNING,
            title: "Warning",
            textBody: json.message || "User not found.",
          });
        }
      } catch (error) {
        console.error(error);
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Failed to load user data. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [mobile]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#e6f4ea]">
        <ActivityIndicator size="large" color="#34D399" />
        <Text className="mt-2 text-gray-700">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#e6f4ea] justify-center items-center px-6">
      <View className="bg-white w-full rounded-3xl p-6 items-center shadow-md relative">
      
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("../../assets/Avatar/avatar_5.png")
          }
          className="w-28 h-28 rounded-full mb-4"
          resizeMode="cover"
        />

     
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          {userName || "Unknown User"}
        </Text>

      
        <Text className="text-gray-600 mb-2 text-center">
          +{callingCode} {mobile}
        </Text>

        <Text className="text-gray-600 mb-6 text-center">Yes, it’s me</Text>

        <TouchableOpacity
          className="bg-green-500 rounded-2xl py-3 px-16 active:opacity-80"
          onPress={async () => {
            if (userId) {
              await auth?.signUp(userId.toString());
             
            }
          }}
        >
          <Text className="text-white font-semibold text-lg text-center">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

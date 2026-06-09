import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStack } from "../../App";

type SignInProps = NativeStackNavigationProp<RootStack, "SignInScreen">;

export default function SignInScreen() {
  const navigation = useNavigation<SignInProps>();
  const [mobileNumber, setMobileNumber] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [show, setShow] = useState<boolean>(false);
  const [callingCode, setCallingCode] = useState("94");
  const [country, setCountry] = useState<Country | null>(null);

 
  const getMobileNumber = async () => {
    if (!mobileNumber) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: "Enter Mobile Number First",
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_APP_URL}/TalkUp/IdentifyProfile?mobile=${mobileNumber}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Response from backend:", data);

      if (data.status === true) {
     
        navigation.navigate("IdentifyScreen", {
          mobile: mobileNumber,
          callingCode: callingCode,
        });
     
      } else {
      
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "User Not Found",
          textBody: "Invalid mobile number. Please try again.",
        });
        return;
      }
    } catch (error) {
     
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Network Error",
        textBody: "Something went wrong. Please try again later.",
      });
      return;
    }
  };

  return (
    <LinearGradient
      colors={["#fefefe", "#f8f9fa", "#eaeaea"]}
      className="flex-1 justify-center items-center px-6 mb-11 relative"
    >
      <SafeAreaView className="w-full relative">
      
        <View className="absolute -top-36 -left-10 w-36 h-36 bg-green-200 rounded-full opacity-40" />
        <View className="absolute -top-20 right-0 w-24 h-24 bg-green-100 rounded-full opacity-50" />
        <View className="absolute -bottom-16 -right-12 w-40 h-40 bg-green-300 rounded-full opacity-30" />
        <View className="absolute bottom-10 left-0 w-28 h-28 bg-green-200 rounded-full opacity-35" />

        
        <Image
          source={require("../../assets/logo.png")}
          className="w-32 h-32 self-center mb-3 z-10"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-gray-900 text-center mb-1 z-10">
          Welcome Back
        </Text>
        <Text className="text-gray-500 mb-8 text-center z-10">
          Sign in to continue to TalkUp
        </Text>

  
        <View className="bg-white w-full rounded-3xl p-6 shadow-md border border-gray-100 relative z-10">
          <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3 mb-6">
           
            <TouchableOpacity onPress={() => setShow(true)}>
              <CountryPicker
                countryCode={countryCode}
                withFilter
                withFlag
                withCallingCode
                visible={show}
                onClose={() => setShow(false)}
                onSelect={(c) => {
                  setCountryCode(c.cca2);
                  setCallingCode(c.callingCode[0]);
                  setCountry(c);
                  setShow(false);
                }}
              />
            </TouchableOpacity>

            <Text className="text-gray-800 mx-2">+{callingCode}</Text>

            <TextInput
              placeholder="Enter mobile number"
              placeholderTextColor="#555"
              keyboardType="phone-pad"
              className="text-gray-900 flex-1"
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />
          </View>

         
          <TouchableOpacity
            className="bg-green-500 rounded-2xl py-3 active:opacity-80"
            onPress={getMobileNumber}
          >
            <Text className="text-center text-white font-semibold text-lg">
              Continue
            </Text>
          </TouchableOpacity>
        </View>

      
        <Text className="text-gray-500 text-sm text-center mt-10 z-10 relative">
          By continuing, you agree to our{" "}
          <Text className="text-blue-500">Terms & Privacy Policy</Text>
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

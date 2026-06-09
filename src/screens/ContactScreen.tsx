import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  View,
  Image,
  Text,
  Pressable,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/userContext";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { validateCountryCode, validatePhoneNo } from "../util/validation";

const { width, height } = Dimensions.get("window");

type ContactProps = NativeStackNavigationProp<RootStack, "ContactScreen">;

export default function ContactScreen() {
  const navigation = useNavigation<ContactProps>();
  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [show, setShow] = useState<boolean>(false);
  const { setUserData } = useUserRegistration();
  const [callingCode, setCallingCode] = useState("+94");
  const [phoneNo, setPhoneNo] = useState("");
  const [country, setCountry] = useState<Country | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View
        style={{
          position: "absolute",
          width,
          height,
        }}
      >
        <View
          style={{
            position: "absolute",
            width: 250,
            height: 250,
            backgroundColor: "#FDE2E4",
            borderRadius: 125,
            top: -80,
            left: -50,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            backgroundColor: "#E0F7FA",
            borderRadius: 100,
            top: height * 0.3,
            right: -70,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 150,
            height: 150,
            backgroundColor: "#FFF4E1",
            borderRadius: 75,
            bottom: -50,
            left: -40,
          }}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "android" ? 100 : 100}
        className="flex-1 w-full items-center justify-center"
      >

        <View className="items-center mt-6">
          <Image
            source={require("../../assets/logo.png")}
            style={{ height: 90, width: 90 }}
            resizeMode="contain"
          />
          <Text
            className="text-2xl font-extrabold text-gray-700 mt-4"
            style={{ letterSpacing: 1 }}
          >
            Welcome!
          </Text>
          <Text className="text-gray-500 text-sm mt-2 text-center px-10">
            Enter your phone number to connect with your friends on our app.
          </Text>
        </View>

      
        <View
          style={{
            backgroundColor: "#fff",
            width: "90%",
            marginTop: 40,
            borderRadius: 25,
            paddingVertical: 30,
            paddingHorizontal: 25,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 12,
            elevation: 5,
          }}
        >
        
          <Text className="text-gray-700 text-sm font-semibold mb-2">
            Select Your Country
          </Text>
          <View
            className="flex-row items-center px-3 py-3 mb-4"
            style={{
              borderWidth: 1,
              borderColor: "#E0E0E0",
              borderRadius: 15,
              backgroundColor: "#F9FAFB",
            }}
          >
            <CountryPicker
              countryCode={countryCode}
              withFilter
              withFlag
              withCountryNameButton
              withCallingCode
              visible={show}
              onClose={() => setShow(false)}
              onSelect={(c) => {
                setCountryCode(c.cca2);
                setCountry(c);
                setShow(false);
              }}
            />
            <AntDesign name="caret-down" size={16} color="#777" />
          </View>

   
          <Text className="text-gray-700 text-sm font-semibold mb-2">
            Phone Number
          </Text>
          <View
            className="flex-row items-center px-3 py-3"
            style={{
              borderWidth: 1,
              borderColor: "#E0E0E0",
              borderRadius: 15,
              backgroundColor: "#F9FAFB",
            }}
          >
            <TextInput
              inputMode="tel"
              className="font-bold text-lg text-gray-700 w-[25%]"
              editable={false}
              value={country ? `+${country.callingCode}` : callingCode}
            />
            <TextInput
              inputMode="tel"
              className="font-bold text-lg text-gray-700 w-[70%]"
              placeholder="77 #### ###"
              placeholderTextColor="#A0A0A0"
              onChangeText={setPhoneNo}
            />
          </View>
        </View>


        <View className="w-full mt-10 px-10">
          <Pressable
            className="py-4 rounded-full"
            style={{
              backgroundColor: "#34D399",
              shadowColor: "#34D399",
              shadowOpacity: 0.35,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 10,
            }}
            onPress={() => {
              const validCountryCode = validateCountryCode(callingCode);
              const validPhoneNo = validatePhoneNo(phoneNo);

              if (validCountryCode) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: validCountryCode,
                });
              } else if (validPhoneNo) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: validPhoneNo,
                });
              } else {
                setUserData((previous) => ({
                  ...previous,
                  countryCode: country
                    ? `+${country.callingCode}`
                    : callingCode,
                  contactNo: phoneNo,
                }));
                navigation.replace("AvatarScreen");
              }
            }}
          >
            <Text className="text-center text-white font-bold text-lg tracking-wide">
              Continue
            </Text>
          </Pressable>
        </View>

        <View className="absolute bottom-8 items-center">
          <Text className="text-gray-400 text-xs">
            Your number is safe and secure 
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

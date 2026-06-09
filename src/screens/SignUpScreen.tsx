import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { useTheme } from "../theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/userContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { ValidateFirstName, validateLastName } from "../util/validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

type SignUpProps = NativeStackNavigationProp<RootStack, "SignUpScreen">;
const { width, height } = Dimensions.get("window");

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpProps>();
  const { applied } = useTheme();
  const logo =
    applied === "dark"
      ? require("../../assets/logo.png")
      : require("../../assets/logo.png");

  const { userData, setUserData } = useUserRegistration();

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "android" ? 100 : 100}
      style={{
        flex: 1,
        backgroundColor: applied === "dark" ? "#0F172A" : "#FDFDFD",
      }}
    >
      <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
        <StatusBar hidden={true} />

    
        <View
          style={{
            position: "absolute",
            width,
            height,
            backgroundColor: "transparent",
          }}
        >
          <View
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: applied === "dark" ? "#22C55E30" : "#e0f7fa",
              position: "absolute",
              top: -50,
              left: -50,
            }}
          />
          <View
            style={{
              width: 180,
              height: 180,
              borderRadius: 90,
              backgroundColor: applied === "dark" ? "#FBBF240A" : "#FACC1502",
              position: "absolute",
              bottom: -60,
              right: -40,
            }}
          />
        </View>
            <View
          style={{
            position: "absolute",
            width,
            height,
            backgroundColor: "transparent",
          }}
        >
          <View
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: applied === "dark" ? "#22C55E30" : "#10B98120",
              position: "absolute",
              top: 610,
              left: 180,
            }}
          />
          <View
            style={{
              width: 180,
              height: 180,
              borderRadius: 90,
              backgroundColor: applied === "dark" ? "#FBBF240A" : "#FACC1502",
              position: "absolute",
              bottom: -60,
              right: -40,
            }}
          />
        </View>

        <View style={{ alignItems: "center", marginTop: 60 }}>
          <Image source={logo} style={{ width: 120, height: 150 }} resizeMode="contain" />
          <Text
            style={{
              marginTop: 20,
              fontSize: 22,
              fontWeight: "bold",
              color: applied === "dark" ? "#F1F5F9" : "#1F2937",
              textAlign: "center",
            }}
          >
            Create Your Account
          </Text>
          <Text
            style={{
              marginTop: 8,
              fontSize: 14,
              textAlign: "center",
              color: applied === "dark" ? "#CBD5E1" : "#4B5563",
              paddingHorizontal: 20,
            }}
          >
            Start chatting with your friends today. It's quick and easy!
          </Text>
        </View>

       
        <View
          style={{
            backgroundColor: applied === "dark" ? "#1E293B" : "#FFFFFF",
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
          <FloatingLabelInput
            value={userData.firstName}
            onChangeText={(text) =>
              setUserData((prev) => ({ ...prev, firstName: text }))
            }
            label="First Name"
            containerStyles={{
              borderWidth: 1,
              borderColor: applied === "dark" ? "#334155" : "#E5E7EB",
              borderRadius: 15,
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginBottom: 20,
              backgroundColor: applied === "dark" ? "#0F172A" : "#F9FAFB",
            }}
            inputStyles={{
              color: applied === "dark" ? "#F1F5F9" : "#1F2937",
              fontSize: 16,
              fontWeight: "600",
            }}
            labelStyles={{
              color: applied === "dark" ? "#CBD5E1" : "#6B7280",
            }}
          />

          <FloatingLabelInput
            value={userData.lastName}
            onChangeText={(text) =>
              setUserData((prev) => ({ ...prev, lastName: text }))
            }
            label="Last Name"
            containerStyles={{
              borderWidth: 1,
              borderColor: applied === "dark" ? "#334155" : "#E5E7EB",
              borderRadius: 15,
              paddingHorizontal: 10,
              paddingVertical: 5,
              backgroundColor: applied === "dark" ? "#0F172A" : "#F9FAFB",
            }}
            inputStyles={{
              color: applied === "dark" ? "#F1F5F9" : "#1F2937",
              fontSize: 16,
              fontWeight: "600",
            }}
            labelStyles={{
              color: applied === "dark" ? "#CBD5E1" : "#6B7280",
            }}
          />
        </View>

       
        <View style={{ width: "90%", marginTop: 30 }}>
          <Pressable
            style={{
              backgroundColor: applied === "dark" ? "#22C55E" : "#10B981",
              paddingVertical: 16,
              borderRadius: 25,
              shadowColor: applied === "dark" ? "#22C55E" : "#10B981",
              shadowOpacity: 0.35,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 10,
            }}
            onPress={() => {
              const validFirstname = ValidateFirstName(userData.firstName);
              const validLastName = validateLastName(userData.lastName);

              if (validFirstname) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: validFirstname,
                });
              } else if (validLastName) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: validLastName,
                });
              } else {
                navigation.replace("ContactScreen");
              }
            }}
          >
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              Next
            </Text>
          </Pressable>
        </View>

              <View className="absolute bottom-12 text-gray-400 text-center w-full justify-center items-center">
                <Pressable onPress={()=>{
                  navigation.replace("SignInScreen");
                }}>
                  <Text >Already Registered?</Text>
                </Pressable>
              </View>
     
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

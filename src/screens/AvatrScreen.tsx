import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useUserRegistration } from "../components/userContext";
import { validateProfileImage } from "../util/validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { createNewAccount } from "../api/UserService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/AuthProvider";

type AvatarScreenProps = NativeStackNavigationProp<RootStack, "AvatarScreen">;
const { width, height } = Dimensions.get("window");

export default function AvatarScreen() {
  const navigation = useNavigation<AvatarScreenProps>();
  const [loading, setLoading] = useState(false);
  const { userData, setUserData } = useUserRegistration();
  const [image, setImage] = useState<string | null>(null);
  const auth = useContext(AuthContext);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUserData((prev) => ({ ...prev, profileImage: result.assets[0].uri }));
    }
  };

  const avatars = [
    require("../../assets/Avatar/avatar_1.png"),
    require("../../assets/Avatar/avatar_2.png"),
    require("../../assets/Avatar/avatar_3.png"),
    require("../../assets/Avatar/avatar_4.png"),
    require("../../assets/Avatar/avatar_5.png"),
    require("../../assets/Avatar/avatar_6.png"),
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50 relative">
      <StatusBar hidden />

   
      <View className="rounded-full absolute -top-24 -left-24 w-64 h-64 bg-blue-200  opacity-30" />
      <View className="absolute top-24 -right-24 w-52 h-52 bg-pink-200 rounded-full opacity-25" />
      <View className="absolute -bottom-28 -right-10 w-72 h-72 bg-yellow-200 rounded-full opacity-20" />
      <View className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-50 rounded-full opacity-20" />

     
      <View className="items-center mt-32 px-4 z-10">
      
        <Text className="text-2xl font-bold text-slate-800 mt-4 text-center">
          Choose Your Avatar
        </Text>
        <Text className="text-slate-500 text-center mt-2 text-sm px-4">
          Select a profile picture or choose an avatar to get started.
        </Text>
      </View>

    
      <View className="bg-white w-11/12 mx-auto rounded-3xl mt-20 p-6 shadow-lg items-center z-10">
        <Pressable
          onPress={pickImage}
          className="h-32 w-32 rounded-full border-2 border-dashed border-gray-300 bg-gray-100 justify-center items-center"
        >
          {image ? (
            <Image
              source={{ uri: image }}
              className="h-32 w-32 rounded-full"
            />
          ) : (
            <View className="items-center">
              <Text className="text-4xl font-bold text-gray-400">+</Text>
              <Text className="text-gray-400 font-semibold mt-1 text-base">
                Add Image
              </Text>
            </View>
          )}
        </Pressable>

        <Text className="text-lg font-bold mt-6 text-slate-700">
          Or pick an avatar
        </Text>

        <FlatList
          data={avatars}
          horizontal
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => {
            const uri = Image.resolveAssetSource(item).uri;
            const isSelected = image === uri;
            return (
              <TouchableOpacity
                onPress={() => {
                  setImage(uri);
                  setUserData((prev) => ({ ...prev, profileImage: uri }));
                }}
                className={`mx-2 border-2 p-1 rounded-full ${
                  isSelected ? "border-green-500" : "border-gray-200"
                }`}
              >
                <Image
                  source={item}
                  className="h-20 w-20 rounded-full"
                />
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        />
      </View>


      <View className="w-11/12 mx-auto mt-8 z-10">
        <Pressable
          onPress={async () => {
            const validProfile = validateProfileImage(
              userData.profileImage
                ? { uri: userData.profileImage, type: "", fileSize: 0 }
                : null
            );
            if (validProfile) {
              Toast.show({
                type: ALERT_TYPE.WARNING,
                title: "Warning",
                textBody: "Select a profile image or an avatar",
              });
              return;
            }
            setLoading(true);
            try {
              const response = await createNewAccount(userData);
              if (response.status && auth) {
                await auth.signUp(String(response.userId));
              } else {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: response.message,
                });
              }
            } catch (error) {
              console.log(error);
            } finally {
              setLoading(false);
            }
          }}
          className="bg-green-500 py-4 rounded-2xl items-center shadow-md"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">Create Account</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

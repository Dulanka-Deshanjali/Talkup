import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useContext, useLayoutEffect, useState } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUserProfile } from "../socket/UseUserProfile";
import { uploadProfileImage } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";


type ProfileScreenProps = NativeStackNavigationProp<RootStack, "ProfileScreen">;

export default function ProfileScreen() {
  const auth = useContext(AuthContext);
  const { preference, applied } = useTheme();
  const [image, setImage] = useState<string | null>(null);
  
  const userProfile = useUserProfile();



  const navigation = useNavigation<ProfileScreenProps>();
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      
       uploadProfileImage(String(auth?auth.userId:0),result.assets[0].uri);
      

      
      
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "My Profile",
      headerStyle: {
        backgroundColor: applied === "dark" ? "#121212" : "#fff",
      },
      headerTintColor: applied === "dark" ? "#fff" : "#000",
    });
  }, [navigation, applied]);

  const bgColor = applied === "dark" ? "bg-gray-900" : "bg-gray-100";
  const textColor = applied === "dark" ? "text-white" : "text-black";
  const cardBg = applied === "dark" ? "bg-gray-800" : "bg-white";

  return (
    <SafeAreaView className={`flex-1 ${bgColor} items-center`}>
      <View className="flex-1 w-full px-5 pt-5">
        
        <View className="items-center mb-5">
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-40 h-40 rounded-full border-2 border-gray-400"
            />
          ) : (
            <Image
              source={{uri:userProfile?.profileImage}}
              className="w-40 h-40 rounded-full border-2 border-gray-400"
            />
          )}

          <TouchableOpacity
            className="mt-3 py-2 px-5 rounded-full bg-green-500"
            onPress={pickImage}
          >
            <Text className="text-white font-bold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View className={`p-4 mt-3 rounded-xl mb-3 ${cardBg}`}>
          <View className="flex-row items-center gap-x-3 mb-2">
            <Feather
              name="user"
              size={24}
              color={applied === "dark" ? "white" : "black"}
            />
            <Text className={`${textColor} font-semibold text-lg`}>Name </Text>
          </View>
          <Text className={`${textColor} ml-7 text-base`}>{userProfile?.firstName} {userProfile?.lastName} </Text>
        </View>

        <View className={`p-4 rounded-xl mb-3 ${cardBg}`}>
          <View className="flex-row items-center gap-x-3 mb-2">
            <Feather
              name="phone"
              size={24}
              color={applied === "dark" ? "white" : "black"}
            />
            <Text className={`${textColor} font-semibold text-lg`}>Phone</Text>
          </View>
          <Text className={`${textColor} ml-7 text-base`}>{userProfile?.contactNo}</Text>
        </View>

       
      </View>
    </SafeAreaView>
  );
}

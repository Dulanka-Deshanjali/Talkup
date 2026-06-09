import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { User } from "../socket/chat";
import { useUserList } from "../socket/UseUserList";

type NewChatNavigationPrps = NativeStackNavigationProp<
  RootStack,
  "NewChatScreen"
>;

export default function NewChatScreen() {
  const navigation = useNavigation<NewChatNavigationPrps>();
  const [search, setSearch] = useState("");
  const users = useUserList();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <View className="items-center flex-row gap-x-2">
          <TouchableOpacity
            className="justify-center items-center"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-sharp" size={24} color="black" />
          </TouchableOpacity>
          <View>
            <Text className="font-bold text-lg">Select Contact</Text>
            <Text className="text-gray-500">{users.length} Contacts</Text>
          </View>
        </View>
      ),
      headerRight: () => <View></View>,
    });
  }, [navigation, users]);

  const filteredUser = [...users]
    .filter(
      (user) =>
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.contactNo.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.firstName.localeCompare(b.firstName));

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      className="flex-row items-center bg-white rounded-2xl p-4 my-2 shadow-md"
      onPress={() =>
        navigation.replace("SingleChatScreen", {
          chatId: item.id,
          friendName: `${item.firstName} ${item.lastName}`,
          lastSeenTime: item.updatedAt,
          profileImage: item.profileImage
            ? item.profileImage
            : `https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}&background=random`,
        })
      }
    >
      <Image
        source={{
          uri: item.profileImage
            ? item.profileImage
            : `https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}&background=random`,
        }}
        className="h-16 w-16 rounded-full bg-gray-200"
      />
      <View className="flex-1 ml-4 justify-center">
        <Text className="text-lg font-semibold text-gray-800">
          {item.firstName} {item.lastName}
        </Text>
        <Text className="text-sm italic text-gray-500 mt-1">
          {item.status === "ACTIVE"
            ? "Already in FriendList"
            : "Hey there! I am using TalkUp."}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50 relative"
      edges={["right", "bottom", "left"]}
    >
      <StatusBar hidden={false} translucent={true} />

      <View className="flex-row items-center mx-4 mt-4 bg-white rounded-full px-4 py-2 shadow">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          className="flex-1 ps-2 text-base"
          placeholder="Search contacts"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <TouchableOpacity
        className="flex-row items-center bg-green-500 mx-4 mt-4 p-4 rounded-2xl shadow-md"
        onPress={() => navigation.navigate("NewContactScreen")}
      >
        <View className="bg-white w-10 h-10 rounded-full justify-center items-center mr-4">
          <Feather name="user-plus" size={24} color="green" />
        </View>
        <Text className="text-white text-lg font-bold">Add New Contact</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center bg-green-500 mx-4 mt-2 p-4 rounded-2xl shadow-md"
        onPress={() => navigation.navigate("NewGroupScreen")}
      >
        <View className="bg-white w-10 h-10 rounded-full justify-center items-center mr-4">
          <AntDesign name="usergroup-add" size={24} color="green" />
        </View>
        <Text className="text-white text-lg font-bold">Create New Group</Text>
      </TouchableOpacity>

      {filteredUser.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6 mt-10">
          <Image
            source={require("../../assets/noContacts.png")}
            className="w-72 h-72 mb-6"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-gray-700 text-center">
            No Contacts Found
          </Text>
          <Text className="text-gray-500 mt-2 text-center">
            Try searching again or add a new contact to start chatting.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredUser}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          className="mt-4 px-4"
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
    </SafeAreaView>
  );
}

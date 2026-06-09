import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useContext, useLayoutEffect, useState } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useChatList } from "../socket/useChatList";
import { formateChatTime } from "../util/DateFormatter";
import { Chat } from "../socket/chat";
import { AuthContext } from "../components/AuthProvider";

type HomescreenProps = NativeStackNavigationProp<RootStack, "HomeScreen">;

export default function HomeScreen() {
  const navigation = useNavigation<HomescreenProps>();
  const [search, setSearch] = useState("");
  const chatList = useChatList();
  const auth = useContext(AuthContext);
  const [isModelVisible, setModelVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "TalkUp",
      headerTitleStyle: { fontWeight: "bold", fontSize: 24 },
      headerRight: () => (
        <View className="flex-row space-x-5 mr-2">
          <TouchableOpacity>
           
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModelVisible(true)}>
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>

          <Modal
            animationType="fade"
            visible={isModelVisible}
            transparent={true}
            onRequestClose={() => setModelVisible(false)}
          >
            <Pressable
              className="flex-1 bg-transparent"
              onPress={() => setModelVisible(false)}
            >
              <Pressable onPress={(e) => e.stopPropagation()} />
              <View className="justify-end items-end p-5">
                <View
                  className="bg-white rounded-md w-60 p-3"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <TouchableOpacity
                    className="h-14 my-2 justify-start items-start border-b-2 border-b-gray-100"
                    onPress={() => {
                      navigation.navigate("SettingScreen");
                      setModelVisible(false);
                    }}
                  >
                    <View className="flex-row gap-x-3">
                      <Feather name="settings" size={22} color="black" />
                      <Text className="font-bold text-lg">Settings</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="h-12 my-2 justify-start items-start border-b-2 border-b-gray-100"
                    onPress={() => {
                      navigation.navigate("ProfileScreen");
                      setModelVisible(false);
                    }}
                  >
                    <View className="flex-row gap-x-2">
                      <Ionicons
                        name="person-outline"
                        size={22}
                        color="black"
                        className="mx-2"
                      />
                      <Text className="font-bold text-lg">My Profile</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="h-12 my-2 justify-start items-start border-b-2 border-b-gray-100"
                    onPress={async () => {
                      await auth?.signOut();
                    }}
                  >
                    <View className="flex-row gap-x-2">
                      <Feather name="log-out" size={24} color="black" />
                      <Text className="font-bold text-lg">LogOut</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Modal>
        </View>
      ),
    });
  }, [navigation, isModelVisible]);

  const filteredChat = [...chatList]
    .filter(
      (chat) =>
        chat.friendName.toLowerCase().includes(search.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(search.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.lastTimeStamp).getTime() -
        new Date(a.lastTimeStamp).getTime()
    );

  const renderItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      className="flex-row items-center bg-white rounded-2xl p-4 my-2 shadow-md"
      onPress={() =>
        navigation.navigate("SingleChatScreen", {
          chatId: item.friendId,
          friendName: item.friendName,
          lastSeenTime: formateChatTime(item.lastTimeStamp),
          profileImage: item.profileImage
            ? item.profileImage
            : `https://ui-avatars.com/api/?name=${item.friendName.replace(
                " ",
                "+"
              )}&background=random`,
        })
      }
    >
      <Image
        source={{
          uri: item.profileImage
            ? item.profileImage
            : `https://ui-avatars.com/api/?name=${item.friendName.replace(
                " ",
                "+"
              )}&background=random`,
        }}
        className="h-16 w-16 rounded-full bg-gray-200"
      />
      <View className="flex-1 ml-4 border-b border-gray-100 pb-2">
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-800 font-semibold text-lg">
            {item.friendName}
          </Text>
          <Text className="text-gray-400 text-xs">
            {formateChatTime(item.lastTimeStamp)}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mt-1">
          <Text
            className={`text-sm flex-1 ${
              Number(item.unreadCount) > 0
                ? "text-gray-900 font-medium"
                : "text-gray-500"
            }`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </Text>
          {Number(item.unreadCount) > 0 && (
            <View className="ml-2 bg-green-500 rounded-full px-2 py-1 min-w-[24px] items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 relative">
      <StatusBar hidden={false} />

   
      <View className="flex-row items-center mx-4 mt-[-20] bg-white rounded-full px-4 py-2 shadow">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          className="flex-1 ps-2 text-base"
          placeholder="Search chats"
          value={search}
          onChangeText={setSearch}
        />
      </View>

    
      {filteredChat.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Image
            source={require("../../assets/no_chats.png")}
            className="w-64 h-64 mb-6"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-gray-700 text-center">
            Start Chatting with TalkUp
          </Text>
          <Text className="text-gray-500 mt-2 text-center">
            You have no messages yet. Tap the button below to start a conversation.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredChat}
          renderItem={renderItem}
          keyExtractor={(item) => item.friendId.toString()}
          className="mt-3 px-4"
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

     
      <TouchableOpacity
        className="absolute bottom-16 right-6 h-16 w-16 bg-green-500 rounded-full shadow-lg justify-center items-center"
        onPress={() => navigation.navigate("NewChatScreen")}
      >
        <Ionicons name="chatbox-ellipses" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

import { useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSingleChat } from "../socket/UseSingleChat";
import { Chat } from "../socket/chat";
import { formateChatTime } from "../util/DateFormatter";
import { UseSendChat } from "../socket/UseSendChat";

type Message = {
  id: number;
  text: string;
  sender: "me" | "friend";
  time: string;
  status?: "sent" | "delivered" | "read";
};

type SingleChatScreenProps = NativeStackScreenProps<
  RootStack,
  "SingleChatScreen"
>;

export default function SingleChatScreen({
  route,
  navigation,
}: SingleChatScreenProps) {
  const { chatId, friendName, lastSeenTime, profileImage } = route.params;

  const singleChat = useSingleChat(chatId);
  const messages = singleChat.messages;
  const friend = singleChat.friend;

  const sendMessage = UseSendChat();

  const [input, setInput] = useState("");


  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <View className="flex-row gap-2 justify-center items-center">
          <TouchableOpacity
            className="justify-center items-center"
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back-sharp" />
          </TouchableOpacity>
          <TouchableOpacity className="h-14 w-14 rounded-full bg-gray-300 items-center justify-center">
            <Image
              source={{ uri: profileImage }}
              className="h-14 w-14 rounded-full"
            />
          </TouchableOpacity>
          <View className="space-y-1">
            <Text className="font-bold text-2xl">
              {friend?friend.firstName+" "+friend.lastName : friendName}

            </Text>
            <Text className="italic text-xs font-bold text-gray-500">
              {friend?.status == "ONLINE"
                ? "Online"
                : `Last seen ${formateChatTime(friend?.updatedAt?.toString() ?? "")}`}
            </Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, friend]);

  
  const renderItem = ({ item }: { item: Chat }) => {
    const isMe = item.from.id !== chatId;

    return (
      <View
        className={`my-1 px-3 py-2 max-w-[75%] ${
          isMe
            ? "self-end bg-green-900 rounded-tl-xl rounded-bl-xl rounded-br-xl"
            : "self-start bg-gray-300 rounded-bl-xl rounded-tr-xl rounded-br-xl"
        }`}
      >
        <Text className={`text-base ${isMe ? "text-white" : "text-black"}`}>
          {item.message}
        </Text>
        <View className="flex-row justify-end items-center mt-1">
          <Text
            className={`text-xs italic ${
              isMe ? "text-white" : "text-gray-500"
            } mr-2`}
          >
            {formateChatTime(item.createdAt)}
          </Text>
          {isMe && (
            <Ionicons
              name={
                item.status === "READ"
                  ? "checkmark-done"
                  : item.status === "DELIVERED"
                    ? "checkmark" 
                    : "checkmark"
              }
              size={14}
              color={item.status === "READ" ? "#0284c7" : "#9ca3af"}
            />
          )}
        </View>
      </View>
    );
  };

  const handleSendChat = () => {
    if (!input.trim) {
      return;
    }
    sendMessage(chatId, input);
    setInput("");
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["right", "bottom", "left"]}
    >
      <StatusBar hidden={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "padding" : "height"}
        className="flex-1"
      >
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          inverted
          className="flex-1 px-3"
          contentContainerStyle={{ paddingBottom: 60 }}
        />

      
        <View className="flex-row items-end p-2 bg-white">
          <TextInput
            value={input}
            onChangeText={(text) => setInput(text)}
            multiline
            placeholder="Type a message"
            className="flex-1 min-h-14 h-auto max-h-32 px-5 py-2 bg-gray-200 rounded-3xl text-base"
          />
          <TouchableOpacity
            className="bg-green-400 w-14 h-14 items-center justify-center rounded-full ml-2"
            onPress={handleSendChat}
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

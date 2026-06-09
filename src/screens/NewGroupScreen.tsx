import { Ionicons } from "@expo/vector-icons";
import { useContext, useLayoutEffect, useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserList } from "../socket/UseUserList";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { User } from "../socket/chat";
import { useGroupChat } from "../socket/useGroupChat";
import { createNewGroup } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";

type NewGroupProps = NativeStackNavigationProp<RootStack, "NewGroupScreen">;

export default function NewGroupScreen() {
  const auth = useContext(AuthContext);
  const navigation = useNavigation<NewGroupProps>();
  const [search, setSearch] = useState("");
  const createGropu = useGroupChat();
  const users = useUserList();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");

  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <View className="items-center flex-row gap-x-2">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-sharp" size={24} color="black" />
          </TouchableOpacity>
          <View>
            <Text className="font-bold text-lg">Create New Group</Text>
            <Text className="text-gray-500">{users.length} Contacts</Text>
          </View>
        </View>
      ),
      headerRight: () => <View></View>,
    });
  }, [navigation, users]);


  const filteredUsers = users
    .filter(
      (user) =>
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.contactNo.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.firstName.localeCompare(b.firstName));

  const toggleSelectUser = (user: User) => {
    if (selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const renderItem = ({ item }: { item: User }) => {
    const isSelected = selectedUsers.find((u) => u.id === item.id);
    return (
      <TouchableOpacity
        className="flex-row items-center bg-white rounded-2xl p-4 my-2 shadow-md"
        onPress={() => toggleSelectUser(item)}
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
              : "Hey there! I am using ChatApp"}
          </Text>
        </View>
        <TouchableOpacity
          className={`px-4 py-2 rounded-xl ${
            isSelected ? "bg-green-500" : "bg-gray-200"
          }`}
          onPress={() => toggleSelectUser(item)}
        >
          <Text className={`${isSelected ? "text-white" : "text-black"}`}>
            {isSelected ? "Added" : "Add"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };


const selectedUserIds = selectedUsers.map(user => user.id);


  const createGroup = () => {
    if (!groupName) {
      alert("Enter group name!");
   
      return;


    }else if(selectedUsers.length === 0){
        alert("Select at least one member!");
      return;
    }else{
      const adminId = (auth?auth.userId:0);
        
      console.log(adminId);
      

         createNewGroup(selectedUserIds, groupName,adminId);
      
    }

   
  
    
    
  // console.log("Group Name:", groupName);
  // console.log("Selected User IDs:", selectedUserIds);
    
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-4">
      <KeyboardAvoidingView behavior="padding" className="flex-1">
   
        <View className="my-4">
          <Text className="text-gray-700 mb-1 font-semibold">Group Name</Text>
          <TextInput
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter group name"
            className="bg-white rounded-xl px-4 py-3 shadow-md"
          />
        </View>

        <View className="my-2">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search contacts..."
            className="bg-white rounded-xl px-4 py-3 shadow-md"
          />
        </View>

       
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          className="mt-2 flex-1"
        />

       
        <TouchableOpacity
          className="bg-green-500 rounded-2xl py-3 my-4"
          onPress={createGroup}
        >
          <Text className="text-center text-white font-semibold text-lg">
            Create Group ({selectedUsers.length})
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

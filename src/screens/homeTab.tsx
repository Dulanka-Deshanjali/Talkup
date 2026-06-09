import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsScreen from "./ChatsScreen";
import StatusScreen from "./StatusScreen";
import CallsScreen from "./CallsScreen";
import { Ionicons } from "@expo/vector-icons";

const Tabs = createBottomTabNavigator();
export default function HomeTabs() {
  return (
   <Tabs.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({  color }) => {
      let iconName = "chatbubble-ellipses";

      if (route.name === "Chats") iconName = "chatbubble-ellipses-outline";
      else if (route.name === "Status") iconName = "time-outline";
      else if (route.name === "Calls") iconName = "call-outline";

      return <Ionicons name={iconName as any} size={26} color={color} />;
    },
    tabBarLabelStyle:{fontSize:16,fontWeight:'800'},
    tabBarActiveTintColor :"#25e55e",
    tabBarInactiveTintColor:"#9ca3af",
    tabBarStyle:{
    height:80,
    backgroundColor:"#fff",
    paddingTop:5
  }

  })}>
      <Tabs.Screen name="Chats" component={ChatsScreen} options={{headerShown:false}}/>
      <Tabs.Screen name="Status" component={StatusScreen} />
      
      <Tabs.Screen name="Calls" component={CallsScreen} />
    </Tabs.Navigator>
  );
}

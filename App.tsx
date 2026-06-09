import "./global.css";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";

import SplashScreen from "./src/screens/splashScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import SignInScreen from "./src/screens/SignInScreen";
import HomeTabs from "./src/screens/homeTab";
import ProfileScreen from "./src/screens/ProfileScreen";
import SettingScreen from "./src/screens/SettingScreen";
import ContactScreen from "./src/screens/ContactScreen";
import AvataScreen from "./src/screens/AvatrScreen";
import SingleChatScreen from "./src/screens/SingleChatScreen";
import NewChatScreen from "./src/screens/NewChatScreen";
import NewContactScreen from "./src/screens/NewContactScreen";

import { ThemeProvider } from "./src/theme/ThemeProvider";
import { UserRegistrationProvider } from "./src/components/userContext";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { WebSocketProvider } from "./src/socket/webScoketProvider";
import { AuthContext, AuthProvider } from "./src/components/AuthProvider";
import { useWebSocketPing } from "./src/socket/UseWebSocketPing";
import IdentifyScreenProfile from "./src/screens/IdentifyProfileSreen";
import NewGroupScreen from "./src/screens/NewGroupScreen";

export type RootStack = {
  SplashScreen: undefined;
  SignUpScreen: undefined;
  SignInScreen: undefined;
  HomeScreen: undefined;
  ProfileScreen: undefined;
  SettingScreen: undefined;
  ContactScreen: undefined;
  AvatarScreen: undefined;
  SingleChatScreen: {
    chatId: number;
    friendName: string;
    lastSeenTime: string;
    profileImage: string;
  };
  NewChatScreen: undefined;
  NewContactScreen: undefined;
  IdentifyScreen: { mobile: string ;
    callingCode: string;

  };
  NewGroupScreen:undefined;
};

const Stack = createNativeStackNavigator<RootStack>();

function TalkUp() {
  const auth = useContext(AuthContext);

  // Show splash while loading auth state
  if (auth?.isLoading) {
    return (
      <ThemeProvider>
        <UserRegistrationProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </UserRegistrationProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <UserRegistrationProvider>
        <NavigationContainer>
          {auth?.userId != null ? (
            <WebSocketProvider userId={Number(auth.userId)}>
              <Stack.Navigator initialRouteName="HomeScreen">
                <Stack.Screen
                  name="HomeScreen"
                  component={HomeTabs}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen
                  name="SingleChatScreen"
                  component={SingleChatScreen}
                />
                <Stack.Screen name="NewChatScreen" component={NewChatScreen} />
                 <Stack.Screen name="NewGroupScreen" component={NewGroupScreen} />
                <Stack.Screen name="SettingScreen" component={SettingScreen} />
                <Stack.Screen
                  name="NewContactScreen"
                  component={NewContactScreen}
                />
              

              </Stack.Navigator>
            </WebSocketProvider>
          ) : (
            <Stack.Navigator initialRouteName="SignUpScreen">
              <Stack.Screen
                name="SignUpScreen"
                component={SignUpScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SignInScreen"
                component={SignInScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="IdentifyScreen"
                component={IdentifyScreenProfile}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ContactScreen"
                component={ContactScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AvatarScreen"
                component={AvataScreen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </UserRegistrationProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AlertNotificationRoot>
      <AuthProvider>
        <TalkUp />
      </AuthProvider>
    </AlertNotificationRoot>
  );
}

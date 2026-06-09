import { useEffect, useState } from "react";
import { useWebSocket } from "./webScoketProvider";
import { User, WSResponse } from "./chat";
import { useContext } from "react";
import { AuthContext } from "../components/AuthProvider";

export function useUserProfile() {
  const { socket } = useWebSocket();
  const [userProfile, setUserProfile] = useState<User>();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (!socket || !auth?.userId) return;

   
    socket.send(
      JSON.stringify({
        type: "get_user_profile",
        userId: auth.userId,
      })
    );

  
    const onMessage = (event: MessageEvent) => {
      const response: WSResponse = JSON.parse(event.data);
      if (response.type === "user_profile") {
        console.log("Received user profile:", response.payload);
        setUserProfile(response.payload);
      }
    };

    socket.addEventListener("message", onMessage);
    return () => socket.removeEventListener("message", onMessage);
  }, [socket, auth?.userId]);

  return userProfile;
}

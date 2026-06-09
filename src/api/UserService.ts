import { useContext } from "react";
import { UserRegistrationData } from "../components/userContext";
import { User } from "../socket/chat";


const API = process.env.EXPO_PUBLIC_APP_URL + "/TalkUp";

export const createNewAccount = async (
  userData: UserRegistrationData
) => {
  try {
    let formData = new FormData();
    formData.append("firstName", userData.firstName);
    formData.append("lastName", userData.lastName);
    formData.append("countryCode", userData.countryCode); // fixed typo
    formData.append("contactNo", userData.contactNo);

    if (userData.profileImage) {
      formData.append("profileImage", {
        uri: userData.profileImage,
        name: "profile.png", // fixed typo
        type: "image/png",
      } as any);
    }

    const response = await fetch(`${API}/UserController`, {
      method: "POST",
      body: formData,
      
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const json = await response.json();
    console.log("Account creation response:", json);
    return json;

  } catch (error) {
    console.error("Account creation failed:", error);
    return { error: "OOPS! Account creation failed!" };
  }
};

export const uploadProfileImage = async(userId:string,imageUri:string)=>{
  
  let formData = new FormData();
  formData.append("userId",userId);
  formData.append("profileImage",{
    uri:imageUri,
    type:"image/png",
    name:"profile1.png",
  }as any);

 const response = await fetch(API+"/ProfileController",{
    method:"POST",
    body:formData
  })

  if(response.ok){
    return await response.json();
  }else{
    console.warn("Profile Image uploading failed");
    
  }

};

export const createNewGroup = async (users: number[], name: string,adminId:string|0|null) => {
  await fetch(API + "/CreateNewGroup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // important
    },
    body: JSON.stringify({ name, users ,adminId}), // send groupName + array of user IDs
  });
};
  
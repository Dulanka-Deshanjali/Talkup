import AsyncStorage from "@react-native-async-storage/async-storage";
import {  useColorScheme } from "nativewind";
import React, { createContext, useContext, useEffect, useState } from "react";

import { ActivityIndicator } from "react-native";

export type ThemeOption = "light"|"dark"|"system";
const THEME_KEY = "@app_color_scheme";


type ThemeContextType ={
    preference:ThemeOption;
    applied:"light"|"dark"; //use on run times
    setPreference:(themeoption:ThemeOption)=>Promise<void>;
};

const ThemeContext = createContext<ThemeContextType|undefined>(undefined);

export function ThemeProvider({children}:{children:React.ReactNode}){
    const {colorScheme,setColorScheme}=useColorScheme();
    const [getPreferenceState,setPreferenceState]=useState<ThemeOption>("system");
    const [isReady,setReady]=React.useState(false);

    useEffect(()=>{
        (async()=>{
            try{
                const saveTheme = await AsyncStorage.getItem(THEME_KEY);
                if(saveTheme === "light" || saveTheme === "dark"){
                    setPreferenceState(saveTheme);
                    setColorScheme(saveTheme);
                }else{
                    setPreferenceState("system");
                    setColorScheme("system");
                }
            }catch(error){
                console.warn("Error loading theme preference:",error);
            }finally{
                setReady(true);
            }
        })();
    },[setColorScheme]);


    const setPreference = async(themeoption:ThemeOption)=>{
        try {
            if(themeoption === "system"){
                await AsyncStorage.removeItem(THEME_KEY);
                setPreferenceState("system");
                setColorScheme("system");
            }else{
                await AsyncStorage.setItem(THEME_KEY,themeoption);
                setPreferenceState(themeoption);
                setColorScheme(themeoption);

            }
        } catch (error) {
            console.warn("Failed to save theme :"+error)
            
        }
    };

   if(!isReady){

    return <ActivityIndicator style={{flex:1}}/>

   }

   return (
    <ThemeContext.Provider 
    value={{
        preference:getPreferenceState,
        applied:colorScheme ?? "light",
        setPreference

    }}>
        {children}
    </ThemeContext.Provider>
   );

}

export function useTheme(){
    const ctx = useContext(ThemeContext);
    if(!ctx){
        throw new Error("useTheme muct be used inside ThemeProvider");
    }

    return ctx;
}























































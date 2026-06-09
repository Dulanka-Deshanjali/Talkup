import { useWebSocket } from "./webScoketProvider";

export function useGroupChat(){
    const {sendMessage} = useWebSocket();

    const sendChat =(userId:number)=>{
        sendMessage({
            type:"create_group",
            userId
        })
    }
    
}
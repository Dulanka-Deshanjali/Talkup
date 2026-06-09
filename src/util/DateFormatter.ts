export function formateChatTime(timestamp: string): string {

    const date = new Date(timestamp);
    const now = new Date();

    const isToday = date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday = date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

     const timeStr = date.toLocaleTimeString([],{
        hour:"2-digit",
        minute:"2-digit",
        hour12:true,
     });   

    if(isToday) return timeStr; //today time
    if(isYesterday) return `Yeaterday ${timeStr}`; // yesterday 11.09 AM
    return `${date.toLocaleDateString()} ${timeStr}`;  // 2025-09-26 11.09 AM
}
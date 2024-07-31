import { createContext, useContext, useEffect, useState } from "react";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification]= useState([])
  useEffect(()=>{
    const user= JSON.parse(localStorage.getItem("userInfo"))
    if(user) setUser(user)
  },[])
  return (
    <ChatContext.Provider value={{ user, setUser,selectedChat, setSelectedChat,chats, setChats, notification, setNotification }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;

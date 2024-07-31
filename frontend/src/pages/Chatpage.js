import { Box, Flex } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useState } from "react";

const Chatpage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState();

  return (
    <div style={{ width: "100%" }}>
      {user?.data && <SideDrawer />}
      <Flex
        justifyContent="space-between"
        w="100%"
        
        h={{ base: "100vh", md: "120vh" }}
        p="10px"
        flexDir={{ base: "column", md: "row" }} // Responsive flex direction
      >
        {user?.data && <MyChats fetchAgain={fetchAgain} />}
        {user?.data && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Flex>
    </div>
  );
};

export default Chatpage;

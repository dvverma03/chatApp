import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  TagRightIcon,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import ChatLoading from "../ChatLoading";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
// import NotificationBadge, { Effect } from "react-notification-badge"

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, setSelectedChat, chats, setChats, setUser, notification, setNotification } = ChatState();

  const navigation = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigation("/");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(
        // `http://localhost:1234/api/user?search=${search}`,
        `${process.env.REACT_APP_BACKEND_URI}/api/user?search=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.data?.token}`,
          },
        }
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const { data } = await axios.post(
        // `http://localhost:1234/api/chat`,
        `${process.env.REACT_APP_BACKEND_URI}/api/chat`,
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.data?.token}`,
          },
        }
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Flex
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="gray"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search user to chat" hasArrow placement="bottom-end">
          <div>
            <Button variant="ghost" onClick={onOpen}>
              <i class="fa-solid fa-magnifying-glass"></i>
              <Text d={{ base: "none", md: "flex" }} px="4">
                Search user
              </Text>
            </Button>
          </div>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              {/* <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}
              /> */}
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification?.length && "No new messages"}
              {notification.map(notify=>(
                <MenuItem key={notify.id} onClick={()=>{setSelectedChat(notify.chat)
                  setNotification(notification.filter((n)=> n!==notify))
                }}>
                  {notify.chat.isGroupChat?`New message in ${notify.chat.chatName}`:`New message from ${getSender(user,notify.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton p={1} as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.data?.name}
                src={user?.data?.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user?.data} />
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Flex>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.length > 0 &&
              searchResult?.map((user) => (
                <UserListItem
                  key={useToast._id}
                  user={user}
                  handleFunction={() => accessChat(user?._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;

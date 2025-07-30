import React from "react";
import {
  Box,
  Flex,
  HStack,
  VStack,
  Button,
  Text,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Badge,
  Icon,
} from "@chakra-ui/react";
import {
  FiMenu,
  FiHome,
  FiSearch,
  FiBookmark,
  FiFileText,
  FiBarChart3,
  FiSettings,
  FiLogOut,
  FiUser,
  FiBell,
} from "react-icons/fi";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const AppLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", icon: FiHome, path: "/dashboard" },
    { name: "Job Search", icon: FiSearch, path: "/jobs/search" },
    { name: "Saved Jobs", icon: FiBookmark, path: "/jobs" },
    { name: "Resume", icon: FiFileText, path: "/resume" },
    { name: "Analytics", icon: FiBarChart3, path: "/analytics" },
    { name: "Settings", icon: FiSettings, path: "/settings" },
  ];

  const NavItem = ({ item, isSidebar = false }) => {
    const isActive = location.pathname === item.path;

    return (
      <Button
        as={RouterLink}
        to={item.path}
        variant={isActive ? "solid" : "ghost"}
        colorScheme={isActive ? "brand" : "gray"}
        justifyContent={isSidebar ? "flex-start" : "center"}
        leftIcon={<Icon as={item.icon} />}
        w={isSidebar ? "full" : "auto"}
        size={isSidebar ? "md" : "sm"}
        onClick={isMobile ? onClose : undefined}
      >
        {item.name}
      </Button>
    );
  };

  const Header = () => (
    <Box
      bg="white"
      px={4}
      py={3}
      borderBottomWidth="1px"
      borderColor="gray.200"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex justify="space-between" align="center">
        <HStack spacing={4}>
          {isMobile && (
            <IconButton
              icon={<FiMenu />}
              variant="ghost"
              onClick={onOpen}
              aria-label="Open menu"
            />
          )}
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="brand.500"
            as={RouterLink}
            to="/dashboard"
          >
            ResMatch
          </Text>
        </HStack>

        {/* Desktop Navigation */}
        {!isMobile && (
          <HStack spacing={2}>
            {navItems.slice(0, -1).map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </HStack>
        )}

        {/* User Menu */}
        <HStack spacing={3}>
          <IconButton
            icon={<FiBell />}
            variant="ghost"
            size="sm"
            position="relative"
            aria-label="Notifications"
          >
            <Badge
              colorScheme="red"
              fontSize="xs"
              position="absolute"
              top="-1"
              right="-1"
            >
              3
            </Badge>
          </IconButton>

          <Menu>
            <MenuButton>
              <Avatar
                size="sm"
                name={user?.full_name}
                bg="brand.500"
                color="white"
                cursor="pointer"
              />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiUser />} as={RouterLink} to="/profile">
                Profile
              </MenuItem>
              <MenuItem icon={<FiSettings />} as={RouterLink} to="/settings">
                Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem
                icon={<FiLogOut />}
                onClick={handleLogout}
                color="red.500"
              >
                Sign Out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );

  const Sidebar = () => (
    <VStack spacing={2} align="stretch" p={4}>
      {navItems.map((item) => (
        <NavItem key={item.path} item={item} isSidebar />
      ))}
    </VStack>
  );

  const MobileDrawer = () => (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          <Text color="brand.500" fontWeight="bold">
            ResMatch
          </Text>
        </DrawerHeader>
        <DrawerBody p={0}>
          <Sidebar />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );

  return (
    <Box minH="100vh" bg="gray.50">
      <Header />

      <Flex>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box
            w="280px"
            bg="white"
            borderRightWidth="1px"
            borderColor="gray.200"
            minH="calc(100vh - 73px)"
            position="sticky"
            top="73px"
            alignSelf="flex-start"
          >
            <Sidebar />
          </Box>
        )}

        {/* Mobile Drawer */}
        {isMobile && <MobileDrawer />}

        {/* Main Content */}
        <Box flex={1} minH="calc(100vh - 73px)">
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default AppLayout;

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
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import {
  FiMenu,
  FiHome,
  FiSearch,
  FiBookmark,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiUser,
  FiBell,
  FiChevronRight,
} from "react-icons/fi";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const AppLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, lg: false });

  // Color values for modern design
  const headerBg = useColorModeValue("white", "gray.800");
  const sidebarBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("neutral.200", "gray.600");
  const mainBg = useColorModeValue("neutral.50", "gray.900");
  const brandColor = useColorModeValue("brand.500", "brand.300");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: FiHome,
      path: "/dashboard",
      description: "Overview & insights",
    },
    {
      name: "Jobs",
      icon: FiSearch,
      path: "/jobs",
      description: "Search & manage jobs",
    },
    {
      name: "Resume",
      icon: FiFileText,
      path: "/resume",
      description: "Upload & optimize",
    },
    {
      name: "Analytics",
      icon: FiBarChart2,
      path: "/analytics",
      description: "Track your progress",
    },
    {
      name: "Settings",
      icon: FiSettings,
      path: "/settings",
      description: "Account preferences",
    },
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
        leftIcon={<Icon as={item.icon} boxSize={isSidebar ? 5 : 4} />}
        rightIcon={
          isSidebar && isActive ? (
            <Icon as={FiChevronRight} boxSize={4} />
          ) : undefined
        }
        w={isSidebar ? "full" : "auto"}
        h={isSidebar ? "12" : "10"}
        size={isSidebar ? "md" : "sm"}
        fontSize={isSidebar ? "md" : "sm"}
        fontWeight="600"
        borderRadius={isSidebar ? "xl" : "lg"}
        position="relative"
        onClick={isMobile ? onClose : undefined}
        px={isSidebar ? 4 : 3}
        _hover={
          !isActive
            ? {
                bg: useColorModeValue("neutral.100", "gray.700"),
                transform: "translateY(-1px)",
              }
            : undefined
        }
        _active={{
          transform: "translateY(0)",
        }}
        transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        boxShadow={
          isActive ? "0 4px 12px -2px rgba(57, 114, 230, 0.25)" : "none"
        }
      >
        <VStack spacing={0} align={isSidebar ? "start" : "center"} w="full">
          <Text fontWeight="600">{item.name}</Text>
          {isSidebar && (
            <Text
              fontSize="xs"
              color={isActive ? "brand.200" : "neutral.500"}
              fontWeight="400"
              lineHeight="1.2"
            >
              {item.description}
            </Text>
          )}
        </VStack>
      </Button>
    );
  };

  const Header = () => (
    <Box
      bg={headerBg}
      px={6}
      py={4}
      borderBottomWidth="1px"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.05)"
      backdropFilter="blur(8px)"
    >
      <Flex justify="space-between" align="center">
        <HStack spacing={4}>
          {isMobile && (
            <IconButton
              icon={<FiMenu />}
              variant="ghost"
              onClick={onOpen}
              aria-label="Open menu"
              borderRadius="lg"
              _hover={{
                bg: useColorModeValue("neutral.100", "gray.700"),
              }}
            />
          )}
          <HStack spacing={3} as={RouterLink} to="/dashboard">
            <Box
              w="10"
              h="10"
              bg="brand.500"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 4px 14px 0 rgba(57, 114, 230, 0.25)"
            >
              <Text
                fontSize="xl"
                fontWeight="800"
                color="white"
                textShadow="0 1px 2px rgba(0,0,0,0.1)"
              >
                R
              </Text>
            </Box>
            <VStack spacing={0} align="start">
              <Text
                fontSize="xl"
                fontWeight="800"
                color={brandColor}
                lineHeight="1.2"
              >
                ResMatch
              </Text>
              <Text
                fontSize="xs"
                color="neutral.500"
                fontWeight="500"
                lineHeight="1"
              >
                AI Career Platform
              </Text>
            </VStack>
          </HStack>
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
            size="md"
            position="relative"
            aria-label="Notifications"
            borderRadius="lg"
            _hover={{
              bg: useColorModeValue("neutral.100", "gray.700"),
            }}
          >
            <Badge
              colorScheme="red"
              fontSize="2xs"
              position="absolute"
              top="1"
              right="1"
              borderRadius="full"
              w="5"
              h="5"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              3
            </Badge>
          </IconButton>

          <Menu>
            <MenuButton>
              <Avatar
                size="md"
                name={
                  user?.firstname && user?.lastname
                    ? `${user.firstname} ${user.lastname}`
                    : user?.email
                }
                bg="brand.500"
                color="white"
                cursor="pointer"
                borderWidth="2px"
                borderColor="brand.100"
                _hover={{
                  borderColor: "brand.300",
                  transform: "scale(1.05)",
                }}
                transition="all 0.2s"
              />
            </MenuButton>
            <MenuList
              borderRadius="xl"
              borderColor={borderColor}
              boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              py={2}
            >
              <Box px={4} py={3}>
                <Text fontSize="sm" fontWeight="600" color="neutral.800">
                  {user?.firstname && user?.lastname
                    ? `${user.firstname} ${user.lastname}`
                    : "User"}
                </Text>
                <Text fontSize="xs" color="neutral.500">
                  {user?.email}
                </Text>
              </Box>
              <Divider />
              <MenuItem
                icon={<FiUser />}
                as={RouterLink}
                to="/profile"
                borderRadius="lg"
                mx={2}
                my={1}
                _hover={{
                  bg: useColorModeValue("neutral.100", "gray.700"),
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                icon={<FiSettings />}
                as={RouterLink}
                to="/settings"
                borderRadius="lg"
                mx={2}
                my={1}
                _hover={{
                  bg: useColorModeValue("neutral.100", "gray.700"),
                }}
              >
                Settings
              </MenuItem>
              <Divider />
              <MenuItem
                icon={<FiLogOut />}
                onClick={handleLogout}
                color="red.500"
                borderRadius="lg"
                mx={2}
                my={1}
                _hover={{
                  bg: "red.50",
                  color: "red.600",
                }}
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
    <VStack spacing={2} align="stretch" p={6}>
      {/* Navigation Section */}
      <VStack spacing={1} align="stretch">
        <Text
          fontSize="xs"
          fontWeight="600"
          color="neutral.500"
          textTransform="uppercase"
          letterSpacing="wider"
          mb={3}
          px={2}
        >
          Navigation
        </Text>
        {navItems.map((item) => (
          <NavItem key={item.path} item={item} isSidebar />
        ))}
      </VStack>

      {/* User Info Section */}
      <Box mt={8} pt={6} borderTop="1px solid" borderColor={borderColor}>
        <HStack spacing={3} p={4} borderRadius="xl" bg="neutral.50">
          <Avatar
            size="sm"
            name={
              user?.firstname && user?.lastname
                ? `${user.firstname} ${user.lastname}`
                : user?.email
            }
            bg="brand.500"
            color="white"
          />
          <VStack spacing={0} align="start" flex={1}>
            <Text fontSize="sm" fontWeight="600" noOfLines={1}>
              {user?.firstname && user?.lastname
                ? `${user.firstname} ${user.lastname}`
                : "User"}
            </Text>
            <Text fontSize="xs" color="neutral.500" noOfLines={1}>
              {user?.email}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </VStack>
  );

  const MobileDrawer = () => (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">
      <DrawerOverlay backdropFilter="blur(4px)" />
      <DrawerContent borderRadius="0 2xl 2xl 0" bg={sidebarBg}>
        <DrawerCloseButton
          borderRadius="lg"
          top={4}
          right={4}
          _hover={{
            bg: useColorModeValue("neutral.100", "gray.700"),
          }}
        />
        <DrawerHeader borderBottomWidth="1px" borderColor={borderColor} pb={4}>
          <HStack spacing={3}>
            <Box
              w="8"
              h="8"
              bg="brand.500"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="lg" fontWeight="800" color="white">
                R
              </Text>
            </Box>
            <Text color={brandColor} fontWeight="800" fontSize="lg">
              ResMatch
            </Text>
          </HStack>
        </DrawerHeader>
        <DrawerBody p={0}>
          <Sidebar />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );

  return (
    <Box minH="100vh" bg={mainBg}>
      <Header />

      <Flex>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box
            w="320px"
            bg={sidebarBg}
            borderRightWidth="1px"
            borderColor={borderColor}
            minH="calc(100vh - 89px)"
            position="sticky"
            top="89px"
            alignSelf="flex-start"
            boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.05)"
          >
            <Sidebar />
          </Box>
        )}

        {/* Mobile Drawer */}
        {isMobile && <MobileDrawer />}

        {/* Main Content */}
        <Box flex={1} minH="calc(100vh - 89px)">
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default AppLayout;

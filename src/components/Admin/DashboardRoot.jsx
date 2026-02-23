import * as React from "react";
import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Chat as ChatIcon,
    BarChart as BarChartIcon,
    Settings as SettingsIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Image as ImageIcon,          // ✅ NEW
    People as PeopleIcon,        // ✅ NEW
} from "@mui/icons-material";

import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;
const collapsedWidth = 80;

export default function DashboardRoot() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate()

    const handlelogo = () => {
        navigate('/')
    }

    const currentDrawerWidth = isCollapsed
        ? collapsedWidth
        : drawerWidth;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // ✅ UPDATED MENU
    const menuItems = [
        // { text: "Overview", path: "/dashboard", icon: <DashboardIcon /> },
        { text: "Image Upload", path: "/dashboard/upload", icon: <ImageIcon /> }, // ✅
        { text: "All Users", path: "/dashboard/users", icon: <PeopleIcon /> },   // ✅
        // { text: "Analytics", path: "/dashboard/analytics", icon: <BarChartIcon /> },
        // { text: "Widget Settings", path: "/dashboard/widget", icon: <ChatIcon /> },
        // { text: "Settings", path: "/dashboard/settings", icon: <SettingsIcon /> },
    ];

    const drawerContent = (
        <Box
            sx={{
                backgroundColor: "#0c0c0c",
                height: "100%",
                color: "#fff",
            }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: isCollapsed ? "center" : "space-between",
                    px: 2,
                }}
            >
                {!isCollapsed && (
                    <Typography  variant="h6" fontWeight="bold">
                        <button onClick={handlelogo} className="cursor-pointer pr-4">SavmishaGlobal</button>
                    </Typography>
                )}

                <IconButton
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    sx={{ color: "#fff" }}
                >
                    {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </Toolbar>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

            <List sx={{ px: 1 }}>
                {menuItems.map((item) => {
                    const isActive =
                        location.pathname === item.path ||
                        location.pathname.startsWith(item.path + "/");

                    return (
                        <ListItem key={item.text} disablePadding>
                            <Tooltip
                                title={isCollapsed ? item.text : ""}
                                placement="right"
                                arrow
                            >
                                <ListItemButton
                                    component={NavLink}
                                    to={item.path}
                                    end={item.path === "/dashboard"}
                                    style={() => ({
                                        backgroundColor: isActive
                                            ? "rgb(185 192 192 / 31%)"
                                            : "transparent",
                                        borderRadius: "8px",
                                    })}
                                    sx={{
                                        justifyContent: isCollapsed ? "center" : "flex-start",
                                        px: 2,
                                        transition: "all 0.3s ease",
                                        "&:hover": { backgroundColor: "#1f2937" },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: "#fff",
                                            minWidth: 0,
                                            mr: isCollapsed ? 0 : 2,
                                            justifyContent: "center",
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>

                                    {!isCollapsed && (
                                        <ListItemText
                                            primaryTypographyProps={{
                                                fontSize: "14px",
                                            }}
                                            primary={item.text}
                                        />
                                    )}
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            {/* Top AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: "#0c0c0c",
                    width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
                    ml: { sm: `${currentDrawerWidth}px` },
                    transition: "all 0.3s ease",
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap>
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Box
                component="nav"
                sx={{ width: { sm: currentDrawerWidth }, flexShrink: { sm: 0 } }}
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            backgroundColor: "#111827",
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>

                {/* Desktop Drawer */}
                <Drawer
                    variant="permanent"
                    open
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            width: currentDrawerWidth,
                            transition: "width 0.3s ease",
                            boxSizing: "border-box",
                            backgroundColor: "#111827",
                            borderRight: "1px solid rgba(255,255,255,0.05)",
                            overflowX: "hidden",
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
                    backgroundColor: "#f8fafc",
                    minHeight: "100vh",
                    transition: "all 0.3s ease",
                    padding: 0
                }}
            >
                <Toolbar />
                <Outlet />   {/* ✅ यही dashboard ke अंदर pages दिखाता है */}
            </Box>
        </Box>
    );
}
"use client";

import { Box, Button, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { useAuthUser } from "@/app/context/AuthUserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
    const { isLoggedIn, loading } = useAuthUser();
    const router = useRouter();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        if (!loading && !isLoggedIn) {
            router.push("/login");
        }
    }, [isLoggedIn, loading, router]);

    if (loading || !isLoggedIn) {
        return null;
    }

    const toggleDrawer = (open: boolean) => () => {
        setIsDrawerOpen(open);
    };

    const SidebarContent = (
        <Box
            sx={{
                width: 260,
                bgcolor: "#E6F2F7",
                height: "100%",
                paddingTop: "64px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
        >
            <Box sx={{ padding: "20px" }}>
                {[
                    { href: "/kanded", label: "Kanded" },
                    { href: "/budgets", label: "Eelarved" },
                    { href: "/transactions", label: "Tehingud" },
                    { href: "/categories", label: "Kategooriad" },
                    { href: "/goals", label: "Eesmärgid" },
                    { href: "/rules", label: "Reeglid" },
                    { href: "/settings", label: "Seaded" },
                    { href: "/", label: "Esilehele" },
                ].map((item) => (
                    <Button
                        key={item.href}
                        fullWidth
                        component={Link}
                        href={item.href}
                        sx={{
                            textAlign: "left",
                            marginBottom: "10px",
                            bgcolor: "#006699",
                            color: "#FFFFFF",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                            transition: "background-color 0.3s, transform 0.2s",
                            "&:hover": {
                                bgcolor: "#004d80",
                                transform: "scale(1.02)",
                            },
                        }}
                    >
                        {item.label}
                    </Button>
                ))}
            </Box>
        </Box>
    );

    return (
        <>
            {/* Icon Button for Mobile */}
            {!isDrawerOpen && (
                <IconButton
                    onClick={toggleDrawer(true)}
                    sx={{
                        position: "fixed",
                        top: "64px",
                        left: "0",
                        zIndex: 1300,
                        display: { xs: "block", md: "none" }
                    }}
                >
                    <MenuIcon />
                </IconButton>
            )}

            {/* Sidebar for Desktop */}
            <Box
                sx={{
                    display: { xs: "none", md: "block" },
                    width: 260,
                    flexShrink: 0,
                    bgcolor: "#E6F2F7",
                    paddingTop: "",
                    height: "100vh",
                    position: "fixed",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
            >
                {SidebarContent}
            </Box>

            {/* Drawer for Mobile */}
            <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
                sx={{ display: { xs: "block", md: "none" } }}
            >
                {SidebarContent}
            </Drawer>
        </>
    );
}
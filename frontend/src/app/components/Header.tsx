"use client";


import { AppBar, Toolbar } from '@mui/material';
import { useRouter } from "next/navigation";
import AuthLinks from "@/app/components/auth/AuthLinks";


const Header: React.FC<{ }> = ({  }) => {
    useRouter();
    return (
        <header>
            <AppBar position="fixed" sx={{ bgcolor: "#003366", zIndex: 1201, borderRadius: "0px" }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'right' }}>
                    <AuthLinks />
                </Toolbar>
            </AppBar>
        </header>
    );
}


export default Header;
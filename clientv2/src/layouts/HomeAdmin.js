import { Outlet, useNavigate } from "react-router-dom";
import { AdminSideBar } from "../components/maincomp";
import { useEffect, useState } from "react";

export function HomeAdmin() {
    const navigate = useNavigate();
    const link = process.env.REACT_APP_LINK;

    const [user] = useState(() => {
        try { 
            return JSON.parse(localStorage.getItem('userinfo')) || null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (!user || !user.userid || user.isadmin != true) {
            navigate("/", { replace: true });
            return;
        }
    }, [user, navigate]);

    return (
        <div style={{ display: "flex", minHeight: "100vh"}}>
            <AdminSideBar />
            <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <Outlet />
            </main>
        </div>
    );
}
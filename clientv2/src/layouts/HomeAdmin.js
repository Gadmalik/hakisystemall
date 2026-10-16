import { Outlet } from "react-router-dom";
import { SideBar } from "../components/maincomp";

export function HomeAdmin() {
    return (
        <div style={{ display: "flex", minHeight: "100vh"}}>
            <SideBar />
            <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <Outlet />
            </main>
        </div>
    )
}
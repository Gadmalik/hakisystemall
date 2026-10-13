import { Outlet } from "react-router-dom";
import { SideBar } from "../components/maincomp";

export function Home() {
    return (
        <div style={{ display: "flex", minHeight: "100vh", margin: "-24px", marginBottom: 0 }}>
            <SideBar />
            <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <Outlet />
            </main>
        </div>
    )
}
import { SideBar } from "../components/maincomp";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function Home() {
    const link = process.env.REACT_APP_LINK || "http://localhost:5001";
    const navigate = useNavigate();
    const location = useLocation();

    const [user] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('userinfo')) || null;
        } catch {
            return null;
        }
    });

    const [fonctionnalites, setFonctionnalites] = useState([]);

    const loadFonctionnalites = useCallback(async () => {
        if (!user?.categorieutilisateurid || !user?.type) return;
        try {
            const res = await fetch(`${link}/getfonctionnalitebycategorieutilisateur/${user.categorieutilisateurid}/${user.type}`);
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                setFonctionnalites(data.data);
            }
        } catch (error) {
            console.error("Error loading fonctionnalites:", error);
        }
    }, [link, user?.categorieutilisateurid, user?.type]);

    const subscribeToPush = useCallback(async () => {
        if (!('serviceWorker' in navigator) || !user?.userid) return;
        try {
            const register = await navigator.serviceWorker.register('/sw.js');
            const vapidKey = process.env.PUBLIC_VAPID_KEY || 'BFfto3OgFLJ0naC-J8DwJ27FKDyiXigCqZibrnjGPPenrWAG63zj8Tdz4qDkEXsyNd9K8aJOUI-3aHLL3dy0KIY';
            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidKey)
            });

            await fetch(`${link}/notification/subscribe`, {
                method: 'POST',
                body: JSON.stringify({ subscription, userid: user.userid }),
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.log("Push notification subscription skipped:", error?.message);
        }
    }, [link, user?.userid]);

    const verifRoute = useCallback(() => {
        // Redirection si sur /home directement
        if (location.pathname === "/home" || location.pathname === "/home/") {
            navigate("/home/dashboard", { replace: true });
            return;
        }

        // Si la liste est encore vide ou dashboard/détails, autoriser
        if (fonctionnalites.length === 0) return;
        const currentSub = location.pathname.replace("/home", "");
        if (currentSub === "/dashboard" || currentSub.startsWith("/signalement/")) return;

        const isAllowed = fonctionnalites.some((fonct) => {
            if (!fonct.status) return false;
            const fonctRoute = fonct.route.startsWith("/") ? fonct.route : `/${fonct.route}`;
            return (
                currentSub === fonctRoute ||
                currentSub.startsWith(`${fonctRoute}/`) ||
                location.pathname.endsWith(fonct.route)
            );
        });

        if (!isAllowed) {
            console.warn("Accès restreint à la route :", location.pathname);
            navigate("/home/dashboard", { replace: true });
        }
    }, [location.pathname, fonctionnalites, navigate]);

    useEffect(() => {
        if (!user || !user.userid) {
            navigate("/", { replace: true });
            return;
        }

        if (user.etat === "en attente") {
            navigate('/waiting', { replace: true });
            return;
        }

        loadFonctionnalites();
        subscribeToPush();
    }, [user, navigate, loadFonctionnalites, subscribeToPush]);

    useEffect(() => {
        verifRoute();
    }, [verifRoute]);

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <SideBar fonctionnalites={fonctionnalites} />
            <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <Outlet />
            </main>
        </div>
    );
}
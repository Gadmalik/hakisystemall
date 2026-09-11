import { SideBar } from "../components/Essential";
import { Outlet } from "react-router-dom";
import '../styles/essential.css';
import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String) {
  const link = process.env.REACT_APP_LINK;
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
  const link = process.env.REACT_APP_LINK;
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userinfo')));
  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator)) return alert('Service Workers non supportés');

    const register = await navigator.serviceWorker.register('/sw.js');

    try{
        
      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('BFfto3OgFLJ0naC-J8DwJ27FKDyiXigCqZibrnjGPPenrWAG63zj8Tdz4qDkEXsyNd9K8aJOUI-3aHLL3dy0KIY')
      });

      await fetch(link+'/notification/subscribe', {
        method: 'POST',
        body: JSON.stringify({ subscription, userid: user.userid }),
        headers: { 'Content-Type': 'application/json' }
      });
    }catch(error)  {
      console.log(error);
    }

  };
    useEffect(() => {
        subscribeToPush()
    }, []);
    return (
        <div>
            <SideBar />
            <main class="main-content">
                <Outlet />
            </main>
        </div>
    )
}
import { Modal, SideBar } from "../components/Essential";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userinfo')));
  const [fonctionnalites, setFonctionnalites] = useState([]);
  const location = useLocation();
  const [domaineintervention, setDomaineintervention] = useState([]);
  const [visibleLoader, setVisibleLoader] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);

  const hideModal = () => {
    setVisibleModal(false);
  }
  const loadDomaines = async () => {
      setVisibleLoader(true);
      try {
          await fetch(`${link}/get_categorie`, {
              method: "get",
          }).then((reponse) => reponse.json()).then((data) => {
              setDomaineintervention(data?.data);
              setVisibleLoader(false);
          }).catch((error) => {
              console.log(error);
              setVisibleLoader(false);
          });
      } catch (error) {
          console.log(error);
          setVisibleLoader(false);

      }
  }
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

  const loadFonctionnalites = async () => {
    await fetch(link+`/getfonctionnalitebycategorieutilisateur/${user.categorieutilisateurid}/${user.type}`).then((res) => res.json()).then((data) => {
        if(data.success){
            setFonctionnalites(data.data);
        }
    })
  }
  
  const verifRoute = () => {
    // Si la liste est encore vide, on attend le chargement
    if (fonctionnalites.length === 0) return;

    // Utilisation de .some() pour vérifier si la route actuelle est autorisée
    const isAllowed = fonctionnalites.some((fonct) =>
      fonct.status && (location.pathname.endsWith(fonct.route) || location.pathname === fonct.route)
    );

    if (!isAllowed) {
      console.warn("Accès refusé à la route :", location.pathname);
      
      // Redirection vers la première route autorisée disponible
      const defaultRoute = fonctionnalites[0]?.route;
      if (defaultRoute) {
        navigate(`/home${defaultRoute}`, { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }

  useEffect(() => {
      subscribeToPush();
      loadDomaines();
  }, []);
  useEffect(() => {
    if(user?.etat === "en attente") {
      navigate('/welcome')
    }else{
      if(user?.userid){
        if(user?.config == false){
          setVisibleModal(true);
        }
        loadFonctionnalites();
        console.log(user);
      }
    }
  }, [user]);

  useEffect(() => {
    verifRoute();
  }, [location, fonctionnalites]);
  return (
      <div>
          <SideBar fonctionnalites={fonctionnalites} />
          <Modal visible={visibleModal} setVisible={setVisibleModal} title={"Configuration rapide"} hideModal={() => setVisibleModal(false)} onSubmit={() => {}} data={{form:"formassignerdomaine", domaineintervention}} />
          <main class="main-content">
              <Outlet />
          </main>
      </div>
  )
}
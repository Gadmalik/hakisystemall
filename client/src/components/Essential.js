import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { FormArticle, FormEditProfile, FormSignaler, FormTypeIncident, FormUser } from "./Forms";
import { MenuItem } from "./MiniComp";
export function SideBar() {
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const navigate = useNavigate();
    return (
        
    <nav class="sidebar">
        <div class="brand">
            <img src={logo} alt="logo" className="logo" />
            <span>HAKI SYSTEM</span>
        </div>
        <ul class="menu">
            <MenuItem activeMenu={activeMenu} setActiveMenu={setActiveMenu} navigate={navigate} icon="chart-pie" label="Dashboard" page="dashboard" />
            <MenuItem activeMenu={activeMenu} setActiveMenu={setActiveMenu} navigate={navigate} icon="folder-open" label="Dossiers" page="dossiers" />
            <MenuItem activeMenu={activeMenu} setActiveMenu={setActiveMenu} navigate={navigate} icon="exclamation-triangle" label="Mes signalements" page="mysignalement" />
            <MenuItem activeMenu={activeMenu} setActiveMenu={setActiveMenu} navigate={navigate} icon="users" label="Utilisateurs" page="utilisateurs" />
            <MenuItem activeMenu={activeMenu} setActiveMenu={setActiveMenu} navigate={navigate} icon="newspaper" label="Articles (Éduc)" page="articles" />
            <MenuItem activeMenu={activeMenu} setActiveMenu={setActiveMenu} navigate={navigate} icon="gear" label="Paramètres" page="parametres" />
        </ul>
    </nav>

    )
}
export function Header({title, searchFunction}) {
    const [userMenu, setUserMenu] = useState("hidden");
    const user = JSON.parse(localStorage.getItem("userinfo"));
    const link = process.env.REACT_APP_LINK;
    const navigate = useNavigate();
    const handleLogout = async () => {
        await localStorage.removeItem("userinfo");
        navigate("/");
    }
    // quand on clique n'importe où sauf sur le bouton declancheur (user-profile), le menu se ferme

    const testpush = async () => {
        console.log("testpush");
        await fetch(link+"/notification/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userid: user.userid, title: "Test", body: "Test", url: "/" })
        });
    }
    useEffect(() => {
        document.addEventListener("click", (e) => {
            if(e.target.closest(".user-profile") === null) {
                setUserMenu("hidden");
            }
        });
    }, []);
    return (
        <header class="header">
            <h2 id="page-title">{title}</h2>
            <div class="search-box">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" placeholder="Rechercher un dossier..." onChange={(e) => searchFunction(e.target.value)} />
            </div>
            <div class="user-profile" onClick={() => testpush()}>
                <i class="fa-regular fa-bell fa-lg"></i>
                <div class="user-img">{user.nom.charAt(0)}{user.prenom.charAt(0)}</div>
            </div>
            {/* menu cacher avec identité de l'utilisateur */}
            <div class={`user-menu ${userMenu}`}>
                <div class="user-info">
                    <div class="user-img">{user.nom.charAt(0)}{user.prenom.charAt(0)}</div>
                    <div class="user-name"><b>{user.nom} {user.prenom}</b><br/>@{user.username}</div>
                </div>
                <ul class="user-menu-list">
                    <li class="user-menu-item">
                        <a onClick={() => navigate(`/home/profile/${user.username}`)}>
                            <i class="fa-solid fa-user"></i>
                            <span>Profile</span>
                        </a>
                    </li>
                    <li class="user-menu-item">
                        <a>
                            <i class="fa-solid fa-gear"></i>
                            <span>Paramètres</span>
                        </a>
                    </li>
                    <li class="user-menu-item">
                        <a onClick={handleLogout}>
                            <i class="fa-solid fa-right-from-bracket"></i>
                            <span>Déconnexion</span>
                        </a>
                    </li>
                </ul>
            </div>
        </header>
    )
}

export function Modal({visible, setVisible, data, title, hideModal, onSubmit}){
    const [form, setForm] = useState();
    const [dataSend, setDataSend] = useState();
    const closeModal = () =>setVisible(false);

    useEffect(() => {
        if(data?.form == "formuser"){
            setForm(<FormUser data={dataSend} hideModal={closeModal} />);
        }else if(data?.form == "formSignaler"){
            setForm(<FormSignaler data={dataSend} hideModal={closeModal} onSubmit={onSubmit}/>);
        }else if(data?.form == "formTypeIncident"){
            setForm(<FormTypeIncident data={dataSend} hideModal={closeModal} />);
        }else if(data?.form == "formArticle"){
            setForm(<FormArticle data={dataSend} hideModal={closeModal} />);
        }else if(data?.form == "formEditProfile"){
            setForm(<FormEditProfile data={dataSend} hideModal={closeModal} />);
        }else{

        }
    },[visible, data, dataSend]);
    useEffect(() => {
        
        setDataSend(data);
    }, [data]);
    return (
        <div class={`modal ${visible ?'': 'hidden'}`} onClick={() => setVisible(false)}>
            <div class="modal-content" onClick={(e) => e.stopPropagation()}>
                <div class="modal-header">
                    <h3>{title}</h3>
                    <button class="modal-close" onClick={() => setVisible(false)}><i className="fas fa-close"></i></button>
                </div>
                <div class="modal-body">
                    {form}
                </div>
            </div>
        </div>
    )
}
export function NavBar({action}) {
    const navigate = useNavigate();
    const [visibleMenu, setVisibleMenu] = useState(false);
    const [activeMenu, setActiveMenu] = useState("accueil");
    return (
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo-navbar">
                <img src={logo} alt="" />
                <span>Haki System</span>
            </div>
            <div class="nav-links-container">
                <div class={`nav-links ${visibleMenu ? 'show': ''}`} id="navLinks">
                    <a class={activeMenu === "accueil" ? "active" : ""} onClick={() => {setActiveMenu("accueil"); navigate("/")}}>Accueil</a>
                    <a class={activeMenu === "articles" ? "active" : ""} onClick={() => {setActiveMenu("articles"); navigate("/articles")}}>Articles</a>
                    <a class={activeMenu === "contact" ? "active" : ""} onClick={() => {setActiveMenu("contact"); navigate("/contact")}}>Contact</a>
                </div>
                <div class="nav-buttons">
                    <a onClick={() => navigate("/login")} class="btn"><i class="fas fa-user-circle"></i> <span class="screened">Connexion</span></a>
                    <button onClick={action} class="btn-report" id="openReportBtn">
                        <i class="fas fa-shield-alt"></i> <span class="screened">Signaler</span>
                    </button>
                </div>
                <button class="mobile-menu" id="mobileMenuBtn" onClick={() => setVisibleMenu(!visibleMenu)}>
                    <i class={`fas ${visibleMenu ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
            </div>
        </div>
    </nav>
    )
} 
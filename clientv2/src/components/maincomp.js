import { useNavigate } from "react-router-dom";
import { Badge, Logo, MenuItem } from "./minicomp"
import { useState } from "react"

export function SideBar({}){
    const [activeMenu, setActiveMenu] = useState(window.location.pathname);
    const navigate = useNavigate();
    return (
        <nav class="responsive-nav">
            <div class="nav-brand">
                <Logo />
                <span class="logo-text">HAK System</span>
            </div>
            <div class="nav-links">
                <MenuItem
                    icone="chart-pie"
                    title="Tableau de bord"
                    link="/home/dashboard"
                    active={activeMenu === "/home/dashboard"}
                    onClick={() => {setActiveMenu("/home/dashboard"); navigate("/home/dashboard")}}
                />
                <MenuItem
                    icone="inbox"
                    title="Signalements"
                    link="/home/signalement"
                    active={activeMenu === "/home/signalement"}
                    onClick={() => {setActiveMenu("/home/signalement"); navigate("/home/signalement")}}
                />
                <MenuItem
                    icone="clock"
                    title="À traiter"
                    link="/home/atraitement"
                    active={activeMenu === "/home/atraitement"}
                    onClick={() => {setActiveMenu("/home/atraitement"); navigate("/home/atraitement")}}
                />
                <MenuItem
                    icone="share-nodes"
                    title="Cas orientés"
                    link="/home/casorientes"
                    active={activeMenu === "/home/casorientes"}
                    onClick={() => {setActiveMenu("/home/casorientes"); navigate("/home/casorientes")}}
                />
                <MenuItem
                    icone="compass"
                    title="Orientations"
                    link="/home/orientation"
                    active={activeMenu === "/home/orientation"}
                    onClick={() => {setActiveMenu("/home/orientation"); navigate("/home/orientation")}}
                />
                <MenuItem
                    icone="history"
                    title="Historique"
                    link="/home/historique"
                    active={activeMenu === "/home/historique"}
                    onClick={() => {setActiveMenu("/home/historique"); navigate("/home/historique")}}
                />
                <MenuItem
                    icone="chart-line"
                    title="Statistiques"
                    link="/home/statistiques"
                    active={activeMenu === "/home/statistiques"}
                    onClick={() => {setActiveMenu("/home/statistiques"); navigate("/home/statistiques")}}
                />
                <MenuItem
                    icone="newspaper"
                    title="Articles"
                    link="/home/articles"
                    active={activeMenu === "/home/articles"}
                    onClick={() => {setActiveMenu("/home/articles"); navigate("/home/articles")}}
                />
                <MenuItem
                    icone="users"
                    title="Utilisateurs"
                    link="/home/utilisateurs"
                    active={activeMenu === "/home/utilisateurs"}
                    onClick={() => {setActiveMenu("/home/utilisateurs"); navigate("/home/utilisateurs")}}
                />
            </div>
        </nav>
    )
}

export function Header({title, retour = false}){
    return(
        <header class="header">
            {retour ? <i className="fa-solid fa-arrow-left logo" style={{marginRight: "10px", fontSize: "21px", cursor: "pointer"}}></i> : <Logo size={30} />}
            <div class="menu">
                <h2 style={{fontSize: "1.4rem", fontWeight: "600", color: "var(--text-main)", margin: "0"}}>{title}</h2>
                <input type="search" class="form-control" placeholder="Rechercher un code ou un type..." style={{width: "300px", maxWidth: "75%", borderRadius: "var(--radius-pill)", padding: "10px 16px"}} />
                <div style={{display: "flex", alignItems: "center", gap: "12px", fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "right"}}>
                    <div className="textprofile">
                        <strong style={{color: "var(--text-main)", fontSize: "0.9rem", display: "block"}}>TABARROW RUBAN</strong>
                        Gestionnaire des cas
                    </div>
                    <div style={{width: "40px", height: "40px", background: "#e5e7eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "1.2rem", flexShrink: 0}}>
                        <i class="fa-regular fa-user"></i>
                    </div>
                </div>
            </div>
        </header>
    )
}

export function HeaderSimple({title, retour = false}){
    return(
        <header class="headersimple">
            {retour ? <i className="fa-solid fa-arrow-left logo" style={{marginRight: "10px", fontSize: "21px", cursor: "pointer"}}></i> : <Logo size={30} />}
            <div class="menu">
                <h2 style={{fontSize: "1.4rem", fontWeight: "600", color: "var(--text-main)", margin: "0"}}>{title}</h2>
                <Badge label={"Quitter"} type="medium" onClick={() => {window.history.back()}} />
            </div>
        </header>
    )
}
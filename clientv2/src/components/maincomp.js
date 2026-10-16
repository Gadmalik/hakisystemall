import { useNavigate } from "react-router-dom";
import { Badge, Logo, MenuItem } from "./minicomp"
import { useEffect, useState } from "react"

export function SideBar({ fonctionnalites}){
    const [activeMenu, setActiveMenu] = useState(window.location.pathname);
    const [fonctionnalitesMenu, setFonctionnalitesMenu] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        console.log(fonctionnalites);
        if(fonctionnalites?.length > 0){
            setFonctionnalitesMenu(fonctionnalites);
        }
    }, [fonctionnalites]);
    return (
        <nav class="responsive-nav">
            <div class="nav-brand">
                <Logo />
                <span class="logo-text">HAK System</span>
            </div>
            <div class="nav-links">
                {
                    fonctionnalites?.map((fonctionnalite) => <MenuItem
                        icone={fonctionnalite.icone}
                        title={fonctionnalite.designation}
                        link={fonctionnalite.route}
                        active={activeMenu === fonctionnalite.route}
                        onClick={() => {setActiveMenu(fonctionnalite.route); navigate(`/home/${fonctionnalite.route}`)}}
                    />)
                }
                
            </div>
        </nav>
    )
}

export function Header({title, retour = false}){
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userinfo")));

    return(
        <header class="header">
            {retour ? <i className="fa-solid fa-arrow-left logo" style={{marginRight: "10px", fontSize: "21px", cursor: "pointer"}}></i> : <Logo size={30} />}
            <div class="menu">
                <h2 style={{fontSize: "1.4rem", fontWeight: "600", color: "var(--text-main)", margin: "0"}}>{title}</h2>
                <input type="search" class="form-control" placeholder="Rechercher un code ou un type..." style={{width: "300px", maxWidth: "75%", borderRadius: "var(--radius-pill)", padding: "10px 16px"}} />
                <div style={{display: "flex", alignItems: "center", gap: "12px", fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "right"}}>
                    <div className="textprofile">
                        <strong style={{color: "var(--text-main)", fontSize: "0.9rem", display: "block"}}>{user?.nom.toUpperCase()} {user?.prenom}</strong>
                        {user?.role}({user?.designation})
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
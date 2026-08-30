import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header, Modal, NavBar } from "../components/Essential";
import { Loader } from "../components/MiniComp";

export function Profile(){
    const link = process.env.REACT_APP_LINK;
    const {username} = useParams();
    const [userinfo, setUserinfo] = useState([]);
    const [visible, setVisible] = useState(false);
    const [loader, setLoader] = useState(false);
    const [dossiers, setDossiers] = useState([]);
    const [articles, setArticles] = useState([]);
    const [activeTab, setActiveTab] = useState("dossier");
    const user = JSON.parse(localStorage.getItem("userinfo"));
    
    const navigate = useNavigate();
    const hideModal = () => setVisible(false);
    const loadUserInfos = async () => {
        setLoader(true);
        await fetch(`${link}/getuser?username=${username}`).then(res => res.json()).then( async (data) => {
            setUserinfo(data.data);
            await fetch(`${link}/getincident?userid=${data.data.userid}`).then(res => res.json()).then(data => {
                setDossiers(data.data.filter(d => d.statusinc === "cloturer"));
            });
            await fetch(`${link}/getarticle?articleid=${data.data.userid}&filter=user`).then(res => res.json()).then(data => {
                setArticles(data.data);
            });
        });
        setLoader(false);
    }
    useEffect(() => {
        loadUserInfos();
    },[username]);
    return(
        <>
            {window.location.pathname.includes("/home") ? <Header title={"Profil"} /> :<NavBar /> }
            <div class="profile-container">
                {loader && <Loader />}
                {user.userid == userinfo.userid && <Modal visible={visible} setVisible={setVisible} data={{form: "formEditProfile", ...userinfo}} title={"Modifier le profil"} hideModal={hideModal} />}
                <div class="profile-card" id="profileCard">
                    <div class="profile-cover"></div>
                    <div class="avatar-section">
                        <div class="avatar-circle" id="avatarCircle">
                            <i class="fa-solid fa-user default-avatar"></i>
                            <img src="" alt="avatar" id="avatarImg" />
                        </div>
                    </div>

                    <div class="profile-info" id="profileInfo">
                        <div class="name-row">
                            <h1 class="profile-name" id="displayName">{userinfo?.noms}</h1>
                        </div>
                        <div class="profile-handle">
                            <i class="fa-solid fa-circle-check"></i> <span id="displayHandle">@{userinfo?.username}</span> · <i class="fa-solid fa-location-dot"></i> <span id="displayLocation">{userinfo?.adresse}</span>
                        </div>
                        <div class="badge-role">
                            <i class="fa-solid fa-gavel"></i> {userinfo?.type}
                        </div>

                        <div class="editable-bio" id="bioContainer">
                            <span id="bioText">✧ Défendre et protéger. Haki kwa wote.</span>
                        </div>

                        <div class="stats-row">
                            <div class="stat-item"><span class="stat-number" id="statResolved">{dossiers.length}</span><div class="stat-label">cas résolus</div></div>
                        </div>

                        {user.userid == userinfo.userid && <div class="action-buttons" id="actionButtons">
                            <button class="btn btn-primary" id="selfEditBtn" onClick={() => setVisible(true)}><i class="fa-regular fa-pen-to-square"></i> Éditer profil</button>
                        </div>}
                    </div>
                    <div class="profile-tabs">
                        <div class={`tab ${activeTab === "dossier" ? "active" : ""}`} onClick={() => setActiveTab("dossier")}><i class="fa-solid fa-folder-open"></i>Dossiers</div>
                        <div class={`tab ${activeTab === "article" ? "active" : ""}`} onClick={() => setActiveTab("article")}><i class="fa-solid fa-lightbulb"></i>Éducation</div>
                    </div>

                    <div class="tab-content" id="tabContent">
                        {activeTab === "dossier" && (<div className="activity-grid">{dossiers.map((d) => (
                            <div class="activity-card">
                                <i class="fa-regular fa-folder-open" style={{fontSize:"1.5rem",color:"var(--success)"}}></i>
                                <div><b>#DOS-{new Date(d.date_create).getFullYear()}-{d.id_incident}</b> {d.categorie} · <span class="pill success">résolu</span></div>
                            </div>
                        ))}</div>)}
                        {activeTab === "article" && (<div class="cards-container">
                            {articles.map((article) => (
                                <div class="article-card" onClick={() => navigate(`/home/article/${article.articleid}`)} >
                                    <div class="article-img">
                                        <i class="fa-solid fa-image fa-2x"></i>
                                    </div>
                                    <div class="article-content">
                                    <div class="article-title">{article?.titre}</div>
                                    <p class="article-desc"><i class="fa-solid fa-user"></i> {article?.noms}</p>
                                    <div class="article-meta">
                                        <span><i class="fa-solid fa-eye"></i> {0} vues</span>
                                        <span><i class="fa-solid fa-paperclip"></i> {article?.typepiece}</span>
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>)}
                    </div>

                    <hr/>
                    <div class="footer-note">
                        <i class="fa-solid fa-lock"></i> confidentiel · blockchain HAKI
                        <i class="fa-solid fa-shield"></i>
                    </div>
                </div>
            </div>
        </>
    )
}
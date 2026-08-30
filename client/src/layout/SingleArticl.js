import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header, NavBar } from "../components/Essential";
import { Loader } from "../components/MiniComp";

export function SingleArticl() {
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem("userinfo"));
    const [article, setArticle] = useState([]);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const link = process.env.REACT_APP_LINK;
    const loadArticle = async () => {
        setVisible(true);
        await fetch(`${link}/getarticle?articleid=${id}`).then(res => res.json()).then(data => {
            setArticle(data.data);
        });
        setVisible(false);
    };
    useEffect(() => {
        loadArticle();
    }, [id]);
    return (
        <>
            {window.location.pathname.includes("/home") ? <Header title={"Article"} /> :<NavBar /> }
            {visible && <Loader />}
            <div class="container article-page" id="view-news">
                <header class="article-hero">
                    <div class="breadcrumb">Accueil {`>`} Éducation {`>`} Droits Humains</div>
                    <span class="cat-badge">SÉCURITÉ NUMÉRIQUE</span>
                    <h1 class="article-h1">{article?.titre}</h1>
                    <div class="meta-data">
                        <span onClick={() => window.location.pathname.includes("/home") ? navigate(`/home/profile/${article?.username}`) : navigate(`/profile/${article?.username}`)}><i class="fas fa-user-edit"></i> Par <b>{article?.noms}</b></span>
                        <span><i class="fas fa-calendar-day"></i> {article?.date_create?.split('T')[0]}</span>
                        <span><i class="fas fa-stopwatch"></i> 4 min de lecture</span>
                    </div>
                </header>
                {article?.typepiece?.includes("image") && <img src={`${link}/uploads/${article?.piecesjointes}`} alt="Justice" class="hero-img" />}

                <div class="article-layout">
                    <article class="content-area">
                        <div dangerouslySetInnerHTML={{ __html: article?.contenu }} />
                        <div class="engagement-zone">
                            <div class="share-btns">
                                <button class="btn" style={{background:"#25D366", color:"white"}}><i class="fab fa-whatsapp"></i></button>
                                <button class="btn" style={{background:"#1877F2", color:"white"}}><i class="fab fa-facebook-f"></i></button>
                                <button class="btn" style={{background:"#000", color:"white"}}><i class="fab fa-x-twitter"></i></button>
                            </div>
                            <div class="author-bio">
                                <div style={{width:"50px", height:"50px", borderRadius:"50%", background:"var(--primary)"}}></div>
                                <div>
                                    <strong>Écrit par {article?.noms}</strong>
                                    <p style={{fontSize: "0.75rem", color: "gray"}}>Expert en cybersécurité chez Lonford Devs.</p>
                                </div>
                            </div>
                        </div>

                        <section class="comment-section">
                            <h3 style={{marginTop: "40px"}}>Commentaires (1)</h3>
                            <div class="comment-item">
                                <strong>TABARROW RUBAN</strong>
                                <p style={{fontSize: "0.9rem"}}>Très clair ! Le mode offline va vraiment aider les zones rurales.</p>
                            </div>
                        </section>
                    </article>
                </div>

                <footer style={{padding: "40px", borderTop: "1px solid #eee", display: "flex", gap: "20px"}}>
                    <div style={{flex:1, background:"#f8fafc", padding:"15px", borderRadius:"8px"}}>
                        <p style={{fontSize: "0.8rem", fontWeight: "bold"}}>Savoir plus sur la Blockchain</p>
                        <small>Par EUSTACHE</small>
                    </div>
                    <div style={{flex:1, background:"#f8fafc", padding:"15px", borderRadius:"8px"}}>
                        <p style={{fontSize: "0.8rem", fontWeight: "bold"}}>Droits des femmes en RDC</p>
                        <small>Par GAD</small>
                    </div>
                </footer>
            </div>
    </>
    );
}
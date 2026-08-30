import { useEffect, useState } from "react";
import { Header, Modal } from "../components/Essential";
import { HeaderButton, Loader } from "../components/MiniComp";
import { useNavigate } from "react-router-dom";

export function Articles() {
    const user = JSON.parse(localStorage.getItem("userinfo"));
    const link = process.env.REACT_APP_LINK;
    const [visibleModal, setVisibleModal] = useState(false);
    const hideModal = () => setVisibleModal(false);
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [myArticles, setMyArticles] = useState(false);
    const [loaderVisible, setLoaderVisible] = useState(false);
    const [myFilteredArticles, setMyFilteredArticles] = useState([]);
    const [activeTab, setActiveTab] = useState("articles");
    const navigate = useNavigate();
    const loadArticles = async () => {
        setLoaderVisible(true);
        await fetch(`${link}/getarticle`)
        .then(res => res.json())
        .then(data => {
            if(data.status === "success"){
                console.log(data.data);
                setArticles(data.data.filter(article => article?.userid != user.userid));
                setFilteredArticles(data.data.filter(article => article?.userid != user.userid));
                setMyFilteredArticles(data.data.filter(article => article?.userid === user.userid));
                setMyArticles(data.data.filter(article => article?.userid === user.userid).length > 0);
            }
        })
        setLoaderVisible(false);
    }   
    useEffect(() => {
        loadArticles();
    }, []);
    return <>
        <Header title={"Articles"} />
        {loaderVisible && <Loader />}
        <div className="main-container">
            <div class="cards-container">
                {filteredArticles.map((article) => (
                    <div class="article-card" onClick={() => navigate(`/home/article/${article.articleid}`)} >
                        <div class="article-img">
                            <i class="fa-solid fa-image fa-2x"></i>
                        </div>
                        <div class="article-content">
                        <div class="article-title">{article?.titre}</div>
                        <p class="article-desc"><i class="fa-solid fa-user"></i> {article?.nom} {article?.prenom}</p>
                        <div class="article-meta">
                            <span><i class="fa-solid fa-eye"></i> {0} vues</span>
                            <span><i class="fa-solid fa-paperclip"></i> {article?.typepiece}</span>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    </>
}
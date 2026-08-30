import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/Essential";

export function ListArticles() {
    const link = process.env.REACT_APP_LINK;
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [search, setSearch] = useState("");
    const loadArticles = async () => {
        await fetch(`${link}/getarticle`).then(res => res.json()).then(data => {
            setArticles(data.data);
            setFilteredArticles(data.data);
        });
    };
    useEffect(() => {
        setFilteredArticles(articles.filter((article) => `${article.titre} ${article.contenu} ${article.noms} `.toLowerCase().includes(search.toLowerCase())));
    }, [search]);
    useEffect(() => {
        loadArticles();
    }, []);
    return (
        <div>
            <NavBar />
            <div class="content">   
                <div class="search-box">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Rechercher un article..." onChange={(e) => setSearch(e.target.value)} value={search} />
                </div>
                <div class="cards-container">
                    {filteredArticles.map((article) => (
                        <div class="article-card" onClick={() => navigate(`/articles/${article.articleid}`)} >
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
                </div>
            </div>
        </div>
    );
}
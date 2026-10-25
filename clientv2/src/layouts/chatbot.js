import { HeaderSimple } from "../components/maincomp";
import { ChatSuggestion } from "../components/minicomp";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Chatbot() {
    const navigate = useNavigate();
    const [conversation, setConversation] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation, loading]);

    // Knowledge base for HAKI System
    const getBotResponse = (input) => {
        const text = input.toLowerCase();

        if (text.includes("comment") && (text.includes("signaler") || text.includes("signalement") || text.includes("faire"))) {
            return {
                text: "Pour soumettre un signalement sur HAKI System, suivez ces 3 étapes simples :\n\n1. Cliquez sur le bouton 'Nouveau Signalement' ci-dessous.\n2. Sélectionnez la catégorie de l'incident (Corruption, Fraude, Harcèlement, etc.).\n3. Décrivez les faits, ajoutez des preuves (photos, documents, audio) et choisissez si vous souhaitez rester anonyme.\n\nÀ la fin, vous recevrez un code de suivi unique (ex : HSY-ABC-XYZ) pour consulter l'avancement de votre dossier à tout moment.",
                action: { label: "Faire un signalement maintenant", path: "/signaler", icon: "shield-halved" }
            };
        }

        if (text.includes("anonym") || text.includes("confidentiel") || text.includes("peur") || text.includes("identité")) {
            return {
                text: "Absolument. La confidentialité et la protection des lanceurs d'alerte sont notre priorité absolue :\n\n• Vous pouvez signaler sans créer de compte.\n• Aucune coordonnée personnelle n'est exigée.\n• Les métadonnées sensibles de vos pièces jointes sont protégées.\n• Votre dossier est identifié uniquement par un code aléatoire chiffré.",
                action: { label: "Déposer un signalement anonyme", path: "/signaler", icon: "user-secret" }
            };
        }

        if (text.includes("suivr") || text.includes("suivi") || text.includes("code") || text.includes("dossier") || text.includes("avancement")) {
            return {
                text: "Pour suivre votre dossier en temps réel :\n\n1. Munissez-vous du code unique généré lors de votre déclaration (ex : HSY-7N2-MNC).\n2. Rendez-vous sur la page 'Suivi de dossier'.\n3. Entrez votre code pour voir si votre cas a été pris en charge, analysé ou résolu.",
                action: { label: "Accéder au suivi de dossier", path: "/suiviedossier", icon: "route" }
            };
        }

        if (text.includes("danger") || text.includes("urgence") || text.includes("immédiat") || text.includes("menace") || text.includes("police")) {
            return {
                text: "⚠️ SI VOUS ÊTES EN DANGER PHYSIQUE IMMÉDIAT :\n\n1. Mettez-vous en lieu sûr dès maintenant.\n2. Contactez immédiatement les services d'urgence ou les lignes d'assistance d'urgence :\n   • Ligne verte protection : 112 / 118\n   • Permanence d'assistance d'urgence HAKI : +243 81 000 0000\n3. Vous pouvez également demander une prise en charge urgente en spécifiant le niveau 'Critique' lors du signalement.",
                action: { label: "Signaler en urgence critique", path: "/signaler", icon: "triangle-exclamation" }
            };
        }

        if (text.includes("structure") || text.includes("organisation") || text.includes("ong") || text.includes("aide") || text.includes("partenaire")) {
            return {
                text: "HAKI System collabore avec un réseau d'organisations partenaires agréées :\n\n• Cliniques juridiques et barreaux d'avocats pour l'assistance judiciaire.\n• Centres médico-psychologiques pour l'accompagnement des victimes.\n• ONG spécialisées dans la lutte contre la corruption et la défense des droits humains.\n\nLes gestionnaires orientent directement les cas vers ces structures selon vos besoins.",
                action: { label: "Découvrir les structures", path: "/home/orientations", icon: "building" }
            };
        }

        if (text.includes("qui") || text.includes("c'est quoi") || text.includes("haki")) {
            return {
                text: "HAKI System est une plateforme technologique dédiée à la transparence, à la justice sociale et à la protection citoyenne.\n\nElle permet de dénoncer en toute sécurité les abus, actes de corruption, violences et fraudes, tout en facilitant la coordination entre lanceurs d'alerte, gestionnaires d'organisations et structures de soutien.",
                action: { label: "Voir le tableau de bord", path: "/home/dashboard", icon: "chart-pie" }
            };
        }

        // Default response
        return {
            text: "Merci pour votre message. Je suis votre assistant HAKI Chat. Vous pouvez me poser des questions sur :\n\n• La procédure de signalement d'un incident\n• La garantie d'anonymat et de sécurité\n• Le suivi d'un dossier avec votre code unique\n• Les structures d'assistance et partenaires disponibles\n\nQue souhaitez-vous savoir ?",
            action: null
        };
    };

    const handleSendMessage = (userText) => {
        const query = userText || message;
        if (!query.trim()) return;

        const userMsg = {
            id: Date.now(),
            sender: "user",
            text: query,
            time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
        };

        setConversation((prev) => [...prev, userMsg]);
        setMessage("");
        setLoading(true);

        setTimeout(() => {
            const botData = getBotResponse(query);
            const botMsg = {
                id: Date.now() + 1,
                sender: "bot",
                text: botData.text,
                action: botData.action,
                time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
            };
            setConversation((prev) => [...prev, botMsg]);
            setLoading(false);
        }, 700);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearChat = () => {
        setConversation([]);
    };

    return (
        <div className="chat-app">
            <main className="chat-main">
                <HeaderSimple title="HAKI BOT Assistant" retour={true} onBack={() => navigate(-1)} />

                {/* Sub-header bar */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 20px",
                    background: "white",
                    borderBottom: "1px solid var(--border-color)",
                    fontSize: "0.85rem",
                    color: "var(--text-muted)"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ width: "8px", height: "8px", background: "#16a34a", borderRadius: "50%", display: "inline-block" }}></span>
                        <span>Assistant en ligne • Réponses instantanées</span>
                    </div>
                    {conversation.length > 0 && (
                        <button
                            onClick={clearChat}
                            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "4px" }}
                            title="Effacer la conversation"
                        >
                            <i className="fa-solid fa-trash-can"></i>
                            Effacer
                        </button>
                    )}
                </div>

                <div className="chat-messages" id="chatMessages">
                    {conversation.length === 0 ? (
                        <div className="chat-welcome">
                            <div className="chat-welcome-icon" style={{ background: "var(--primary-light)", color: "var(--primary)" }}>
                                <i className="fa-solid fa-robot"></i>
                            </div>
                            <h1>Bonjour, je suis HAKI Bot 👋</h1>
                            <p>Votre assistant virtuel pour vous orienter, vous informer et vous aider à signaler ou suivre un incident.</p>
                            <div className="chat-suggestions">
                                <ChatSuggestion
                                    icone="shield-halved"
                                    title="Comment faire un signalement ?"
                                    onClick={() => handleSendMessage("Comment faire un signalement ?")}
                                />
                                <ChatSuggestion
                                    icone="lock"
                                    title="Le signalement est-il anonyme ?"
                                    onClick={() => handleSendMessage("Le signalement est-il anonyme ?")}
                                />
                                <ChatSuggestion
                                    icone="route"
                                    title="Comment suivre mon dossier ?"
                                    onClick={() => handleSendMessage("Comment suivre mon dossier ?")}
                                />
                                <ChatSuggestion
                                    icone="triangle-exclamation"
                                    title="Je suis en danger immédiat"
                                    onClick={() => handleSendMessage("Je suis en danger immédiat")}
                                />
                                <ChatSuggestion
                                    icone="hand-holding-heart"
                                    title="Trouver une structure d'aide"
                                    onClick={() => handleSendMessage("Trouver une structure d'aide")}
                                />
                                <ChatSuggestion
                                    icone="circle-question"
                                    title="Qui est HAKI System ?"
                                    onClick={() => handleSendMessage("Qui est HAKI System ?")}
                                />
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px 0" }}>
                            {conversation.map((msg) => (
                                <div key={msg.id} className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}>
                                    <div className="chat-message-avatar">
                                        {msg.sender === "user" ? (
                                            <i className="fa-solid fa-user"></i>
                                        ) : (
                                            <i className="fa-solid fa-robot"></i>
                                        )}
                                    </div>
                                    <div className="chat-message-bubble">
                                        <div style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
                                            {msg.text}
                                        </div>

                                        {/* Action link if provided */}
                                        {msg.action && (
                                            <div style={{ marginTop: "12px", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "8px" }}>
                                                <button
                                                    onClick={() => navigate(msg.action.path)}
                                                    className="btn btn-primary btn-sm"
                                                    style={{ fontSize: "0.82rem", padding: "6px 14px" }}
                                                >
                                                    <i className={`fa-solid fa-${msg.action.icon}`} style={{ marginRight: "6px" }}></i>
                                                    {msg.action.label}
                                                </button>
                                            </div>
                                        )}

                                        <div style={{
                                            fontSize: "0.7rem",
                                            color: msg.sender === "user" ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
                                            marginTop: "6px",
                                            textAlign: "right"
                                        }}>
                                            {msg.time}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="chat-message bot">
                                    <div className="chat-message-avatar">
                                        <i className="fa-solid fa-robot"></i>
                                    </div>
                                    <div className="chat-message-bubble" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 18px" }}>
                                        <i className="fa-solid fa-spinner fa-spin" style={{ color: "var(--primary)" }}></i>
                                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>HAKI Bot réfléchit...</span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                <div className="chat-input-area">
                    <div className="chat-input-wrapper">
                        <div className="chat-input-box">
                            <textarea
                                className="chat-textarea"
                                id="chatTextarea"
                                placeholder="Posez une question à HAKI Bot (ex : anonymat, code de suivi, urgence...)..."
                                rows="1"
                                maxLength="2000"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                            ></textarea>
                            <button
                                className={`chat-send-btn ${message.trim() && !loading ? "enabled" : ""}`}
                                id="chatSendBtn"
                                title="Envoyer le message"
                                onClick={() => handleSendMessage()}
                                disabled={!message.trim() || loading}
                            >
                                <i className={`fa-solid ${loading ? "fa-spinner fa-spin" : "fa-paper-plane"}`}></i>
                            </button>
                        </div>
                        <p className="chat-input-hint">
                            HAKI Chat est un assistant automatisé. En cas d'urgence vitale, contactez directement les secours.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
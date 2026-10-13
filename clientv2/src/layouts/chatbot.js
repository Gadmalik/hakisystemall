import { HeaderSimple } from "../components/maincomp";
import { ChatSuggestion } from "../components/minicomp";
import { useState } from "react";

export function Chatbot() {
    const [conversation, setConversation] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const addMessage = (message, sender) => {
        setConversation(prevConversation => [...prevConversation, {sender, message}]);
        setConversation(prevConversation => [...prevConversation, {sender: "bot", message: "loading"}]);
        setLoading(true);
        setTimeout(() => {
            setConversation(prevConversation => prevConversation.filter(message => message.message !== "loading"));
            setConversation(prevConversation => [...prevConversation, {sender: "bot", message: "Bonjour, je suis HAKI Chat 👋"}]);
            setLoading(false);
        }, 3000);
    }
    
    const sendMessage = () => {
        if(message.trim() === "") return;
        addMessage(message, "user");
        setMessage("");
    }
    return (
        <div className="chat-app">
            <main className="chat-main">
                <HeaderSimple title={"HAKI BOT"} />
                <div class="chat-messages" id="chatMessages">
                    {conversation.length === 0 ? <div class="chat-welcome">
                        <div class="chat-welcome-icon">
                            <i class="fa-solid fa-comments"></i>
                        </div>
                        <h1>Bonjour, je suis HAKI Chat 👋</h1>
                        <p>Votre assistant virtuel pour vous accompagner. Posez-moi une question ou choisissez un sujet ci-dessous.</p>
                        <div class="chat-suggestions">
                            <ChatSuggestion icone="shield-halved" title="Comment faire un signalement ?" onClick={() => {}} />
                            <ChatSuggestion icone="lock" title="Le signalement est-il anonyme ?" onClick={() => {}} />
                            <ChatSuggestion icone="route" title="Comment suivre mon dossier ?" onClick={() => {}} />
                            <ChatSuggestion icone="triangle-exclamation" title="Je suis en danger immédiat" onClick={() => {}} />
                            <ChatSuggestion icone="hand-holding-heart" title="Trouver une structure d'aide" onClick={() => {}} />
                            <ChatSuggestion icone="circle-question" title="Qui est HAKI Chat ?" onClick={() => {}} />
                        </div>
                    </div>:
                    <div class="chat-messages" id="chatMessages">
                        {conversation.map((message, index) => (
                            <div class={`chat-message ${message.sender === 'user' ? 'user' : 'bot'}`}>
                                <div class="chat-message-avatar">
                                    {message.sender === 'user' ? 'TR' : <i class="fa-solid fa-robot"></i>}
                                </div>
                                <div class="chat-message-bubble">
                                    {message.message === "loading" ? <i class="fa-solid fa-spinner fa-spin"></i> : <div>{message.message}</div>}
                                </div>
                            </div>
                        ))}
                        
                    </div>
                    }
                </div>
                <div class="chat-input-area">
                    <div class="chat-input-wrapper">
                        <div class="chat-input-box">
                            <textarea class="chat-textarea" id="chatTextarea" placeholder="Écrivez votre message..." rows="1" maxlength="2000" value={message} onChange={(event) => setMessage(event.target.value)}></textarea>
                            <button class={`chat-send-btn ${message.trim() === "" || loading ? "": "enabled"}`} id="chatSendBtn" title="Envoyer" onClick={sendMessage} disabled={message.trim() === "" || loading}>
                                <i class={`fa-solid ${loading ? "fa-spinner fa-spin" : "fa-paper-plane"}` }></i>
                            </button>
                        </div>
                        <p class="chat-input-hint">
                            HAKI Chat peut faire des erreurs. Vérifiez les informations importantes.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
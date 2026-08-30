import "../styles/forms.css";
import logo from "../assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MiniLoader } from "../components/MiniComp";
export function Login() {
    const link = process.env.REACT_APP_LINK;
    const navigate = useNavigate();
    const [userLogin, setUserLogin] = useState({
        identifiant: "",
        mdp: ""
    });
    const [visiblemdp, setVisiblemdp] = useState(false);
    const [error, setError] = useState("");
    const [loaderVisible, setLoaderVisible] = useState();
    const login = async (event) => {
        event.preventDefault();
        setLoaderVisible(true);
        const formData = new FormData();
        // formData.append("identifiant", userLogin.identifiant);
        // formData.append("mdp", userLogin.mdp);
        // formData.append("op", "login");
        console.log(formData);
        try {
            // eviter les erreurs de caracteres speciaux
            const identifiant = encodeURIComponent(userLogin.identifiant);
            const mdp = encodeURIComponent(userLogin.mdp);
            await fetch(`${link}/login?identifiant=${identifiant}&mdp=${mdp}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((reponse) => reponse.json()).then(async(data) => {
                if(data.status === "success") {
                    await localStorage.setItem("userinfo", JSON.stringify(data.data));
                    navigate("/home");
                }else{
                    if(data.code == 'en_attente') {
                        setError("Votre compte est en attente de validation");
                        setLoaderVisible(false);
                        setVisiblemdp(false);
                        setTimeout(() => {
                            setError("");
                        }, 8000);
                        return;
                    }else if(data.code == 'inactif') {
                        setError("Votre compte est inactif");
                        setLoaderVisible(false);
                        setVisiblemdp(false);
                        setTimeout(() => {
                            setError("");
                        }, 8000);
                        return;
                    }else{
                        setError(data.message);
                    }
                }
                setUserLogin({
                    identifiant: "",
                    mdp: ""
                });

                setLoaderVisible(false);
                setVisiblemdp(false);
                setTimeout(() => {
                    setError("");
                }, 8000);
            }).catch((error) => {
                console.log(error);
                setError("Une erreur s'est produite");
                setLoaderVisible(false);
                setVisiblemdp(false);
                setTimeout(() => {
                    setError("");
                }, 8000);
            })
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="container">
            <div className="login-section">
                <div className="login-header">
                    <img src={logo} alt="logo" className="logo" />
                    <h4>HAKI SYSTEM</h4>
                    <p>Connexion</p>
                </div>

                <form id="loginForm" onSubmit={(event) => login(event)}>
                    <div class="form-group">
                        <label>Identifiant</label>
                        <input type="text" placeholder="Identifiant" required value={userLogin.identifiant} onChange={(e) => setUserLogin({...userLogin, identifiant: e.target.value})} />
                    </div>

                    <div class="form-group">
                        <label>Mot de passe</label>
                        <div class="password-input">
                            <input type={visiblemdp ? "text" : "password"} placeholder="**********" required value={userLogin.mdp} onChange={(e) => setUserLogin({...userLogin, mdp: e.target.value})} />
                            <button type="button" class="password-toggle" onClick={() => setVisiblemdp(!visiblemdp)}>
                                <i className={visiblemdp ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                            </button>
                        </div>
                    </div>
                    {/* error message */}
                    {error && <div class="error-message" align="center">
                        <i class="fas fa-exclamation-circle"></i>
                        <span> {error}</span>
                    </div>}
                    <div class="login-links">
                        <a onClick={() => navigate("/password-reset")}>
                            Mot de passe oublié ?
                        </a>
                        <a onClick={() => navigate("/inscription")}>
                            S'inscrire
                        </a>
                    </div>

                    <button type="submit" class="btn btn-primary" disabled={loaderVisible}>
                        {loaderVisible && <MiniLoader />} Se connecter
                    </button>
                </form>
            </div>
        </div>
    )
}
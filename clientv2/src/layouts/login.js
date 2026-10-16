import { Button, FormGroup, Input } from "../components/minicomp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
    const [userLogin, setUserLogin] = useState({
        identifiant: "",
        mdp: ""
    });
    const [visiblemdp, setVisiblemdp] = useState(false);
    const [errors, setErrors] = useState({
        identifiant: "",
        mdp: ""
    });
    const [loaderVisible, setLoaderVisible] = useState(false);
    const navigate = useNavigate();
    const link = process.env.REACT_APP_LINK;

    const login = async (event) => {
        event.preventDefault();
        if (!userLogin.identifiant || !userLogin.mdp) {
            setErrors({
                identifiant: !userLogin.identifiant ? "Le nom d'utilisateur est requis" : "",
                mdp: !userLogin.mdp ? "Le mot de passe est requis" : ""
            });
            return;
        }
        try {
            // eviter les erreurs de caracteres speciaux
            const identifiant = encodeURIComponent(userLogin.identifiant);
            const mdp = encodeURIComponent(userLogin.mdp);
            setLoaderVisible(true);
            setErrors({
                identifiant: "",
                mdp: ""
            });
            await fetch(`${link}/login?identifiant=${identifiant}&mdp=${mdp}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((reponse) => reponse.json()).then(async(data) => {
                console.log(data);
                if(data.success){
                    if(data.data?.organisation){
                        if(data.data.organisationid){
                            if(data.data.ogstatus =="en attente"){
                                await localStorage.setItem("userinfo", JSON.stringify(data.data));
                                navigate("/waiting");
                            }else if(data.data.ogstatus =="refuse" ){

                                await localStorage.setItem("userinfo", JSON.stringify(data.data));
                                navigate("/waiting");
                            }else if(data.data.ogstatus =="actif" ){
                                await localStorage.setItem("userinfo", JSON.stringify(data.data));
                                navigate("/home");
                            }else {
                                
                            }
                        }else{
                            await localStorage.setItem("userinfo", JSON.stringify(data.data));
                            navigate("/waiting");
                        }
                    }else{
                        if(data.status == "en_attente"){
                            await localStorage.setItem("userinfo", JSON.stringify(data.data));
                            navigate("/waiting");
                        }else if(data.status == "refuse"){
                            await localStorage.setItem("userinfo", JSON.stringify(data.data));
                            navigate("/waiting");
                        }else if(data.status == "success"){
                            await localStorage.setItem("userinfo", JSON.stringify(data.data));
                            navigate("/home");
                        }
                    }
                }else{
                    setErrors({...errors, message: data.message});
                }

                setUserLogin({
                    identifiant: "",
                    mdp: ""
                });
                setLoaderVisible(false);
                setVisiblemdp(false);
                setTimeout(() => {
                    setErrors({identifiant: "", mdp: "", message: ""});
                }, 8000);
            }).catch((error) => {
                console.log(error);
                setErrors({...errors, message: "Une erreur s'est produite"});
                setLoaderVisible(false);
                setVisiblemdp(false);
                setTimeout(() => {
                    setErrors({...errors, message: ""});
                }, 8000);
            })
        } catch (error) {
            console.log(error);
        }
    }
    return (
        
        <div class="auth-container">
            <div class="auth-sidebar">
                <div class="logo">
                    <div class="logo-icon">H</div> HAKI System
                </div>
                <h2>Connectez-vous à votre compte.</h2>
                <p>Connectez-vous à votre compte pour accéder à votre tableau de bord et gérer vos signalements.</p>
            </div>
            <div className="auth-form">
                <form style={{maxWidth: "450px", background: "white", padding: "24px", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", margin:"auto"}} onSubmit={login}>
                    <h1 style={{textAlign: "center"}}>Se connecter</h1>
                    <p style={{textAlign: "center", marginTop: "24px", fontSize: "0.9rem", color: "var(--text-muted)"}}>Connectez-vous à votre compte pour accéder à votre tableau de bord et gérer vos signalements.</p>
                    <br />
                    <FormGroup icone={"user"} label={"Nom d'utilisateur"} error={errors.mdp}>
                        <Input placeholder={"Nom d'utilisateur"} onChange={(value) => setUserLogin({...userLogin, identifiant: value})} value={userLogin.identifiant} required={true} type={"text"}/>
                    </FormGroup>
                    <FormGroup icone={"lock"} label={"Mot de passe"} error={errors.mdp}>
                        <Input placeholder={"Mot de passe"} onChange={(value) => setUserLogin({...userLogin, mdp: value})} value={userLogin.mdp} required={true} type={visiblemdp?"text":"password"} button={visiblemdp?"Masquer":"Afficher"} onClick={() => setVisiblemdp(!visiblemdp)} />
                    </FormGroup>

                    {errors.message ? (
                        <p style={{color: "red", textAlign: "center", marginTop: "24px"}}>{errors.message}</p>
                    ) : null}

                    <p style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px"}} class="auth-footer">
                        <label class="checkbox-label">
                            <input type="checkbox" />
                            <span>Rester connecté(e).</span>
                        </label>
                        <a href="#">Mot de passe oublié ?</a>
                    </p>
                    <Button label={"Se connecter"} type={"submit"} variant={"primary"} size="block" loader={loaderVisible} />
                    <p className="auth-footer" style={{textAlign: "center", marginTop: "24px"}}>Vous n'avez pas de compte ? <a href="#">Inscrivez-vous</a></p>
                    <p className="auth-footer" style={{textAlign: "center", marginTop: "24px"}}>Vous préférez signaler sans compte ? <a href="/signaler">Signaler</a></p>
                    <p className="auth-footer" style={{textAlign: "center", marginTop: "24px"}}>Vous aimeriez suivre votre signalement ? <a href="/suiviedossier">suivre vos signalements</a></p>
                    
                </form>
            </div>
        </div>
    );
}
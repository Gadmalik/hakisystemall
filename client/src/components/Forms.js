'use client';
import { useEffect, useState } from "react";
import { Loader, MiniLoader } from "./MiniComp";
import { Editor } from "./Editor";
const link = process.env.REACT_APP_LINK;
export function FormUser({data, hideModal}){
    return (
        <form id="userForm">
            <div class="modal-form-grid">
                <div class="modal-form-group required">
                    <label>Noms complets</label>
                    <input type="text" placeholder="Marie Curie" required/>
                </div>
                
                <div class="modal-form-group required">
                    <label>Téléphone</label>
                    <input type="tel" placeholder="+243 81 234 5678" required/>
                </div>
                
                <div class="modal-form-group required">
                    <label>Email</label>
                    <input type="email" placeholder="marie.curie@example.com" required/>
                </div>
                
                <div class="modal-form-group required">
                    <label>Mot de passe</label>
                    <input type="password" placeholder="Minimum 8 caractères" required/>
                </div>
                
                <div class="modal-form-group required">
                    <label>Code d'accès</label>
                    <input type="text" placeholder="USER-2024-001" required/>
                </div>
                
                <div class="modal-form-group required">
                    <label>Catégorie</label>
                    <select id="userCategorie" required>
                        <option value="">Sélectionner...</option>
                        <option value="entreprise">Entreprise</option>
                        <option value="juriste">Juriste</option>
                        <option value="autres">Autres</option>
                    </select>
                </div>
                
                <div class="modal-form-group full-width" id="adresseField" >
                    <label>Adresse</label>
                    <textarea rows="3" placeholder="Adresse complète..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" onClick={hideModal}>Annuler</button>
                <button class="btn btn-primary" type="submit">Enregistrer</button>
            </div>
        </form>
    )
}

export function FormSignaler ({data, hideModal, onSubmit}) {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userinfo")));
    const [visibleLoader, setVisibleLoader] = useState(false);
    const [listTypeIncident, setListTypeIncident] = useState([]);
    const [nomfichier, setNomFichier] = useState("");
    const [Signalement, setSignalement] = useState({
        type: "",
        date: "",
        lieu: "",
        description: "",
        piecesJointes: [],
    });

    const envoyerindicent = async (event) => {
        event.preventDefault();
        setVisibleLoader(true);
        try{
            await fetch(`${link}/incident`, {
                method:"post",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({...Signalement, userid: user.userid})
            }).then((reponse) => reponse.json()).then((datas) => {
                if(datas.status == "success"){
                    alert("Signalement envoyé avec succès");
                    hideModal();
                    onSubmit();
                }
            })
            setVisibleLoader(false);
        }catch(error){
            console.log(error);
            setVisibleLoader(false);
        }
    }
    const loadTypeIncident = async () => {
        setVisibleLoader(true);
        try {
            await fetch(`${link}/get_categorie`, {
                method: "get",
            }).then((reponse) => reponse.json()).then((data) => {
                setListTypeIncident(data?.data);
                setVisibleLoader(false);
            }).catch((error) => {
                console.log(error);
                setVisibleLoader(false);
            });
        } catch (error) {
            console.log(error);
            setVisibleLoader(false);

        }
    }
    useEffect(() => {
        loadTypeIncident();
    }, [])
    return (
    <>
        {visibleLoader &&<Loader />}
        <p class="modal-subtitle">Tous les champs marqués d'un <span class="required">*</span> sont obligatoires.</p>

            <form id="reportForm" onSubmit={(event) => envoyerindicent(event)}>

                <div class="modal-form-group required">
                    <label>Type d'incident</label>
                    <select required onChange={(e) => setSignalement({...Signalement, type: e.target.value})}>
                        <option value="" disabled selected>Choisissez une catégorie</option>
                        {listTypeIncident.map((item) => (
                            <option key={item.categorie_id} value={item.categorie_id}>{item.designation}</option>
                        ))}
                    </select>
                </div>
                <div class="modal-form-grid">
                    <div class="modal-form-group required">
                        <label>Date</label>
                        <input type="date" required onChange={(e) => setSignalement({...Signalement, date: e.target.value})}/>
                    </div>
                    <div class="modal-form-group required">
                        <label>Lieu</label>
                        <input type="text" placeholder="Ville, quartier..." required onChange={(e) => setSignalement({...Signalement, lieu: e.target.value})}/>
                    </div>
                </div>

                <div class="modal-form-group required">
                    <label>Description des faits</label>
                    <textarea rows="4" placeholder="Décrivez ce qui s'est passé..." required onChange={(e) => setSignalement({...Signalement, description: e.target.value})}>{Signalement.description}</textarea>
                </div>
                {/* <div class="modal-form-group">
                    <label>Pièces jointes (photos, documents)</label>
                    <div class="file-upload">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>Cliquez pour ajouter des fichiers</p>
                        {}
                        <small>Max 20 Mo (PDF, JPG, PNG)</small>
                        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => {setNomFichier(e.target.files[0].name); setSignalement({...Signalement, piecesJointes: e.target.files})}}  />
                    </div>
                </div> */}

                <div class="modal-form-group required">
                    <label class="checkbox">
                        <input type="checkbox" required/>
                        <span>Je certifie l'exactitude des informations</span>
                    </label>
                </div>

                <div align="right">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i> Envoyer
                    </button>
                </div>
            </form>
            <div class="modal-footer">
                <i class="fas fa-lock"></i>
                <span>Signalement chiffré et confidentiel</span>
            </div>
    </>)
}

export function FormTypeIncident ({data, hideModal}){

    const link = process.env.LINK_BACKEND;
    const [typeincident, setTypeincident] = useState({
        designation:"",
        niveau:"",
    })
    const [error, setError] = useState("");
    const [visibleLoader, setVisibleLoader] = useState(false);
    const ajouter = async (event) => {
        event.preventDefault();

        setVisibleLoader(true);
        await fetch(`${link}/add_categorie`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(typeincident),
        }).then((res) => res.json()).then((data) => {
            console.log(data);
            
            setVisibleLoader(false);
            if(data.status =="success"){
                alert("Categorie d'incident ajoutée avec succès !");
                hideModal();
                setTypeincident({
                    designation:"",
                    niveau:""
                });
                setError("")
            }else{
                setError(data.message);
            }
        }).catch((error) => {
            setError("Une erreur s'est produite ! ");
            console.error(error);
            setVisibleLoader(false);
        })
    } 
    return (
        <form id="incidentForm" onSubmit={(event) => ajouter(event)}>
            <div class="modal-form-grid">
                <div class="modal-form-group required">
                    <label>Designation de l'incident</label>
                    <input type="text" placeholder="Ex: Fraude, Corruption..." value={typeincident.designation} onChange={(event) => setTypeincident({...typeincident, designation:event.target.value})} required />
                </div>
                
                <div class="modal-form-group required">
                    <label>Niveau d'inquiétude</label>
                    <select id="incidentNiveau" value={typeincident.niveau} onChange={(event) => setTypeincident({...typeincident, niveau:event.target.value})} required>
                        <option value="">Sélectionner...</option>
                        <option value="faible">Faible</option>
                        <option value="moyen">Moyen</option>
                        <option value="eleve">Élevé</option>
                        <option value="critique">Critique</option>
                    </select>
                </div>
            </div>
            {error && <div class="error-message" align="center">
                <i class="fas fa-exclamation-circle"></i>
                <span> {error}</span>
            </div>}

            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" onClick={hideModal}>Annuler</button>
                <button class="btn btn-primary" type="submit" disabled={visibleLoader}>{visibleLoader && <MiniLoader />} Enregistrer</button>
            </div>
        </form>);
}

export function FormArticle({data, hideModal, loadArticles}){
    const [article, setArticle] = useState({
        titre:"",
        file:[],
        contenu:""
    });
    const addArticle = async (event) => {
        console.log(data);
        event.preventDefault();
        console.log(article);
        const formData = new FormData();
        formData.append("titre", article.titre);
        formData.append("contenu", article.contenu);
        formData.append("file", article.file);
        formData.append("userid", data.userid);
        await fetch(`${link}/add_article`, {
            method:"post",
            body: formData,
        }).then((res) => res.json()).then((data) => {
            if(data.status == "success"){
                alert("Article ajouté avec succès !");
                setArticle({
                    titre:"",
                    file:[],
                    contenu:""
                });
                hideModal();
                data.loadArticles();
            }else{
                alert(data.message);
            }
            
        }).catch((error) => {
            console.error(error);
        })
    }
    return <form onSubmit={(event) => addArticle(event)}>
        <div class="modal-form-group required">
            <label>Titre de l'article</label>
            <input type="text" placeholder="Titre" value={article.titre} onChange={(event) => setArticle({...article, titre:event.target.value})} required />
        </div>
        <div class="modal-form-group required">
            <label>Contenu de l'article</label>
            <Editor content={article.contenu} setContent={(value) => setArticle({...article, contenu:value})} />
        </div>
        <div class="modal-form-group required">
            <label>Pièces jointes (photos, documents)</label>
            <div class="file-upload">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Cliquez pour ajouter des fichiers</p>
                <small>Max 20 Mo (PDF, JPG, PNG)</small>
                <input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setArticle({...article, file:event.target.files[0]})} />
            </div>
            {/* {(article.file != []) && (
                <div class="file-preview">
                    <i class={`fas fa-file-${article.file.type.split("/")[1] === "jpeg" ? "image" : article.file.type.split("/")[1] === "pdf" ? "pdf" : "file"}`}></i>
                    <span>{article.file.name}</span>
                </div>
            )} */}
        </div>
        <div class="modal-form-group required">
            <label class="checkbox">
                <input type="checkbox" required/>
                <span>Je certifie l'exactitude des informations</span>
            </label>
        </div>
        <div class="modal-buttons">
            <button type="button" class="btn btn-cancel" id="cancelReportBtn">Annuler</button>
            <button type="submit" class="btn btn-primary">
                <i class="fas fa-paper-plane"></i> Envoyer
            </button>
        </div>
    </form>
} 

export function FormEditProfile({data, hideModal}){
    const [userinfo, setUserinfo] = useState({...data, password:"", confirmPassword:"", oldPassword:""});
    const [error, setError] = useState("");
    const [visibleLoader, setVisibleLoader] = useState(false);
    const updateProfile = async (event) => {
        event.preventDefault();
        if(userinfo.password !== userinfo.confirmPassword){
            setError("Les mots de passe ne correspondent pas !");
            return;
        }
        setVisibleLoader(true);
        await fetch(`${link}/updateprofile`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(userinfo),
        }).then((res) => res.json()).then((data) => {
            console.log(data);
            
            setVisibleLoader(false);
            if(data.status =="success"){
                alert("Profil mis à jour avec succès !");
                hideModal();
                setError("")
            }else{
                setError(data.message);
            }
        }).catch((error) => {
            setError("Une erreur s'est produite ! ");
            console.error(error);
            setVisibleLoader(false);
        })
    } 
    useEffect(() => {
        if(data){
            setUserinfo({
                noms:data.noms ? data.noms : "",
                adresse:data.adresse ? data.adresse : "",
                phone:data.phone ? data.phone : "",
                email:data.email ? data.email : "",
                password:data.password ? data.password : "",
                username:data.username ? data.username : "",
                confirmPassword:data.confirmPassword ? data.confirmPassword : "",
                oldPassword:data.oldPassword ? data.oldPassword : "",
            });
        }
    }, [data]);
    return (
        <form id="profileForm" onSubmit={(event) => updateProfile(event)}>
            <div class="modal-form-grid">
                <div class="modal-form-group required">
                    <label>Noms</label>
                    <input type="text" placeholder="Noms" value={userinfo.noms} onChange={(event) => setUserinfo({...userinfo, noms:event.target.value})} required />
                </div>
                <div class="modal-form-group required">
                    <label>Adresse</label>
                    <input type="text" placeholder="Adresse" value={userinfo.adresse} onChange={(event) => setUserinfo({...userinfo, adresse:event.target.value})} required />
                </div>
                <div class="modal-form-group required">
                    <label>Telephone</label>
                    <input type="text" placeholder="Telephone" value={userinfo.phone} onChange={(event) => setUserinfo({...userinfo, phone:event.target.value})} required />
                </div>
                <div class="modal-form-group required">
                    <label>Email</label>
                    <input type="email" placeholder="Email" value={userinfo.email} onChange={(event) => setUserinfo({...userinfo, email:event.target.value})} required />
                </div>
                {/* ancien mot de passe  */}
                <div class="modal-form-group required">
                    <label>Ancien mot de passe</label>
                    <input type="password" placeholder="Ancien mot de passe" value={userinfo.oldPassword} onChange={(event) => setUserinfo({...userinfo, oldPassword:event.target.value})} required />
                </div>
                <div class="modal-form-group required">
                    <label>Nouveau mot de passe</label>
                    <input type="password" placeholder="Nouveau mot de passe" value={userinfo.password} onChange={(event) => setUserinfo({...userinfo, password:event.target.value})} required />
                </div>
                <div class="modal-form-group required">
                    <label>Confirmer le nouveau mot de passe</label>
                    <input type="password" placeholder="Confirmer le nouveau mot de passe" value={userinfo.confirmPassword} onChange={(event) => setUserinfo({...userinfo, confirmPassword:event.target.value})} required />
                </div>
            </div>
            {error && <div class="error-message" align="center">
                <i class="fas fa-exclamation-circle"></i>
                <span> {error}</span>
            </div>}

            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" onClick={hideModal}>Annuler</button>
                <button class="btn btn-primary" type="submit" disabled={visibleLoader}>{visibleLoader && <MiniLoader />} Enregistrer</button>
            </div>
        </form>);
}

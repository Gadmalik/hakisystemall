import pool from "./db.js";
import express from "express";
import cors from "cors";
import path from "path";
import { addArticle, getArticle, getDossier, getUser, setEtatAttribut, suivreDossier, updateProfile } from "./queries.js";
import multer from "multer";
import { fileURLToPath } from 'url';
import { AddUtilisateur, AddUtilisateurOrg, getUserByCode, GetUtilisateur, login, SetMdpUtilisateur } from "./services/utilisateurs.js";
import { ConfirmMail, ConfirmOrgMail } from "./services/mailsModel.js";
import { sendMail } from "./services/mail.js";
import { AddSignalement, getIncidentById, getIncidentByUser, getIncidentOrienteByOrganisationId, getIncidentOrienteByUserId, getIncidentSuivieByUserId, getIncidentStats } from "./services/incident.js";
import { SendNotification, SubscribeUser } from "./services/notification.js";
import { actionOrganisations, addOrganisation, assignerdomaine, getOrganisation, getOrganisations, getTypeOrganisation } from "./services/organisation.js";
import { addAssignerCategorieUtilisateur, addCategorieUtilisateurOrg, addCatUtilisateur, getcategorieutilisateurOrg, getCatUtilisateur, getDefaultCategorieUtilisateur, getFonctionnalitesByCategorieutilisateurs, getUtilisateursByOrganisationId } from "./services/categorieutilisateurs.js";
import { addFonctionnalites, getFonctionnalites, updateFonctionnalites } from "./services/fonctionnalites.js";

// recréer __filename et __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({dest:"uploads"});
const uploadlogo = multer({dest:"uploads/logo"});
const uploadannexes = multer({dest:"uploads/annexes"});
const app = express();
app.use(express.json());
app.use(cors());

app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM utilisateurs");
        res.json({data: result.rows, status:"success", code:"success"});
    } catch (error) {
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:""})
    }
});

app.get("/users/:organisationid", async (req, res) => {
    try {
        const {organisationid} = req.params;
        const result = await getUtilisateursByOrganisationId({organisationid});
        res.json(result);
    } catch (error) {
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:""})
    }
});

app.get("/login", async (req, res) => {
    try{
        const {identifiant, mdp} = req.query;
        const result = await login({identifiant, mdp});
        res.json(result);
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:""})
    }
})
app.post("/user", async (req, res) => {
    try{
        const {nom, prenom, phone, email, username, categorie, mdp, adresse =""} = req.body;
        const malik = "";
        const date = new Date();
        const date_create = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const code = Math.floor(100000 + Math.random() * 900000);
        const textmail = ConfirmMail(`${nom} ${prenom}`, code);
        const result = await AddUtilisateur({nom, prenom, phone, email, username, categorieutilisateurid:categorie , mdp, adresse, date_create,code});
        console.log(result);
        if(result.success && Object.keys(result.data).length < 1){
            const sendmail = await sendMail({to:email, subject:"Confirmation de votre compte", text:textmail});
            if(!sendmail.success){
                res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: sendmail.error});
            }
        }
        res.json(result);
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
})

app.post("/user/:organisationid", async (req, res) => {
    try{
        const {organisationid} = req.params;
        const organisation = await getOrganisation({organisationid});

        if(organisation.success){
            const {nom, prenom, phone, email, username, categorie, adresse =""} = req.body;
            console.log(req.body);
            const date = new Date();
            const date_create = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            const code = Math.floor(100000 + Math.random() * 900000);
            const textmail = ConfirmOrgMail(`${nom} ${prenom}`, email, code, organisation.data.designation);
            const result = await AddUtilisateurOrg({nom, prenom, phone, email, username, categorie, adresse, date_create,code});
            if(result.status){
                const sendmail = await sendMail({to:email, subject:"Invitation - "+organisation.data.designation, text:textmail});
                if(!sendmail.success){
                    res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: sendmail.error});
                }
            }
            res.json(result);
        }else{
            res.json({message:"Organisation non trouvée!", status:"error", code:"", error: "organisation not found", success: false});
        }
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
})

app.put("/user/mdp", async (req, res) => {
    try{
        const {userid, mdp} = req.body;
        const result = await SetMdpUtilisateur({userid, mdp});
        res.json(result);
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
});

app.put("/user/code", async (req, res) => {
    try{
        const {code, email} = req.body;
        const result = await getUserByCode({code, email});
        res.json(result);
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
})

app.get("/getfonctionnalitebycategorieutilisateur/:categorieutilisateurid/:type", async (req, res) => getFonctionnalitesByCategorieutilisateurs(req, res));

app.get("/user/:id", async (req, res) => GetUtilisateur(req, res));

app.get("/categorieutilisateur", async (req, res) => getCatUtilisateur(req, res));

app.get("/getdefaultcategorieutilisateur", async (req, res) => getDefaultCategorieUtilisateur(req, res));

app.post("/categorieutilisateur", async (req, res) => addCatUtilisateur(req, res));

app.get("/getincidentorientebyorganisationid/:organisationid/:userid", async (req, res) => getIncidentOrienteByOrganisationId(req, res));

app.get("/getincidentorientebyuserid/:userid", async (req, res) => getIncidentOrienteByUserId(req, res));

app.get("/getincidentsuiviebyuserid/:userid", async (req, res) => getIncidentSuivieByUserId(req, res));

app.get("/categorie_incident", async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM categorie_incident");
        res.json({data: result.rows, status:"success", code:"success"});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
})
app.post("/add_categorie", async (req, res) => {
    try{
        const {designation, niveau} = req.body;
        const date = new Date();
        const date_create = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const verif = await pool.query("SELECT * FROM categorie_incident WHERE designation=$1", [designation]);
        if(verif.rowCount > 0){
            res.json({status:"error", code:"designation_used", message:"Cette categorie d'incident existe !"});
            return;
        }
        const add = await pool.query("INSERT INTO categorie_incident(designation, date, etat, niveau) VALUES($1, $2, $3, $4)", [designation, date_create, "actif", niveau])
        res.json({data: add.rows[0], status:"success", code:"success"});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
})

app.get("/get_categorie", async (req, res) => {
    try{
        const types = await pool.query("SELECT * FROM categorie_incident WHERE etat='actif'");
        res.json({status:"success", data:types.rows});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"error", error});
    }
})

app.get("/typeorganisation", async (req, res) => {
    try{
        const reponse = await getTypeOrganisation();
        res.json({...reponse});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"error", error});
    }
})

app.post("/organisation/add",uploadlogo.single("logo_url"), async (req, res) => {
    try{
        const logo_url = req.file ? `/logo/${req.file.filename}` : null;
        console.log(logo_url);
        const {designation, sigle, typeorganisationid, pays, province, ville, adresse_org, phone_org, email_org, site_web, reseaux_sociaux, userid} = req.body;
        const reponse = await addOrganisation({designation, sigle, typeorganisationid, pays, province, ville, adresse_org, phone_org, email_org, site_web, reseaux_sociaux, logo_url, userid});
        res.json({...reponse});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
})

app.get("/organisations", async (req, res) => {
    try{
        const reponse = await getOrganisations();
        res.json({...reponse});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"error", error});
    }
})

app.post("/organisation/:action", async (req, res) => {
    try{
        const {action} = req.params;
        const reponse = await actionOrganisations({action, ...req.body});
        res.json({...reponse});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
})

app.post("/categorieutilisateurorg", async (req, res) => {
    try{
        const {libelle, description, organisationid, userid, fonctionnalites} = req.body;
        const reponse = await addCategorieUtilisateurOrg({libelle, description, organisationid, userid, fonctionnalites});
        res.json({...reponse});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
})

app.get("/getcategorieutilisateurorg/:organisationid", async (req, res) => {
    try {
        const {organisationid} = req.params;
        const reponse = await getcategorieutilisateurOrg({organisationid});
        res.json({...reponse});
    } catch (error) {
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
})

app.post("/assignerdomaine", async (req, res) => assignerdomaine(req, res));


app.post("/incident", uploadannexes.array("annexe", 5), async (req, res) => {
    try{
        const date_create = new Date().toISOString().split('T')[0];
        const {categorieid,lieu,description,date,userid,contact,genre,trancheage, iscontact} = req.body;
        const annexes = req.files ? req.files.map(file => ({ 
            path: file.path, 
            filename: file.originalname,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`, 
            mimetype: file.mimetype,
            url: `/uploads/annexes/${file.filename}`
        })) : [];
        const reponse = await AddSignalement({
            categorieid: parseInt(categorieid, 10),
            date,
            lieu,
            description,
            date_create,
            userid: userid ? parseInt(userid, 10) : null,
            contact,
            genre,
            trancheage: trancheage ? parseInt(trancheage, 10) : null,
            iscontact: iscontact === 'true' || iscontact === true,
            annexes
        });
        res.json(reponse);
    }catch(error){
        console.log("Error in /incident:", error);
        res.status(500).json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
})

app.get("/incident/stats", async (req, res) => getIncidentStats(req, res));
app.get("/incident_stats", async (req, res) => getIncidentStats(req, res));

app.get("/incident/:userid", async (req, res) => {
    try{
        const {userid} = req.params;
        const reponse = await getIncidentByUser({userid});
        res.json({...reponse});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
})

app.get("/signalement/:signalementid", async (req, res) => getIncidentById(req, res));
app.get("/signalement/:signalementid/:cond", async (req, res) => getIncidentById(req, res));

app.post("/notification/subscribe", async (req, res) => {
    try{
        const {subscription, userid} = req.body;
        const reponse = await SubscribeUser({subscription, userid});
        res.json({...reponse});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
})

app.post("/notification/send", async (req, res) => {
    try{
        const {userid, title, body, url} = req.body;
        const reponse = await SendNotification({userid, title, body, url});
        res.json({...reponse});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
})

app.get("/getincident", async (req, res) => {
    try{
        const { limit, userid, status, categorieid, niveau, search, all } = req.query;
        const datas = await getDossier({ 
            userid, 
            limit, 
            status, 
            categorieid, 
            niveau, 
            search, 
            all: all || (!userid ? "true" : undefined) 
        });
        res.json({...datas});
    }catch(error){
        console.log("Error in /getincident:", error);
        res.status(500).json({message:"Une erreur s'est produite !", status:"error", code:"", error});
    }
})

app.post("/suivredossier", async (req, res) => {
    const {userid, dossierid, organisationid, commentiare, type, status, orientationid} = req.body;
    const reponse = await suivreDossier({userid, dossierid, organisationid, commentiare, type, status, orientationid});
    res.json({...reponse});
});

app.post("/set_etat_attribut", async (req, res) => {
    const {attribuerid, status} = req.body;
    const reponse = await setEtatAttribut({attribuerid, status});
    res.json({...reponse});
});

app.post("/add_article", upload.single("file"), async (req, res) => {
    try{
        const {titre, contenu, userid} = req.body;
        const piecesJointe = req.file.filename;
        const typepiece = req.file.mimetype;
        const reponse = await addArticle({titre, contenu, piecesJointe, typepiece, userid});
        res.json({...reponse});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error});
    }
})

app.get("/getarticle", async (req, res) => {
    try{
        const datas = await getArticle({articleid: req.query.articleid, filter: req.query.filter});
        res.json({...datas});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error});
    }
})

app.get("/getuser", async (req, res) => {
    try{
        const datas = await getUser({username: req.query.username});
        res.json({...datas});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error});
    }
})

app.post("/updateprofile", async (req, res) => {
    try{
        const {username, noms, adresse, phone, email, password, oldPassword} = req.body;
        const reponse = await updateProfile({username, noms, adresse, phone, email, password, oldPassword});
        res.json({...reponse});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error});
    }
})

app.post("/fonctionnalite", (req, res, next) => addFonctionnalites(req, res, next))
app.get("/fonctionnalites", (req, res, next) => getFonctionnalites(req, res, next))
app.put("/fonctionnalite", (req, res, next) => updateFonctionnalites(req, res, next))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(5001, () => {
    console.log("Server is running on port 5001");
});


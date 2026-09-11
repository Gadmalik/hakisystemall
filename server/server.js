import pool from "./db.js";
import express from "express";
import cors from "cors";
import path from "path";
import { addArticle, getArticle, getDossier, getUser, setEtatAttribut, suivreDossier, updateProfile } from "./queries.js";
import multer from "multer";
import { fileURLToPath } from 'url';
import { AddUtilisateur, AddUtilisateurOrg, getCategorieUtilisateur, getUserByCode, login, SetMdpUtilisateur } from "./services/utilisateurs.js";
import { ConfirmMail, ConfirmOrgMail } from "./services/mailsModel.js";
import { sendMail } from "./services/mail.js";
import { AddSignalement, getIncidentByUser } from "./services/incident.js";
import { SendNotification, SubscribeUser } from "./services/notification.js";
import { actionOrganisations, addOrganisation, getOrganisation, getOrganisations, getTypeOrganisation } from "./services/organisation.js";
import { addAssignerCategorieUtilisateur, addCategorieUtilisateurOrg, getcategorieutilisateurOrg, getUtilisateursByOrganisationId } from "./services/categorieutilisateurs.js";

// recréer __filename et __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({dest:"uploads"});
const uploadlogo = multer({dest:"uploads/logo"});
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
        const {nom, prenom, phone, email, username, categorie, adresse =""} = req.body;
        console.log(req.body)
        const malik = "";
        const date = new Date();
        const date_create = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const code = Math.floor(100000 + Math.random() * 900000);
        const textmail = ConfirmMail(`${nom} ${prenom}`, code);
        const result = await AddUtilisateur({nom, prenom, phone, email, username, categorie, adresse, date_create,code});
        if(result.status){
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

app.get("/categorieutilisateur", async (req, res) => {
    try{
        const result = await getCategorieUtilisateur();
        res.json(result);
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
})

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
        const {libelle, description, organisationid, userid} = req.body;
        const reponse = await addCategorieUtilisateurOrg({libelle, description, organisationid, userid});
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

app.post("/incident", async (req, res) => {
    try{
        const {type,date,lieu,description,userid} = req.body;
        const date_create = new Date().toISOString().split('T')[0];
        const reponse = await AddSignalement({type,date,lieu,description,date_create,userid});
        res.json({...reponse});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
})

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
        const datas = await getDossier({userid: req.query.userid});
        res.json({...datas});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error});
    }
})

app.post("/suivredossier", async (req, res) => {
    const {userid, dossierid} = req.body;
    const reponse = await suivreDossier({userid, dossierid});
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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(5001, () => {
    console.log("Server is running on port 5001");
});


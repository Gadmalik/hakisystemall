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
        const { limit, userid, status, categorieid, niveau, search, all, libre } = req.query;
        const datas = await getDossier({ 
            userid, 
            limit, 
            status, 
            categorieid, 
            niveau, 
            search, 
            libre: libre || (status === "libre" || status === "libres" ? "true" : undefined),
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

// ---------------- Notifications In-App & Push Test ----------------
// Initialisation de la table notifications si non existante
pool.query(`
    CREATE TABLE IF NOT EXISTS public.notifications (
        id SERIAL PRIMARY KEY,
        userid INTEGER,
        title VARCHAR(255),
        body TEXT,
        url VARCHAR(255),
        lu BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`).catch(err => console.log("Init notifications table note:", err.message));

app.get("/notifications/:userid", async (req, res) => {
    try {
        const { userid } = req.params;
        const result = await pool.query(
            "SELECT * FROM notifications WHERE userid = $1 ORDER BY id DESC LIMIT 30",
            [parseInt(userid, 10)]
        );
        res.json({ status: "success", success: true, data: result.rows });
    } catch (error) {
        console.log("Error in /notifications/:userid:", error);
        res.json({ status: "success", success: true, data: [] });
    }
});

app.post("/notifications/mark-read", async (req, res) => {
    try {
        const { userid, notificationid } = req.body;
        if (notificationid) {
            await pool.query("UPDATE notifications SET lu = true WHERE id = $1", [notificationid]);
        } else if (userid) {
            await pool.query("UPDATE notifications SET lu = true WHERE userid = $1", [userid]);
        }
        res.json({ status: "success", success: true, message: "Notifications marquées comme lues" });
    } catch (error) {
        console.log("Error in /notifications/mark-read:", error);
        res.status(500).json({ status: "error", success: false, message: error.message });
    }
});

app.post("/notification/test-push", async (req, res) => {
    try {
        const { userid } = req.body;
        const clienturl = process.env.CLIENT_URL || "http://localhost:3000";
        await SendNotification({
            userid: parseInt(userid, 10),
            title: "🔔 Test de notification Push",
            body: "Les notifications push HAKI SYSTEM sont correctement configurées et fonctionnelles !",
            url: `${clienturl}/home/dashboard`
        });
        // Ajouter aussi en in-app
        try {
            await pool.query(
                "INSERT INTO notifications (userid, title, body, url, lu, created_at) VALUES ($1, $2, $3, $4, false, CURRENT_TIMESTAMP)",
                [parseInt(userid, 10), "🔔 Test de notification Push", "Les notifications push HAKI SYSTEM sont correctement configurées !", `${clienturl}/home/dashboard`]
            );
        } catch(e){}
        res.json({ status: "success", success: true, message: "Notification de test envoyée avec succès !" });
    } catch (error) {
        console.log("Error in /notification/test-push:", error);
        res.status(500).json({ status: "error", success: false, message: error.message });
    }
});

// ---------------- Centre des Mails & Modèles ----------------
app.get("/mail/config", async (req, res) => {
    const hasApiKey = !!process.env.RESEND_API_KEY;
    res.json({
        success: true,
        status: "success",
        data: {
            configured: hasApiKey,
            mode: hasApiKey ? "production (Resend API)" : "simulation (mode développement)",
            fromEmail: process.env.NO_REPLAY_MAIL || "HAKI SYSTEM <no-reply@hakisystem.net>",
            supportedTemplates: [
                { id: "confirm", name: "Confirmation de compte", description: "Code de vérification à 6 chiffres envoyé lors de l'inscription" },
                { id: "confirm_org", name: "Invitation Organisation", description: "Lien d'invitation pour rejoindre une structure" },
                { id: "alert_domaine", name: "Alerte nouveau signalement (Domaine)", description: "Notifie automatiquement les organisations dont le domaine correspond au signalement" },
                { id: "status_org", name: "Statut Organisation", description: "Mise à jour du statut d'une organisation (validée, suspendue)" }
            ]
        }
    });
});

app.post("/mail/test", async (req, res) => {
    try {
        const { to, template, nom, organisation, code } = req.body;
        if (!to) {
            return res.status(400).json({ success: false, message: "Adresse email requise" });
        }
        let htmlContent = "";
        let subject = "Test HAKI SYSTEM";

        if (template === "confirm_org") {
            subject = `Invitation à rejoindre ${organisation || "l'Organisation"}`;
            htmlContent = ConfirmOrgMail(nom || "Partenaire", to, code || "123456", organisation || "Organisation Test");
        } else if (template === "alert_domaine") {
            subject = "[Alerte] Nouveau signalement dans votre domaine";
            htmlContent = ConfirmMail(nom || "Responsable de veille", code || "HSY-TEST");
        } else if (template === "status_org") {
            subject = "Mise à jour de votre statut organisation";
            htmlContent = ConfirmMail(nom || "Directeur", "ACTIF");
        } else {
            subject = "Code de confirmation de compte";
            htmlContent = ConfirmMail(nom || "Utilisateur Test", code || "789123");
        }

        const result = await sendMail({ to, subject, text: htmlContent });
        res.json({ ...result, message: result.simulated ? "Email simulé dans la console (en dev)" : "Email envoyé avec succès !" });
    } catch (error) {
        console.log("Error in /mail/test:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ---------------- Gestion des Catégories d'incidents / Domaines ----------------
app.put("/categorie_incident/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { designation, niveau, etat } = req.body;
        const result = await pool.query(
            "UPDATE categorie_incident SET designation = COALESCE($1, designation), niveau = COALESCE($2, niveau), etat = COALESCE($3, etat) WHERE categorie_id = $4 RETURNING *",
            [designation, niveau, etat, parseInt(id, 10)]
        );
        res.json({ success: true, status: "success", message: "Catégorie mise à jour avec succès", data: result.rows[0] });
    } catch (error) {
        console.log("Error in PUT /categorie_incident/:id:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post("/categorie_incident/:id/toggle", async (req, res) => {
    try {
        const { id } = req.params;
        const current = await pool.query("SELECT etat FROM categorie_incident WHERE categorie_id = $1", [parseInt(id, 10)]);
        const newEtat = current.rows[0]?.etat === "actif" ? "inactif" : "actif";
        const result = await pool.query(
            "UPDATE categorie_incident SET etat = $1 WHERE categorie_id = $2 RETURNING *",
            [newEtat, parseInt(id, 10)]
        );
        res.json({ success: true, status: "success", message: `Catégorie ${newEtat === 'actif' ? 'activée' : 'désactivée'}`, data: result.rows[0] });
    } catch (error) {
        console.log("Error in toggle /categorie_incident:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ---------------- Admin Global Stats ----------------
app.get("/admin/stats", async (req, res) => {
    try {
        const orgRes = await pool.query(`
            SELECT 
                COUNT(*) AS total,
                COUNT(CASE WHEN status = 'actif' THEN 1 END) AS actives,
                COUNT(CASE WHEN status = 'en attente' OR status IS NULL THEN 1 END) AS en_attente,
                COUNT(CASE WHEN status = 'refuse' OR status = 'désactivé' THEN 1 END) AS suspendues
            FROM organisation
        `);

        const userRes = await pool.query(`
            SELECT 
                COUNT(*) AS total,
                COUNT(CASE WHEN etat = 'actif' THEN 1 END) AS actifs,
                COUNT(CASE WHEN etat = 'en attente' THEN 1 END) AS en_attente,
                COUNT(CASE WHEN type = 'main' THEN 1 END) AS admin_principaux,
                COUNT(CASE WHEN type = 'second' THEN 1 END) AS membres_org
            FROM utilisateurs
        `);

        const incidentRes = await pool.query(`
            SELECT 
                COUNT(*) AS total,
                COUNT(CASE WHEN NOT EXISTS (SELECT 1 FROM attribuerdossier ad WHERE ad.dossierid = inc.id_incident AND ad.status NOT IN ('refusé','abandonné')) THEN 1 END) AS libres,
                COUNT(CASE WHEN EXISTS (SELECT 1 FROM attribuerdossier ad WHERE ad.dossierid = inc.id_incident AND ad.status IN ('en cours','accepté')) THEN 1 END) AS en_cours,
                COUNT(CASE WHEN EXISTS (SELECT 1 FROM attribuerdossier ad WHERE ad.dossierid = inc.id_incident AND ad.status IN ('résolu','cloturé')) THEN 1 END) AS resolus
            FROM incident inc
        `);

        const catRes = await pool.query(`
            SELECT cat.categorie_id, cat.designation, cat.niveau, cat.etat, COUNT(inc.id_incident) AS incidents_count
            FROM categorie_incident cat
            LEFT JOIN incident inc ON cat.categorie_id = inc.categorieid
            GROUP BY cat.categorie_id, cat.designation, cat.niveau, cat.etat
            ORDER BY incidents_count DESC
        `);

        res.json({
            success: true,
            status: "success",
            data: {
                organisations: orgRes.rows[0],
                utilisateurs: userRes.rows[0],
                incidents: incidentRes.rows[0],
                categories: catRes.rows
            }
        });
    } catch (error) {
        console.log("Error in /admin/stats:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(5001, () => {
    console.log("Server is running on port 5001");
});


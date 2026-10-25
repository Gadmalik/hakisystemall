import pool from "../db.js";
import { SendNotification } from "./notification.js";
import { sendMail } from "./mail.js";
import { OrganisationStatusMail } from "./mailsModel.js";

export async function addOrganisation(data){
    const verifDesignation = await verifOrganisationByDesignation(data);
    const verifEmail = await verifOrganisationByEmail(data);
    const verifPhone = await verifOrganisationByPhone(data);
    if(verifDesignation.data.length > 0){
        return {status: "failed", success: false, message: "Une organisation existe déjà avec cette designation !"};
    }
    if(verifEmail.data.length > 0){
        return {status: "failed", success: false, message: "Une organisation existe déjà avec cette adresse email !"};
    }
    if(verifPhone.data.length > 0){
        return {status: "failed", success: false, message: "Une organisation existe déjà avec ce numéro de téléphone !"};
    }
    try{
        const add = await pool.query("INSERT INTO organisation (designation, sigle, typeorganisationid, pays, province, ville, adresse_org, phone_org, email_org, site_web, reseaux_sociaux, logo_url, userid, config) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, true) RETURNING *", [data.designation, data.sigle, data.typeorganisationid, data.pays, data.province, data.ville, data.adresse_org, data.phone_org, data.email_org, data.site_web, data.reseaux_sociaux, data.logo_url, data.userid]);
        return {status: "success", success: true, message: "Organisation ajoutée avec succès !", data:add.rows[0]};
    }catch(error){
        console.error(error);
        return {status: "error", success: false, message: error.message};
    }   
}

export async function getOrganisations(){
    try{
        const organisations = await pool.query("SELECT *, og.status AS status FROM organisation og JOIN utilisateurs ut ON og.userid = ut.userid LEFT JOIN type_organisation ty ON og.typeorganisationid = ty.typeorganisationid");
        return {status: "success", success: true, data: organisations.rows };
    }catch(error){
        console.error(error);
        return {status: "error", success: false, message: error.message};
    }
}

export async function getOrganisation(data){
    try{
        const org = await pool.query("SELECT * FROM organisation WHERE organisationid=$1", [data.organisationid]);
        return {status:"success", success: true, data: org.rows[0] };
    }catch(error){
        console.error(error);
        return {status: "error", success: false, message: error.message};
    }
}


export async function verifOrganisationByDesignation(data){
    const org = await pool.query("SELECT * FROM organisation WHERE designation=$1", [data.designation]);
    return {status:"success", success: true, data: org.rows };
}

export async function verifOrganisationByEmail(data){
    const org = await pool.query("SELECT * FROM organisation WHERE email_org=$1", [data.email_org]);
    return {status:"success", success: true, data: org.rows };
}

export async function verifOrganisationByPhone(data){
    const org = await pool.query("SELECT * FROM organisation WHERE phone_org=$1", [data.phone_org]);
    return {status:"success", success: true, data: org.rows };
}

export async function getTypeOrganisation(){
    const type = await pool.query("SELECT * FROM type_organisation");
    return {status:"success", success: true, data: type.rows };
}

export async function UpdateOrganisation(data){
    const verifDesignation = await verifOrganisationByDesignation(data);
    const verifEmail = await verifOrganisationByEmail(data);
    const verifPhone = await verifOrganisationByPhone(data);
    if(verifDesignation.data.length > 0 && data.id != verifDesignation.data[0].id){
        return {status: "failed", success: false, message: "Une organisation existe déjà avec cette designation !"};
    }
    if(verifEmail.data.length > 0 && data.id != verifEmail.data[0].id){
        return {status: "failed", success: false, message: "Une organisation existe déjà avec cette adresse email !"};
    }
    if(verifPhone.data.length > 0 && data.id != verifPhone.data[0].id){
        return {status: "failed", success: false, message: "Une organisation existe déjà avec ce numéro de téléphone !"};
    }
    try{
        const update = await pool.query("UPDATE organisation SET nom_officiel = $1, sigle = $2, type_organisation_id = $3, pays = $4, province = $5, ville = $6, adresse_org = $7, phone_org = $8, email_org = $9, site_web = $10, reseaux_sociaux = $11, logo_url = $12, userid = $13 WHERE id = $14", [data.nom_officiel, data.sigle, data.type_organisation_id, data.pays, data.province, data.ville, data.adresse_org, data.phone_org, data.email_org, data.site_web, data.reseaux_sociaux, data.logo_url, data.user_id, data.id]);
        return {status: "success", success: true, message: "Organisation mise à jour avec succès !"};
    }catch(error){
        return {status: "error", success: false, message: error.message};
    }
}

export async function actionOrganisations(data){
    try{
        const orgIds = Array.isArray(data.organisations) ? data.organisations : [data.organisations];
        const update = await pool.query(
            "UPDATE organisation SET status = $1 WHERE organisationid = ANY($2::uuid[]) RETURNING *",
            [data.action, orgIds]
        );

        if(data.action === "actif" && update.rows.length > 0){
            for (const org of update.rows) {
                // Activer le compte de l'utilisateur créateur de l'organisation
                if (org.userid) {
                    await pool.query("UPDATE utilisateurs SET etat = 'actif' WHERE userid = $1", [org.userid]);

                    try {
                        await SendNotification({
                            userid: org.userid,
                            title: "🏢 Organisation validée !",
                            body: `Votre organisation ${org.designation} a été activée par l'administration.`,
                            url: "/home/dashboard"
                        });
                        await pool.query(
                            "INSERT INTO notifications (userid, title, body, url, lu, created_at) VALUES ($1, $2, $3, $4, false, CURRENT_TIMESTAMP)",
                            [org.userid, "🏢 Organisation validée !", `Votre organisation ${org.designation} a été activée.`, "/home/dashboard"]
                        );
                    } catch (notifErr) {
                        console.log("Org validation notif note:", notifErr?.message);
                    }
                }

                // Notification par Email
                const targetEmail = org.email_org;
                if (targetEmail) {
                    try {
                        const emailHtml = OrganisationStatusMail({
                            nomOrganisation: org.designation,
                            status: "actif",
                            messageExplication: "Votre organisation a été approuvée par l'équipe d'administration de HAKI SYSTEM. Vous pouvez désormais traiter les dossiers dans vos domaines d'intervention."
                        });
                        await sendMail({
                            to: targetEmail,
                            subject: `[HAKI SYSTEM] Votre organisation ${org.designation} a été validée`,
                            text: emailHtml
                        });
                    } catch (mailErr) {
                        console.log("Org validation email note:", mailErr?.message);
                    }
                }
            }
        }

        return {status: "success", success: true, message: "Organisation(s) mise(s) à jour avec succès !", data: update.rows};
    }catch(error){
        console.error("Error in actionOrganisations:", error);
        return {status: "error", success: false, message: error.message};
    }
}

export async function assignerdomaine(req, res){
    try{
        const {organisationid, domaineintervention, userid} = req.body;
        if (Array.isArray(domaineintervention)) {
            for (const domaineid of domaineintervention) {
                const verif = await verifDomaineAssigner({organisationid, domaineid, userid});
                if(verif.success){
                    await pool.query("INSERT INTO assignerdomaine(organisationid, categorie_id, userid, status) VALUES($1, $2, $3, $4)", [organisationid, domaineid, userid, "actif"]);
                }
            }
        }
        if (userid) {
            await pool.query("UPDATE utilisateurs SET config=true WHERE userid=$1", [userid]);
        }
        const user = userid ? await pool.query("SELECT *, util.userid AS userid, og.status AS ogStatus, util.config AS config FROM utilisateurs util LEFT JOIN categorieutilisateur cu ON util.categorieutilisateurid=cu.categorieutilisateurid LEFT JOIN organisation og ON og.userid=util.userid WHERE util.userid=$1", [userid]) : { rows: [] };
        res.json({status: "success", success: true, message: "Domaine assigné avec succès !", data: user.rows[0]});
    }catch(error){
        res.json({status: "error", success: false, message: error.message});
    }
}

export async function verifDomaineAssigner(data){
    try{
        const {organisationid, domaineid, userid} = data;
        const verif = await pool.query("SELECT * FROM assignerdomaine WHERE ((organisationid IS NOT NULL AND organisationid = $1) OR (userid IS NOT NULL AND userid = $2)) AND categorie_id = $3", [organisationid, userid, domaineid]);
        if(verif.rows.length > 0){
            return {status: "failed", success: false, message: "Domaine déjà assigné !"};
        }
        return {status: "success", success: true, message: "Domaine non assigné !"};
    }catch(error){
        return {status: "error", success: false, message: error.message};
    }
}


export async function getUtilisateursByDomaines(data){
    try{
        const categorieId = parseInt(data.type || data.categorieid, 10);
        const query = `
            SELECT DISTINCT 
                u.userid, 
                u.nom, 
                u.prenom, 
                u.email, 
                u.phone,
                ci.categorie_id,
                ci.designation AS designation,
                org.organisationid,
                org.designation AS organisation_nom,
                org.email_org
            FROM assignerdomaine ad
            JOIN categorie_incident ci ON ad.categorie_id = ci.categorie_id
            LEFT JOIN organisation org ON (
                (ad.organisationid IS NOT NULL AND org.organisationid = ad.organisationid)
                OR (ad.organisationid IS NULL AND ad.userid IS NOT NULL AND org.userid = ad.userid)
            )
            JOIN utilisateurs u ON (
                -- 1. Utilisateurs sans organisation ayant ce domaine directement assigné
                (ad.organisationid IS NULL AND u.userid = ad.userid)
                -- 2. Utilisateur principal lié à l'organisation
                OR (org.userid IS NOT NULL AND u.userid = org.userid)
                -- 3. Sous-utilisateurs de l'organisation via categorieutilisateurorg
                OR (org.organisationid IS NOT NULL AND u.userid IN (
                    SELECT ut.userid FROM utilisateurs ut 
                    JOIN categorieutilisateurorg cuo ON ut.categorieutilisateurid = cuo.categorieutilisateurorgid 
                    WHERE cuo.organisationid = org.organisationid AND ut.etat = 'actif'
                ))
                -- 4. Sous-utilisateurs de l'organisation via assignercategorieutilisateurorg
                OR (org.organisationid IS NOT NULL AND u.userid IN (
                    SELECT acuo.userid FROM assignercategorieutilisateurorg acuo 
                    WHERE acuo.organisationid = org.organisationid AND acuo.status = 'actif'
                ))
            )
            WHERE ad.status = 'actif' 
              AND ci.categorie_id = $1 
              AND u.etat = 'actif'
        `;
        const reponse = await pool.query(query, [categorieId]);
        return {data: reponse.rows, status:"success", code:"success", success: true};
    }catch(error){
        console.log("Error in getUtilisateursByDomaines:", error);
        return {message:"Une erreur s'est produite !", status:"error", code:"", error: error, data: []};
    }
}
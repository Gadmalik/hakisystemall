import pool from "../db.js";
import { SendNotification } from "./notification.js";
import { getUtilisateursByDomaines } from "./organisation.js";

export async function AddSignalement(data){
    try{
        const clienturl = process.env.CLIENT_URL;
        // code avec chiffre et lettre et tiret 
        console.log(data);
        let codeunique = "HSY-"+Math.random().toString(36).substring(2, 5) +"-"+ Math.random().toString(36).substring(2, 5);
        let verifCode = await getIncidentByCode(codeunique);
        while(verifCode.count>0){
            codeunique = "HSY-"+Math.random().toString(36).substring(2, 5) +"-"+ Math.random().toString(36).substring(2, 5);
            verifCode = await getIncidentByCode(codeunique);
        }
        const reponse = await pool.query("INSERT INTO incident(categorieid, lieu, description, date_incident, date_create, userid, status, code_unique, contact, genre, age, annexes) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *", [data.categorieid, data.lieu, data.description, data.date, data.date_create, data.userid, "actif", codeunique, data.contact, data.genre, data.trancheage, data.annexe]);
        const utilisateurs = await getUtilisateursByDomaines({type:data.type});
        utilisateurs.data.forEach(async user => {
            await SendNotification({userid:user.userid, body:`Un nouveau signalement de categorie : ${utilisateurs.data[0].designation} a été ajouté`, title: "Nouveau signalement", url:clienturl+"/home/dossiers"});
        });
        return {data: reponse.rows[0], status:"success", code:"success", success: true};
    }catch(error){
        console.log(error);
        return {message:"Une erreur s'est produite !", status:"error", code:"", error: error};
    }
}

export async function getIncidentByUser(data){
    try{
        let additionnal = "";
        if(data.limit && data.limit > 0){
            additionnal = ` limit ${data.limit} `
        }
        const reponse = await pool.query("SELECT *, att.status as statusinc FROM incident inc JOIN categorie_incident cat ON inc.categorieid = cat.categorie_id LEFT JOIN attribuerdossier att ON inc.id_incident = att.dossierid LEFT JOIN utilisateurs usr ON att.userid=usr.userid WHERE inc.userid=$1 AND att.status='en cours'"+additionnal, [data.userid]);
        return {data: reponse.rows, status:"success", code:"success"};
    }catch(error){
        console.log(error);
        return {message:"Une erreur s'est produite !", status:"error", code:"", error: error};
    }
}

export async function getIncidentByCode(code){
    try{
        const reponse = await pool.query("SELECT * FROM incident inc JOIN categorie_incident cat ON inc.categorieid = cat.categorie_id LEFT JOIN utilisateurs usr ON inc.userid=usr.userid WHERE inc.code_unique=$1", [code]);
        return {data: reponse.rows[0], status:"success", code:"success", count: reponse.rows.length};
    }catch(error){
        console.log(error);
        return {message:"Une erreur s'est produite !", status:"error", code:"", error: error};
    }
}

export async function getIncidentById(req, res){
    try{
        const {signalementid, cond} = req.params;
        let condition = "";
        if(cond){
            condition = " WHERE code_unique=$1";
        }else{
            condition = " WHERE inc.id_incident=$1";
        }
        const reponse = await pool.query("SELECT *, attd.status as statusatt, inc.status as status, attd.userid AS userid, cat.designation AS categorie FROM incident inc JOIN categorie_incident cat ON inc.categorieid = cat.categorie_id LEFT JOIN utilisateurs usr ON inc.userid=usr.userid LEFT JOIN attribuerdossier attd ON (inc.id_incident = attd.dossierid AND attd.status!='abandonné' AND attd.status!='refusé' AND attd.status!='accepté') "+condition, [signalementid]);
        res.json({data: reponse.rows[0], status:"success", code:"success"});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
}

export async function getIncidentOrienteByOrganisationId(req, res){
    try{
        const reponse = await pool.query("SELECT *, usr.nom AS nom, usr.prenom AS prenom, usratt.nom AS nomatt, usratt.prenom AS prenomatt, attd.status as statusatt, inc.status as status, attd.userid AS userid, cat.designation AS categorie, attd.date AS dateatt FROM incident inc JOIN categorie_incident cat ON inc.categorieid = cat.categorie_id LEFT JOIN utilisateurs usr ON inc.userid=usr.userid LEFT JOIN attribuerdossier attd ON (inc.id_incident = attd.dossierid AND attd.status!='abandonné' AND attd.status!='refusé') LEFT JOIN utilisateurs usratt ON attd.userid=usratt.userid WHERE attd.organisationid=$1 AND attd.type='orientation'", [req.params.organisationid]);
        res.json({data: reponse.rows, status:"success", code:"success"});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
}

export async function getIncidentOrienteByUserId(req, res){
    try{
        const reponse = await pool.query("SELECT *, org.designation AS organisation, usr.nom AS nom, usr.prenom AS prenom, usratt.nom AS nomatt, usratt.prenom AS prenomatt, attd.status as statusatt, inc.status as status, attd.userid AS userid, cat.designation AS categorie, attd.date AS dateatt FROM incident inc JOIN categorie_incident cat ON inc.categorieid = cat.categorie_id LEFT JOIN utilisateurs usr ON inc.userid=usr.userid LEFT JOIN attribuerdossier attd ON inc.id_incident = attd.dossierid LEFT JOIN utilisateurs usratt ON attd.userid=usratt.userid LEFT JOIN organisation org ON attd.organisationid=org.organisationid WHERE attd.userid=$1 AND attd.type='orientation'", [req.params.userid]);
        res.json({data: reponse.rows, status:"success", code:"success"});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
}

export async function getIncidentSuivieByUserId(req, res){
    try{
        const reponse = await pool.query("SELECT *, org.designation AS organisation, usr.nom AS nom, usr.prenom AS prenom, usratt.nom AS nomatt, usratt.prenom AS prenomatt, attd.status as statusatt, inc.status as status, attd.userid AS userid, cat.designation AS categorie, attd.date AS dateatt FROM incident inc JOIN categorie_incident cat ON inc.categorieid = cat.categorie_id LEFT JOIN utilisateurs usr ON inc.userid=usr.userid LEFT JOIN attribuerdossier attd ON (inc.id_incident = attd.dossierid AND attd.status!='abandonné' AND attd.status!='refusé') LEFT JOIN utilisateurs usratt ON attd.userid=usratt.userid LEFT JOIN organisation org ON attd.organisationid=org.organisationid WHERE attd.userid=$1 AND attd.type='prise'", [req.params.userid]);
        res.json({data: reponse.rows, status:"success", code:"success"});
    }catch(error){
        console.log(error);
        res.json({message:"Une erreur s'est produite !", status:"error", code:"", error: error});
    }
}
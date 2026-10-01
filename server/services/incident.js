import pool from "../db.js";
import { SendNotification } from "./notification.js";
import { getUtilisateursByDomaines } from "./organisation.js";

export async function AddSignalement(data){
    try{
        const clienturl = process.env.CLIENT_URL;
        const reponse = await pool.query("INSERT INTO incident(categorieid, lieu, description, date_incident, date_create, userid, status) VALUES($1, $2, $3, $4, $5, $6, $7)", [parseInt(data.type), data.lieu, data.description, data.date, data.date_create, data.userid, "actif"]);
        const utilisateurs = await getUtilisateursByDomaines({type:data.type});
        utilisateurs.data.forEach(async user => {
            await SendNotification({userid:user.userid, body:`Un nouveau signalement de categorie : ${utilisateurs.data[0].designation} a été ajouté`, title: "Nouveau signalement", url:clienturl+"/home/dossiers"});
        });
        return {data: reponse.rows[0], status:"success", code:"success"};
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
        const reponse = await pool.query("SELECT *, att.status as statusinc FROM incident inc JOIN categorie_incident cat ON inc.categorieid = cat.categorie_id LEFT JOIN attribuerdossier att ON inc.id_incident = att.dossierid LEFT JOIN utilisateurs usr ON att.userid=usr.userid WHERE inc.userid=$1"+additionnal, [data.userid]);
        return {data: reponse.rows, status:"success", code:"success"};
    }catch(error){
        console.log(error);
        return {message:"Une erreur s'est produite !", status:"error", code:"", error: error};
    }
}

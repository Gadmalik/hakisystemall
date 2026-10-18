import pool from "../db.js";
import { SendNotification } from "./notification.js";
import { getUtilisateursByDomaines } from "./organisation.js";

export async function AddSignalement(data){
    try{
        const clienturl = process.env.CLIENT_URL || "http://localhost:3000";
        // code unique lisible avec préfixe HSY
        console.log("AddSignalement data:", data);
        let codeunique = "HSY-" + Math.random().toString(36).substring(2, 5).toUpperCase() + "-" + Math.random().toString(36).substring(2, 5).toUpperCase();
        let verifCode = await getIncidentByCode(codeunique);
        while(verifCode.count > 0){
            codeunique = "HSY-" + Math.random().toString(36).substring(2, 5).toUpperCase() + "-" + Math.random().toString(36).substring(2, 5).toUpperCase();
            verifCode = await getIncidentByCode(codeunique);
        }

        const rawAnnexes = data.annexes || data.annexe;
        const formattedAnnexes = rawAnnexes ? (typeof rawAnnexes === 'string' ? rawAnnexes : JSON.stringify(rawAnnexes)) : null;

        const reponse = await pool.query(
            "INSERT INTO incident(categorieid, lieu, description, date_incident, date_create, userid, status, code_unique, contact, genre, age, annexes) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
            [data.categorieid, data.lieu, data.description, data.date, data.date_create, data.userid || null, "actif", codeunique, data.contact || null, data.genre || null, data.trancheage || null, formattedAnnexes]
        );

        try {
            const utilisateurs = await getUtilisateursByDomaines({type: data.type || data.categorieid});
            if (utilisateurs && utilisateurs.data && Array.isArray(utilisateurs.data) && utilisateurs.data.length > 0) {
                const catName = utilisateurs.data[0]?.designation || "nouveau";
                utilisateurs.data.forEach(async user => {
                    await SendNotification({userid: user.userid, body: `Un nouveau signalement de catégorie : ${catName} a été ajouté`, title: "Nouveau signalement", url: clienturl + "/home/signalement"});
                });
            }
        } catch (notifErr) {
            console.log("Notification skipped:", notifErr?.message);
        }

        return {data: reponse.rows[0], status:"success", code:"success", success: true};
    }catch(error){
        console.log("Error AddSignalement:", error);
        return {message:"Une erreur s'est produite !", status:"error", code:"", error: error, success: false};
    }
}

export async function getIncidentStats(req, res){
    try{
        const totalRes = await pool.query("SELECT COUNT(*) AS total FROM incident");
        const total = parseInt(totalRes.rows[0]?.total || 0);

        const statusRes = await pool.query(`
            SELECT 
                COALESCE(ad.status, 'nouveau') AS status,
                ad.type,
                COUNT(DISTINCT inc.id_incident) AS count
            FROM incident inc
            LEFT JOIN attribuerdossier ad ON (
                inc.id_incident = ad.dossierid 
                AND ad.attribuerid = (SELECT attribuerid FROM attribuerdossier WHERE dossierid=inc.id_incident ORDER BY attribuerid DESC LIMIT 1)
            )
            GROUP BY ad.status, ad.type
        `);

        let nouveaux = 0;
        let encours = 0;
        let resolus = 0;
        let orientes = 0;

        statusRes.rows.forEach(r => {
            const st = (r.status || '').toLowerCase();
            const tp = (r.type || '').toLowerCase();
            const cnt = parseInt(r.count || 0);

            if (tp === 'orientation') {
                orientes += cnt;
            } else if (st === 'résolu' || st === 'resolu' || st === 'cloturé' || st === 'cloture') {
                resolus += cnt;
            } else if (st === 'en cours' || st === 'en attente' || st === 'accepté') {
                encours += cnt;
            } else {
                nouveaux += cnt;
            }
        });

        // Catégories
        const catRes = await pool.query(`
            SELECT cat.categorie_id, cat.designation, cat.niveau, COUNT(inc.id_incident) AS count
            FROM categorie_incident cat
            LEFT JOIN incident inc ON inc.categorieid = cat.categorie_id
            GROUP BY cat.categorie_id, cat.designation, cat.niveau
            ORDER BY count DESC
        `);

        // Niveaux de priorité
        const niveauRes = await pool.query(`
            SELECT COALESCE(cat.niveau, 'moyen') AS niveau, COUNT(inc.id_incident) AS count
            FROM incident inc
            LEFT JOIN categorie_incident cat ON inc.categorieid = cat.categorie_id
            GROUP BY cat.niveau
        `);

        // Incidents récents
        const recentRes = await pool.query(`
            SELECT 
                inc.*, 
                cat.designation AS categorie, 
                cat.niveau, 
                ad.status AS statusatt, 
                ad.type AS type_attribut,
                org.designation AS organisation_nom
            FROM incident inc
            JOIN categorie_incident cat ON inc.categorieid = cat.categorie_id
            LEFT JOIN attribuerdossier ad ON (
                inc.id_incident = ad.dossierid 
                AND ad.attribuerid = (SELECT attribuerid FROM attribuerdossier WHERE dossierid=inc.id_incident ORDER BY attribuerid DESC LIMIT 1)
            )
            LEFT JOIN organisation org ON ad.organisationid = org.organisationid
            ORDER BY inc.id_incident DESC
            LIMIT 6
        `);

        const recent = recentRes.rows.map(row => {
            if (row.annexes && typeof row.annexes === 'string') {
                try { row.annexes = JSON.parse(row.annexes); } catch(e){}
            }
            return row;
        });

        res.json({
            success: true,
            status: "success",
            data: {
                total,
                nouveaux,
                encours,
                resolus,
                orientes,
                categories: catRes.rows.map(c => ({ ...c, count: parseInt(c.count || 0) })),
                niveaux: niveauRes.rows.map(n => ({ ...n, count: parseInt(n.count || 0) })),
                recent
            }
        });
    }catch(error){
        console.log("Error getIncidentStats:", error);
        res.status(500).json({ success: false, status: "error", message: "Erreur lors de la récupération des statistiques", error });
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
        let paramValue = signalementid;
        
        if (cond === "code" || (!cond && isNaN(Number(signalementid)))) {
            condition = " WHERE inc.code_unique = $1";
        } else if (cond === "none" || !cond || !isNaN(Number(signalementid))) {
            condition = " WHERE inc.id_incident = $1";
            paramValue = parseInt(signalementid, 10);
        } else {
            condition = " WHERE inc.code_unique = $1";
        }

        const queryStr = `
            SELECT 
                inc.*, 
                attd.attribuerid, 
                attd.status AS statusatt, 
                attd.type AS type_attribut, 
                attd.commentaire AS commentaire_attribut, 
                attd.organisationid AS organisationid_attribut, 
                attd.date AS date_attribut, 
                attd.userid AS attribuer_userid, 
                cat.designation AS categorie, 
                cat.niveau, 
                usr.nom AS nom_createur, 
                usr.prenom AS prenom_createur, 
                org.designation AS organisation_nom, 
                usratt.nom AS nom_gestionnaire, 
                usratt.prenom AS prenom_gestionnaire 
            FROM incident inc 
            JOIN categorie_incident cat ON inc.categorieid = cat.categorie_id 
            LEFT JOIN utilisateurs usr ON inc.userid = usr.userid 
            LEFT JOIN attribuerdossier attd ON (
                inc.id_incident = attd.dossierid 
                AND attd.status != 'abandonné' 
                AND attd.status != 'refusé'
            ) 
            LEFT JOIN organisation org ON attd.organisationid = org.organisationid 
            LEFT JOIN utilisateurs usratt ON attd.userid = usratt.userid 
            ${condition} 
            ORDER BY attd.attribuerid DESC LIMIT 1
        `;

        const reponse = await pool.query(queryStr, [paramValue]);
        let row = reponse.rows[0];
        if (row && row.annexes && typeof row.annexes === 'string') {
            try {
                row.annexes = JSON.parse(row.annexes);
            } catch (e) {}
        }
        res.json({data: row, status:"success", code:"success", success: true});
    }catch(error){
        console.log("Error getIncidentById:", error);
        res.status(500).json({message:"Une erreur s'est produite !", status:"error", code:"", error: error, success: false});
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
import pool from "../db.js";

export async function addCategorieUtilisateurOrg(data){
    try {
        const query = "INSERT INTO categorieutilisateurorg (libelle, description, organisationid, status) VALUES ($1, $2, $3, $4) RETURNING *";
        const result = await pool.query(query, [data.libelle, data.description, data.organisationid, 'actif']);
        const categorieutilisateurorgid = result.rows[0].categorieutilisateurorgid;
        if(data.fonctionnalites.length > 0){
            // desactiver toute les ancienne
            data.fonctionnalites.forEach(async fonctionnaliteid => {
                const query = "INSERT INTO assignerfonctionnalites (categorieutilisateurid, fonctionnaliteid, compte, status) VALUES ($1, $2, $3, $4)";
                await pool.query(query, [categorieutilisateurorgid, fonctionnaliteid, 'second', 'actif']);
            });
        }
        return {status: "success", success: true, message: "Categorie utilisateur ajoutée avec succès !"};
    } catch (error) {
        console.log(error);
        return {status: "error", success: false, message: error.message};
    }
}

export async function getDefaultCategorieUtilisateur(req, res){
    try {
        const query = "SELECT * FROM categorieutilisateur WHERE isdefault = true";
        const result = await pool.query(query);
        res.json({status: "success", success: true, data: result.rows[0]});
    } catch (error) {
        console.log(error);
        return {status: "error", success: false, message: error.message};
    }
}

export async function getcategorieutilisateurOrg(data){
    try {
        const query = "SELECT * FROM categorieutilisateurorg WHERE organisationid = $1 AND status = 'actif'";
        const result = await pool.query(query, [data.organisationid]);
        return {status: "success", success: true, data: result.rows};
    } catch (error) {
        console.log(error);
        return {status: "error", success: false, message: error.message};
    }
}

export async function addAssignerCategorieUtilisateur(data){
    try {
        const verif = await pool.query("SELECT * FROM assignercategorieutilisateurorg WHERE userid = $1 AND categorieutilisateurorgid = $2 AND status = 'actif'", [data.userid, data.categorieutilisateurorgid]);
        if(verif.rowCount > 0){
            return {status: "error", success: false, message: "Cette categorie utilisateur est déjà assignée à cet utilisateur !"};
        }
        const query = "INSERT INTO assignercategorieutilisateurorg (assignercategorieutilisateurorgid, userid, categorieutilisateurorgid, status) VALUES ($1, $2, $3, $4)";
        const result = await pool.query(query, [data.assignercategorieutilisateurorgid, data.userid, data.categorieutilisateurorgid, 'actif']);
        return {status: "success", success: true, message: "Categorie utilisateur assignée avec succès !"};
    } catch (error) {
        console.log(error);
        return {status: "error", success: false, message: error.message};
    }
}

export async function getUtilisateursByOrganisationId(data){
    try {
        const query = "SELECT * FROM utilisateurs ut JOIN categorieutilisateurorg cuo ON ut.categorieutilisateurid = cuo.categorieutilisateurorgid WHERE cuo.organisationid = $1 AND ut.etat = 'actif' AND ut.type = 'second'";
        const result = await pool.query(query, [data.organisationid]);
        return {status: "success", success: true, data: result.rows};
    } catch (error) {
        console.log(error);
        return {status: "error", success: false, message: error.message};
    }
}

// categorie geneale 

export async function addCatUtilisateur(req, res ){
    try {
        const {designation, description, fonctionnalites = [], organisation = false, confirm = false, isadmin = false} = req.body;
        const query = "INSERT INTO categorieutilisateur (designation, description, organisation, confirm, isadmin, status) VALUES ($1, $2, $3, $4, $5, 'actif') RETURNING *";
        const result = await pool.query(query, [designation, description, !!organisation, !!confirm, isadmin === true || isadmin === 'true']);
        const categorieutilisateurid = result.rows[0].categorieutilisateurid;
        if(Array.isArray(fonctionnalites) && fonctionnalites.length > 0){
            for (const fonctionnalite of fonctionnalites) {
                const qInsert = "INSERT INTO assignerfonctionnalites (categorieutilisateurid, fonctionnaliteid, compte, status) VALUES ($1, $2, 'main', 'actif')";
                await pool.query(qInsert, [categorieutilisateurid, fonctionnalite]);
            }
        }
        return res.json({status: "success", success: true, message: "Categorie utilisateur ajoutée avec succès !", data: result.rows[0]});
    } catch (error) {
        console.log(error);
        return res.json({status: "error", success: false, message: error.message});
    }
}


export async function assignerFonctionnalites(req, res ){
    try {
        const {categorieutilisateurid, fonctionnaliteid, compte = 'main'} = req.body;
        const query = "INSERT INTO assignerfonctionnalites (categorieutilisateurid, fonctionnaliteid, compte, status) VALUES ($1, $2, $3, 'actif')";
        const result = await pool.query(query, [categorieutilisateurid, fonctionnaliteid, compte]);
        return {status: "success", success: true, message: "Fonctionnalité assignée avec succès !"};
    } catch (error) {
        console.log(error);
        return {status: "error", success: false, message: error.message};
    }
}

export async function getCatUtilisateur(req, res ){
    try {
        const query = "SELECT * FROM categorieutilisateur WHERE status = 'actif' ORDER BY categorieutilisateurid ASC";
        const result = await pool.query(query);
        res.json({status: "success", success: true, data: result.rows});
    } catch (error) {
        console.log(error);
        res.json({status: "error", success: false, message: error.message});
    }
}

export async function getFonctionnalitesByCategorieutilisateurs(req, res){
    try {
        const {categorieutilisateurid, type} = req.params;
        const targetCompte = type === "second" ? "second" : "main";
        const query = `
            SELECT f.*, af.assignerfonctionnalitesid, af.status AS af_status
            FROM assignerfonctionnalites af 
            JOIN fonctionnalites f ON af.fonctionnaliteid = f.fonctionnaliteid 
            WHERE af.categorieutilisateurid = $1 
              AND (af.compte = $2 OR (af.compte IS NULL AND $2 = 'main')) 
              AND af.status = 'actif'
            ORDER BY f.ordre_affichage ASC
        `;
        const result = await pool.query(query, [categorieutilisateurid, targetCompte]);
        res.json({status: "success", success: true, data: result.rows});
    } catch (error) {
        console.log(error);
        res.json({status: "error", success: false, message: error.message});
    }
}

export async function updateCatUtilisateur(req, res){
    try {
        const {categorieutilisateurid, designation, description, fonctionnalites = [], organisation = false, confirm = false, isadmin = false} = req.body;
        const query = "UPDATE categorieutilisateur SET designation = $1, description = $2, organisation = $3, confirm = $4, isadmin = $5 WHERE categorieutilisateurid = $6 RETURNING *";
        const result = await pool.query(query, [designation, description, !!organisation, !!confirm, isadmin === true || isadmin === 'true', categorieutilisateurid]);
        if(Array.isArray(fonctionnalites)){
            // désactiver les anciennes
            await pool.query("UPDATE assignerfonctionnalites SET status = 'inactif' WHERE categorieutilisateurid = $1 AND (compte = 'main' OR compte IS NULL)", [categorieutilisateurid]);
            for (const fonctionnalite of fonctionnalites) {
                const qInsert = "INSERT INTO assignerfonctionnalites (categorieutilisateurid, fonctionnaliteid, compte, status) VALUES ($1, $2, 'main', 'actif')";
                await pool.query(qInsert, [categorieutilisateurid, fonctionnalite]);
            }
        }
        return res.json({status: "success", success: true, message: "Categorie utilisateur modifiée avec succès !", data: result.rows[0]});
    } catch (error) {
        console.log(error);
        return res.json({status: "error", success: false, message: error.message});
    }
}

export async function updateCatUtilisateurOrg(req, res){
    try {
        const {categorieutilisateurorgid, libelle, description, fonctionnalites} = req.body;
        const query = "UPDATE categorieutilisateurorg SET libelle = $1, description = $2 WHERE categorieutilisateurorgid = $3 RETURNING *";
        const result = await pool.query(query, [libelle, description, categorieutilisateurorgid]);
        if(fonctionnalites.length > 0){
            // desactiver toute les ancienne
            await pool.query("UPDATE assignerfonctionnalites SET status = 'inactif' WHERE categorieutilisateurid = $1", [categorieutilisateurorgid]);
            fonctionnalites.forEach(async fonctionnalite => {
                const query = "INSERT INTO assignerfonctionnalites (categorieutilisateurid, fonctionnaliteid, compte, status) VALUES ($1, $2, $3, $4)";
                await pool.query(query, [categorieutilisateurorgid, fonctionnalite, 'second', 'actif']);
            });
        }
        return res.json({status: "success", success: true, message: "Categorie utilisateur modifiée avec succès !", data: result.rows[0]});
    } catch (error) {
        console.log(error);
        return res.json({status: "error", success: false, message: error.message});
    }
}
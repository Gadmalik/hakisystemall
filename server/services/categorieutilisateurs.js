import pool from "../db.js";

export async function addCategorieUtilisateurOrg(data){
    try {
        const query = "INSERT INTO categorieutilisateurorg (libelle, description, organisationid, status) VALUES ($1, $2, $3, $4) RETURNING *";
        const result = await pool.query(query, [data.libelle, data.description, data.organisationid, 'actif']);
        const categorieutilisateurorgid = result.rows[0].categorieutilisateurorgid;
        if(data.fonctionnalites.length > 0){
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
        const {designation, description, fonctionnalites} = req.body;
        const query = "INSERT INTO categorieutilisateur (designation, description, status) VALUES ($1, $2, 'actif') RETURNING *";
        const result = await pool.query(query, [designation, description]);
        const categorieutilisateurid = result.rows[0].categorieutilisateurid;
        if(fonctionnalites.length > 0){
            fonctionnalites.forEach(async fonctionnalite => {
                const query = "INSERT INTO assignerfonctionnalites (categorieutilisateurid, fonctionnaliteid, status) VALUES ($1, $2, 'actif')";
                await pool.query(query, [categorieutilisateurid, fonctionnalite]);
            });
        }
        return res.json({status: "success", success: true, message: "Categorie utilisateur ajoutée avec succès !", data: result.rows[0]});
    } catch (error) {
        console.log(error);
        return res.json({status: "error", success: false, message: error.message});
    }
}


export async function assignerFonctionnalites(req, res ){
    try {
        const {categorieutilisateurid, fonctionnaliteid} = req.body;
        const query = "INSERT INTO assignerfonctionnalites (categorieutilisateurid, fonctionnaliteid, status) VALUES ($1, $2, 'actif')";
        const result = await pool.query(query, [categorieutilisateurid, fonctionnaliteid]);
        return {status: "success", success: true, message: "Fonctionnalité assignée avec succès !"};
    } catch (error) {
        console.log(error);
        return {status: "error", success: false, message: error.message};
    }
}

export async function getCatUtilisateur(req, res ){
    try {
        const query = "SELECT * FROM categorieutilisateur WHERE status = 'actif'";
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
        const query = "SELECT * FROM assignerfonctionnalites af JOIN fonctionnalites f ON af.fonctionnaliteid = f.fonctionnaliteid WHERE af.categorieutilisateurid = $1 AND af.compte = $2 AND af.status = 'actif'";
        const result = await pool.query(query, [categorieutilisateurid, type]);
        res.json({status: "success", success: true, data: result.rows});
    } catch (error) {
        console.log(error);
        res.json({status: "error", success: false, message: error.message});
    }
}
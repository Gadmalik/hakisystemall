import pool from "../db.js";

export async function addFonctionnalites(req, res, next) {
    const { designation, description, parentid, icone, route } = req.body;
    if(!designation || !icone || !route) {
        return res.status(400).json({
            status: "error",
            message: "Tous les champs sont requis",
            data: null,
            success: false
        });
    }
    try {
        const query = "INSERT INTO fonctionnalites (designation, description, parentid, icone, route) VALUES ($1, $2, $3, $4, $5)";
        const values = [designation, description, parentid == "" || parentid == undefined || parentid == null ? null : parentid, icone, route];
        await pool.query(query, values);
        return res.status(201).json({
            status: "success",
            message: "Fonctionnalité ajoutée avec succès",
            data: null,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status:"error",
            message:error.message,
            success: false,
            data: null
        });
    }
}
    

export async function getFonctionnalites(req, res, next) {
    try {
        const query = "SELECT * FROM fonctionnalites";
        const result = await pool.query(query);
        return res.status(200).json({
            status: "success",
            message: "Fonctionnalités récupérées avec succès",
            data: result.rows,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: error.message,
            success: false,
            data: null
        });
    }
}
    
export async function updateFonctionnalites(req, res, next) {
    const { designation, description, parentid, icone, route, fonctionnaliteid } = req.body;
    if(!fonctionnaliteid) {
        return res.status(400).json({
            status: "error",
            message: "Une erreur s'est produite",
            data: null,
            success: false
        });
    }
    try {
        const query = "UPDATE fonctionnalites SET designation = $1, description = $2, parentid = $3, icone = $4, route = $5 WHERE fonctionnaliteid = $6";
        const values = [designation, description, parentid == "" || parentid == undefined || parentid == null ? null : parentid, icone, route, fonctionnaliteid];
        await pool.query(query, values);
        return res.status(200).json({
            status: "success",
            message: "Fonctionnalité mise à jour avec succès",
            data: null,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: error.message,
            success: false,
            data: null
        });
    }
}
import database from "../service/database.js"

export async function chkFavorites(req, res) {
    console.log(`GET Favorites Check is requested`)
    const thedata = {
        userId: req.session.userId,
        musicId: req.body.musicId
    }

    try {
        const result = await database.query({
            text: `SELECT * FROM "User_Favorites" WHERE "user_id" = $1 AND "ms_id" = $2`,
            values: [req.session.userId, req.body.musicId]
        })

        if (result.rowCount > 0) {
            return res.json({ isFavorite: true, message: "This song is already in favorites" });
        } else {
            return res.json({ isFavorite: false, message: "This song is not in favorites" });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
export async function postFavorites(req, res) {
    console.log(`POST /FAVORITES is requested `)
    try {
        // Validate Data
        if (req.body.musicId == null) {
            return res.json({ favoriteOK: false, messageAddFavorite: 'Music ID is required' })
        }

        // Insert into User_Favorites
        const result = await database.query({
            text: `INSERT INTO "User_Favorites" ("user_id", "ms_id")
                   VALUES ($1, $2)`,
            values: [req.session.userId, req.body.musicId]
        })

        return res.json({ favoriteOK: true, messageAddFavorite: "Song added to favorites" })
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}
export async function deleteFavorite(req, res) {
    console.log(`DELETE /FAVORITES is requested `)
    try {
        if (req.body.musicId == null) {
            return res.json({ deleteOK: false, message: 'Music ID is required' });
        }

        const result = await database.query({
            text: `DELETE FROM "User_Favorites" WHERE "user_id" = $1 AND "ms_id" = $2`,
            values: [req.session.userId, req.body.musicId]
        })

        return res.json({ deleteOK: true, message: "Song removed from favorites" });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
export async function getFavorites(req, res) {
    console.log(`GET /FAVORITES is requested`)
    try {
        const result = await database.query({
            text: `SELECT ms.* FROM "Musics" ms
                   JOIN "User_Favorites" uf ON ms.ms_id = uf.ms_id
                   WHERE uf.user_id = $1`,
            values: [req.session.userId]
        })

        return res.json(result.rows);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
export async function getFavByUser(req, res) {
    console.log(`GET Fav By User is Requested`);
    try {
        const result = await database.query({
            text: `SELECT ROW_NUMBER() OVER (ORDER BY f."favId" DESC) AS row_number, f.*, SUM(fdt.qty) AS sqty, SUM(fdt.price * fdt.qty) AS sprice
                   FROM favs f LEFT JOIN "favDtl" fdt ON f."favId" = fdt."favId"
                   WHERE f."userId" = $1
                   GROUP BY f."favId"
                   ORDER BY f."favId" DESC`,
            values: [req.body.id]
        });
        console.log(`id=${req.params.id} \n` + result.rows[0]);
        return res.status(200).json(result.rows);
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}
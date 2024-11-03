import database from "../service/database.js"

export async function chkFavorites(req, res) {
    console.log(`GET Favorites Check is requested`)
    const thedata = {
        userId: req.session.userId,
        musicId: req.body.musicId
    }

    try {
        const result = await database.query({
            text: `SELECT * FROM "user_favorites" WHERE "user_id" = $1 AND "ms_id" = $2`,
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
    console.log(`POST /FAVORITES is requested `);
    try {
        // Validate Data
        if (!req.body.musicId || !req.body.userId) {
            return res.json({ 
                favoriteOK: false, 
                messageAddFavorite: 'Music ID and User ID are required' 
            });
        }

        // Insert into user_favorites
        const result = await database.query({
            text: `INSERT INTO "user_favorites" ("user_id", "ms_id")
                   VALUES ($1, $2)`,
            values: [req.body.userId, req.body.musicId]
        });

        return res.json({ 
            favoriteOK: true, 
            messageAddFavorite: "Song added to favorites" 
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
export async function deleteFavorite(req, res) {
    const { id: musicId } = req.params;
    const { userId } = req.query;

    if (!musicId || !userId) {
        return res.json({ 
            deleteOK: false, 
            message: 'Music ID and User ID are required' 
        });
    }

    try {
        const result = await database.query({
            text: `DELETE FROM "user_favorites" 
                   WHERE "user_id" = $1 AND "ms_id" = $2`,
            values: [userId, musicId]
        });

        return res.json({ 
            deleteOK: true, 
            message: "Song removed from favorites" 
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
export async function getFavorites(req, res) {
    console.log(`GET /FAVORITES is requested`);

    // ตรวจสอบว่า userId มีค่าหรือไม่
    if (!req.session.userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const result = await database.query({
            text: `SELECT * FROM "user_favorites" WHERE user_id = $1`,
            values: [req.session.userId]
        });

        // ตรวจสอบว่ามีรายการที่พบหรือไม่
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No favorites found for this user.' });
        }

        return res.json(result.rows);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export async function getFavByUser(req, res) {
    console.log('GET Favs By User Requested');
    console.log('Request body:', req.body);
    
    try {
        if (!req.body.id) {
            return res.status(400).json({
                error: 'User ID is required'
            });
        }

        const result = await database.query({
            text: `SELECT DISTINCT ms_id 
                   FROM "user_favorites"
                   WHERE user_id = $1`,
            values: [req.body.id]
        });

        console.log('Query result:', result.rows);
        return res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error in getFavByUser:', err);
        return res.status(500).json({
            error: err.message
        });
    }
}
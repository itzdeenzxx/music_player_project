import database from "../service/database.js";

export async function getMusicById(req, res) {
    console.log(`GET /musics/${req.params.id} is requested`);
    try {
        const result = await database.query({
            text: `
            SELECT m.*, (
                SELECT row_to_json(playlist_obj)
                FROM (
                    SELECT "play_id", "play_name" FROM Playlists
                    WHERE "play_id" IN (
                        SELECT play_id FROM Playlist_Songs WHERE ms_id = m.ms_id
                    )
                ) AS playlist_obj
            ) AS playlists
            FROM Musics m WHERE m.ms_id = $1`,
            values: [req.params.id]
        });

        return res.status(200).json(result.rows);
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}

export async function deleteMusic(req, res) {
    console.log(`DELETE /musics/${req.params.id} is requested`);

    await database.query({
        text: `DELETE FROM "Musics" WHERE "ms_id" = $1`,
        values: [req.params.id]
    });
    res.status(204).end();
}

export async function putMusic(req, res) {
    console.log(`PUT /musics/${req.params.id} is requested`);
    const bodyData = req.body;

    await database.query({
        text: `UPDATE "Musics" 
               SET "ms_name" = $1,
                   "ms_album" = $2,
                   "ms_type" = $3,
                   "ms_duration" = $4,
                   "ms_path" = $5
               WHERE "ms_id" = $6;`,
        values: [
            req.body.ms_name,
            req.body.ms_album,
            req.body.ms_type,
            req.body.ms_duration,
            req.body.ms_path,
            req.params.id
        ],
    });
    res.status(201).json(bodyData);
}

export async function getAllMusics(req, res) {
    console.log(`GET /musics is requested`);
    try {
        const result = await database.query(`SELECT * FROM Musics`);

        return res.status(200).json(result.rows);
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}

export async function postMusic(req, res) {
    console.log(`POST /musics is requested`);
    const bodyData = req.body;

    try {
        if (!bodyData.ms_name) {
            return res.status(422).json({ error: 'ms_name is required' });
        }

        const result = await database.query({
            text: `INSERT INTO Musics ("ms_name", "ms_album", "ms_type", "ms_duration", "ms_path")
                   VALUES ($1, $2, $3, $4, $5) RETURNING ms_id`,
            values: [
                req.body.ms_name,
                req.body.ms_album,
                req.body.ms_type,
                req.body.ms_duration,
                req.body.ms_path
            ]
        });

        bodyData.ms_id = result.rows[0].ms_id;
        res.status(201).json(bodyData);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export async function getSearchMusic(req, res) {
    console.log(`GET /search/musics/${req.params.id} is requested`);
    try {
        const result = await database.query({
            text: `
            SELECT * FROM Musics 
            WHERE ms_name ILIKE $1
            LIMIT 3`,
            values: [`%${req.params.id}%`]
        });

        return res.status(200).json(result.rows);
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}

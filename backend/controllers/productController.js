import database from "../service/database.js";


export async function getProductByBrandId(req, res) {
    console.log(`get /Products By Brand ${req.params.id} is requested`)
    try {

        // const strQry = 'SELECT * FROM products order by "pd_id"'
        const result = await database.query({
            text: `
            SELECT p.*
            FROM products p WHERE p."brand_id" ILIKE $1`

            , values: [req.params.id]
        })


        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })

    }

}

export async function deleteProduct(req, res) {
    console.log(`Delete /Prodeucts ${req.params.id} is requested`)

    const result = await database.query({
        text: `Delete From "products"
                WHERE "pd_id"=$1`,
        values: [
            req.params.id
        ]
    })
    // build simple dateTime return to Client
    res.status(204).end()
}
export async function putProduct(req, res) {
    console.log(`Put/product/$(req.params) is requested`)
    const bodyDate = req.body
    const result = await database.query({
        text: `UPDATE "public"."products" 
                SET "pd_id"=$1,
                "pd_name"=$2,
                "pd_price"=$3,
	            "pd_remark"=$4, 
	            "pd_typeid"=$5, 
                "brand_id"=$6
                WHERE  "pd_id"=$7;`,
        values: [
            req.body.pd_id,//$1
            req.body.pd_name,//$2
            req.body.pd_price,//$3
            req.body.pd_remark,//$6
            req.body.pd_typeid,//$4
            req.body.brand_id,//$5

            req.params.id
        ],
    })
    res.status(201).json(bodyDate)
}

export async function getProductById(req, res) {
    console.log(`get /Products is requested`)
    try {

        // const strQry = 'SELECT * FROM products order by "pd_id"'
        const result = await database.query({
            text: `
            SELECT p.*, (
			SELECT row_to_json(brand_obj)
			FROM (
					SELECT "brand_id","brand_name" FROM brand
					WHERE "brand_id"= p."brand_id"
					)brand_obj
            )AS thebrand
            FROM products p WHERE p."pd_id" ILIKE $1`

            , values: [req.params.id]
        })


        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })

    }

}
export async function getAllProduct(req, res) {
    console.log(`get /Products is requested`)
    try {

        // const strQry = 'SELECT * FROM products order by "pd_id"'
        const result = await database.query(`
            SELECT p.*, (
			SELECT row_to_json(brand_obj)
			FROM (
					SELECT "brand_id","brand_name" FROM brand
					WHERE "brand_id"= p."brand_id"
					)brand_obj
)AS thebrand
FROM products p 
LEFT JOIN brand b ON p.brand_id = b.brand_id`);

        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })

    }
}

export async function postProduct(req, res) {
    console.log(`Post /products is request `)
    const bodyDate = req.body
    try {
        if (req.body.pd_id == null || req.body.pd_name == null) {
            return res.status(422).json({ error: 'pd_id and pd_name is required' })
        }

        const existsResult = await database.query({
            text: `Select exists (SELECT * FROM products WHERE "pd_id"= $1)`,
            values: [req.body.pd_id]
        })
        if (existsResult.rows[0].exists) {
            return res.status(409).json({ error: `pd_id ${req.body.pd_id}is exists` })
        }
        const result = await database.query({
            text: `Insert Into Products ("pd_id","pd_name","pd_price","pd_typeid","brand_id")
            VALUES ($1,$2,$3,$4,$5)`,
            values: [
                req.body.pd_id,//$1
                req.body.pd_name,//$2
                req.body.pd_price,//$3
                req.body.pd_typeid,//$4
                req.body.brand_id,//$5
            ]
        })
        // build simple dateTime return to Client
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
    const datetime = new Date()
    bodyDate.createDate = datetime
    res.status(201).json(bodyDate)
}
export async function getTenProduct(req, res) {
    console.log(`get /TEN Products is requested`)
    try {

        // const strQry = 'SELECT * FROM products order by "pd_id"'
        const result = await database.query(`
            SELECT p.*, (
			SELECT row_to_json(brand_obj)
			FROM (
					SELECT "brand_id","brand_name" FROM brand
					WHERE "brand_id"= p."brand_id"
					)brand_obj
)AS thebrand
FROM products p 
LIMIT 10`);

        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })

    }
}

export async function getSearchProduct(req, res) {
    console.log(`get /Search Products is request ${req.params.id}`)
    try {

        // const strQry = 'SELECT * FROM products order by "pd_id"'
        const result = await database.query({
            text: `
            SELECT p.*, (
			SELECT row_to_json(brand_obj)
			FROM (
					SELECT "brand_id","brand_name" FROM brand
					WHERE "brand_id"= p."brand_id"
                )brand_obj
            )AS thebrand
            FROM products p 
            WHERE(p."pd_id" ILIKE $1
                    OR  p."pd_name" ILIKE $1
                    OR  p."pd_remark" ILIKE $1)
            LIMIT 3
            `,
            values: [`%${req.params.id}%`]
        }
        );
        
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })

    }
}
import database from "../service/database.js"


// ทำการตรวจสอบว่ามี Session ที่เป็น Cart อยู่หรือไม่แล้วส่งข้อมูลกลับไปให้ Frontend
export async function chkCart(req, res) {
    console.log(`GET CART getCart Check Session is requested`)
    const thedata = {
        id: req.session.cartId,
        qty: req.session.qty,
        money: req.session.money
    }
    console.log("*****" + thedata)
    return res.json(thedata)
}

export async function postCart(req, res) {
    console.log(`POST /CART is requested `)
    // const bodyData=req.body
    try {
        // ก่อนจะ Excuese Query ทำการ Validate Data ก่อน
        if (req.body.cusId == null) {
            return res.json({ cartOK: false, messageAddCart: 'Customer Id is required' })
        }


        // Gen ID
        // จัดรูปแบบวันที่ YYYYMMDD
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มจาก 0 ดังนั้นต้องบวก 1
        const day = String(now.getDate()).padStart(2, '0');
        const currentDate = `${year}${month}${day}`;


        let i = 0;
        let theId = ''
        let existsResult = []
        do {
            i++
            theId = `${currentDate}${String(i).padStart(4, '0')}`
            existsResult = await database.query({
                text: 'SELECT EXISTS (SELECT * FROM carts WHERE "cartId" = $1) ',
                values: [theId]
            })
        }
        while (existsResult.rows[0].exists)


        //ใช้ Parameterized Query เพื่อป้องกันการแทรก Script SQL
        //โดยตัวโครงสร้างเป็น Object,มีคู่ Key:Value สองชุด
        //ชุดแรกเป็น text:queryString โดยใส่ค่าparameterเป็นตัวแปรมี $นำหน้า
        //ชุดที่สองเป็น values:array of values คือค่าที่จะไปแทนในตัวแปรของชุดที่1
        const result = await database.query({
            text: ` INSERT INTO carts ("cartId", "cusId", "cartDate")
                    VALUES ($1,$2,$3) `,
            values: [
                theId, //$1 รหัสที่ Gen มา
                req.body.cusId, //$2 รหัสที่ส่งมาจาก Frontend
                now, //$3 วันปัจจุบัน
            ]
        })
        // กำหนดค่า Session
        req.session.cartId = theId
        req.session.qty = 0
        req.session.money = 0
        console.log(req.session)
        return res.json({ cartOK: true, messageAddCart: theId })
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}
export async function postCartDtl(req, res) {
    console.log(`POST /CARTDETAIL is requested `)
    try {
        // ก่อนจะ Excuese Query ทำการ Validate Data ก่อน
        if (req.body.cartId == null || req.body.pdId == null) {
            return res.json({ cartDtlOK: false, messageAddCartDtl: 'CartId && ProductID is required' })
        }
        // ดูว่ามี Product เดิมอยู่่หรือไม่
        const pdResult = await database.query({
            text: `  SELECT * FROM "cartDtl" ctd
                    WHERE ctd."cartId" = $1
                    AND ctd."pdId" = $2 ` ,
            values: [req.body.cartId,
            req.body.pdId] //ค่า Parameter ที่ส่งมา
        })
        // ถ้าไม่มีให้ INSERT
        if (pdResult.rowCount == 0) {
            try {
                const result = await database.query({
                    text: ` INSERT INTO "cartDtl" ("cartId", "pdId", "qty","price")
                            VALUES ($1,$2,$3,$4) `,
                    values: [
                        req.body.cartId,
                        req.body.pdId,
                        1,
                        req.body.pdPrice
                    ]
                })
                return res.json({ cartDtlOK: true, messageAddCart: req.body.cartId })
            }
            catch (err) {
                return res.json({ cartDtlOK: false, messageAddCartDtl: 'INSERT DETAIL ERROR' })
            }
        }      
        else {// ถ้ามีแล้วให้ UPDATE
            try {
                const result = await database.query({
                    text: ` UPDATE "cartDtl" SET "qty" = $1
                            WHERE "cartId" = $2
                            AND "pdId" = $3 `,
                    values: [
                        pdResult.rows[0].qty + 1,
                        req.body.cartId,
                        req.body.pdId,
                    ]
                })
                return res.json({ cartDtlOK: true, messageAddCart: req.body.cartId })
            }
            catch (err) {
                return res.json({ cartDtlOK: false, messageAddCartDtl: 'INSERT DETAIL ERROR' })
            }
        }
    }
    catch (err) {
        return res.json({ cartDtlOK: false, messageAddCartDtl: 'INSERT DETAIL ERROR' })
    }
}
export async function sumCart(req, res) {
    console.log(`GET SumCart is requested `)
    console.log(req.session.cartId)
    const result = await database.query
    ({
        text: `  SELECT SUM(qty) AS qty,SUM(qty*price) AS money
                FROM "cartDtl" ctd
                WHERE ctd."cartId" = $1` ,
        values: [req.session.cartId]
         //ค่า Parameter ที่ส่งมา
    })
    console.log(result.rows[0])
    return res.json({
        id: req.session.cartId,
        qty: result.rows[0].qty,
        money: result.rows[0].money
    })
}
export async function getCart(req, res) {
    console.log(`GET Cart is Requested`)
    try {
        const result = await database.query({
            text:`  SELECT ct.*, SUM(ctd.qty) AS sqty,SUM(ctd.price*ctd.qty) AS sprice
                    FROM carts ct LEFT JOIN "cartDtl" ctd ON ct."cartId" = ctd."cartId"
                    WHERE ct."cartId"=$1
                    GROUP BY ct."cartId" ` ,
            values:[req.params.id]
        })
        console.log(`id=${req.params.id} \n`+result.rows[0])
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}
export async function getCartDtl(req, res) {
    console.log(`GET CartDtl is Requested`)
    try {
        const result = await database.query({
        text:`  SELECT  ROW_NUMBER() OVER (ORDER BY ctd."pdId") AS row_number,
                        ctd."pdId",pd."pd_name",ctd.qty,ctd.price
                FROM    "cartDtl" ctd LEFT JOIN "products" pd ON ctd."pdId" = pd."pd_id"  
                WHERE ctd."cartId" =$1
                ORDER BY ctd."pdId" ` ,
            values:[req.params.id]
        })
        console.log(`id=${req.params.id} \n`+result.rows[0])
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}
export async function getCartByCus(req, res) {
    console.log(`POST Cart By Customer is Requested`)
    try {
        const result = await database.query({
            text:`  SELECT ROW_NUMBER() OVER (ORDER BY ct."cartId" DESC) AS row_number,
                            ct.*, SUM(ctd.qty) AS sqty,SUM(ctd.price*ctd.qty) AS sprice
                    FROM carts ct LEFT JOIN "cartDtl" ctd ON ct."cartId" = ctd."cartId"
                    WHERE ct."cusId"=$1
                    GROUP BY ct."cartId"
                    ORDER BY ct."cartId" DESC` ,
            values:[req.body.id]
        })
        console.log(`id=${req.params.id} \n`+result.rows[0])
        return res.status(200).json(result.rows)
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        })
    }
}





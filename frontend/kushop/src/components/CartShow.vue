<template>
    <!-- Master --><!-- ถ้าค่าที่อยู่ใน Session กับ CusId ไม่ตรงกันแสดงว่าไม่ใช้ผู้ซื้อไม่มีสิทธิอ่าน -->
    <div v-if="memEmail==cusId">
        <div v-for="(ct, cartId) in cart" :key="cartId" class="mt-5">
            <div class="card bg-light">
                <div class="card-body">
                    <h4 class="card-title text-primary opacity-75">คำสั่งซื้อเลขที่ {{ ct.cartId }}</h4>
                    <h5 class="card-subtitle mt-2 text-muted">
                        สั่งซื้อวันที่ {{ formattedDate(ct.cartDate) }}
                    </h5>
                    <div class="text-danger text-end">
                        จำนวนสินค้า {{ ct.sqty }}ชิ้น, ยอดเงิน {{ ct.sprice.toLocaleString() }} บาท
                    </div>
                    <hr />
                    <a class="btn btn-danger" onclick="return confirm('ยืนยันลบตะกร้า')">
                        <i class="bi-cart-x-fill"></i> ลบตะกร้าสินค้า
                    </a>
                    <a class="btn btn-primary float-end" onclick="return confirm('ยืนยันสั่งสินค้า')">
                        <i class="bi-currency-dollar"></i> ยืนยันสั่งสินค้า
                    </a>
                </div>
            </div> <!--card-->
        </div> <!---v for  -->
   
        <!-- Detail -->
        <table class="table  mt-3 ">
            <tr class="bg-secondary bg-opacity-10">
                <td></td>
                <td>สินค้า</td>
                <td></td>
                <td class="text-end">ราคาต่อหน่วย</td>
                <td class="text-center">จำนวน</td>
                <td class="text-end">เป็นเงิน</td>
                <td></td>
            </tr>
            <tr v-for="(ctd, pdId) in cartDtl" :key="pdId">
                <td>{{ ctd.row_number }}</td>
                <td>{{ ctd.pdId }}</td>
                <td>{{ ctd.pdName }}</td>
                <td class="text-end">{{ ctd.price }}</td>
                <td class="text-center">{{ ctd.qty }}</td>
                <td class="text-end">{{ (ctd.price * ctd.qty).toLocaleString() }}</td>
                <td class="text-center">
                    <i class="bi-x-lg text-danger"></i>
                </td>
            </tr>
        </table>
    </div><!--v-if-->
    <div v-else>
        <div class="alert alert-danger mt-5">คุณไม่มีสิทธิ์ดูรายการนี้</div>
    </div>
</template>
<script>
import axios from 'axios';
axios.defaults.withCredentials = true
export default {
    name: "CartShow",
    data() {
        return {
            cart: [],//รับข้อมูล Master
            cartDtl: [], //รับข้อมูล Detail
            cartId: null,
            memEmail: null,
            cusId:null
        }
    }, 
    async mounted() {
        // ตรวจสอบว่าเป็นเจ้าของตะกร้าหรือไม่
        await this.chkSession()
        this.cartId = this.$route.params.cartId
        // อ่านข้อมูล Master +อ่านข้อมูล Detail 
        await this.getCart()
        await this.getCartDtl()
    },
    methods: {
        // แปลงรูปแบบวันที่
        formattedDate(dateStr) {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = String(date.getMonth()+ 1).padStart(2, '0'); // เดือนเริ่มต้นที่ 0, จึงต้อง +1
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        // Master
        async getCart() {
            console.log('Get Cart')
            await axios.get(`http://localhost:3000/carts/getcart/${this.cartId}`)
                .then(res => {
                    console.log("Cart \n" + res.data)
                    this.cart = res.data
                    this.cusId = res.data[0].cusId
                })
                .catch(err => {
                    console.error(err);
                });
        },
        // Detail
        async getCartDtl() {
            console.log('Get CartCartDtl')
            await axios.get(`http://localhost:3000/carts/getcartdtl/${this.cartId}`)
                .then(res => {
                    console.log("CartDtl \n" + res.data)
                    this.cartDtl = res.data
                })
                .catch(err => {
                    console.error(err);
                });
        },
        // ตรวจสอบ Session
        async chkSession() {
            await axios.get(`http://localhost:3000/members/getss`)
            .then(res => {
                console.log(res.data)
                this.memEmail = res.data.email
            })
            .catch(err => {
                console.error(err);
            });
        }
    }
}
</script>
<style scoped>
.card {
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-5px);
}

.card-title {
    font-size: 1.5rem;
}

.card-body {
    padding: 20px;
}

.table {
    margin-top: 20px;
    border-collapse: collapse;
}

.table th, .table td {
    padding: 12px;
    border: 1px solid #ddd;
}

.table th {
    background-color: #f8f9fa;
}

.text-danger {
    color: #dc3545;
}

.btn {
    border-radius: 20px;
    padding: 10px 15px;
    transition: background-color 0.3s, transform 0.2s;
}

.btn-danger {
    background-color: #dc3545;
    color: white;
}

.btn-danger:hover {
    background-color: #c82333;
    transform: scale(1.05);
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-primary:hover {
    background-color: #0069d9;
    transform: scale(1.05);
}

.alert {
    border-radius: 15px;
    padding: 20px;
    font-size: 1.1rem;
}

.text-muted {
    font-size: 0.9rem;
}

.text-end {
    text-align: right;
}

.text-center {
    text-align: center;
}

.mt-5 {
    margin-top: 3rem;
}
</style>
<template>
    <div v-for="(pd, pd_id) in products" :key="pd_id" class="mt-5">
        <div class="row">
            <div class="col-md-6 col-sm-12">
                <div class="card mx-auto" style="width: 18rem">
                    <img :src="`http://localhost:3000/img_pd/${pd.pd_id}.jpg`" alt="">
                </div>
            </div>
            <div class="col-md-6 col-sm-12">
                <table class="table">
                    <tr class="table-secondary">
                        <td><h4>{{ pd.pd_id }}</h4></td>
                        <td><h4>{{ pd.pd_name }}</h4></td>
                    </tr>
                    <tr>
                        <td><h5>ราคา</h5></td>
                        <td><h5>{{ pd.pd_price }}</h5></td>
                    </tr>
                    <tr>
                        <td><h5>ยี่ห้อ</h5></td>
                        <td><h5>{{ pd.thebrand.brand_name }}</h5></td>
                    </tr>
                    <tr>
                        <td><h5>รายละเอียด</h5></td>
                        <td><h5>{{ pd.pd_remark }}</h5></td>
                    </tr>
                </table>
                <button class="btn btn-primary" @click="chkLogin">
                    <i class="bi bi-cart lead"></i> ใส่ตะกร้า&nbsp;
                </button>
                <button class="btn btn-warning float-end">
                    <i class="bi bi-pencil-fill lead"></i> แก้ไข&nbsp;&nbsp;
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { EventBus } from "../event-bus";

axios.defaults.withCredentials = true;

export default {
    name: 'ProductShow',
    data() {
        return {
            products: [],
            id: null,
            memEmail: null,
            cartId: null,
            backendMessage: ''
        };
    },
    mounted() {
        this.id = this.$route.params.pd_id;
        this.fetchProduct();
    },
    
    methods: {
        async fetchProduct() {
            try {
                const response = await axios.get(`http://localhost:3000/products/${this.id}`);
                this.products = response.data;
            } catch (err) {
                console.error(err);
                alert('Failed to load product data.');
            }
        },

        async chkLogin() {
            await this.chkSession();
            if (!this.memEmail) {
                alert("ต้อง Login เข้าระบบก่อน");
                return;
            }
            await this.chkCart();
            if (!this.cartId) {
                await this.addCart();
            }
            this.addCartDtl();
        },

        async chkSession() {
            try {
                const response = await axios.get(`http://localhost:3000/members/getss`);
                this.memEmail = response.data.email;
            } catch (err) {
                console.error(err);
                alert('Session check failed.');
            }
        },

        async addCart() {
            try {
                const customer = { cusId: this.memEmail };
                const response = await axios.post(`http://localhost:3000/carts/addcart`, customer);
                this.backendMessage = response.data.messageAddCart;
                this.cartId = response.data.messageAddCart;
            } catch (err) {
                console.error(err);
                alert('Failed to create cart.');
            }
        },

        async chkCart() {
            try {
                const response = await axios.get(`http://localhost:3000/carts/chkcart`);
                this.cartId = response.data.id;
            } catch (err) {
                console.error(err);
                alert('Failed to check cart.');
            }
        },

        async addCartDtl() {
            const cartdtl = {
                cartId: this.cartId,
                pdId: this.id,
                pdPrice: this.products[0].pd_price
            };
            try {
                const response = await axios.post(`http://localhost:3000/carts/addcartdtl`, cartdtl);
                EventBus.emit('cartdtlOK');
                this.backendMessage = response.data.messageAddCartDtl;
            } catch (err) {
                console.error(err);
                alert('Failed to add product to cart.');
            }
        }
    }
}
</script>

<style>
/* Add relevant styles here */
</style>
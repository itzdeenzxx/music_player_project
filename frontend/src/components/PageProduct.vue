<template>
    <div>
    <div class="row">
        <div class="col-lg-9 h1">My Product</div>
        <div class="col-lg-2 text-end">
            <input type="text" v-model="stext" class="form-control">
        </div>
        <div class="col">
            <button class="btn btn-primary" @click="searchProduct()">Search</button>
        </div>
    </div>
    <div class="chat">
        <TomatyComponent />
    </div>
    <div class="row">
        <div v-for="(pd, pd_id) in products" :key="pd_id" class="col-lg-4 col-ml-6 col-sm-12">
            <div class="card">
                <span class="border">
                    <img :src="`http://localhost:3000/img_pd/${pd.pd_id}.jpg`" class="card-img-top p-2" alt="">
                </span>
                <div class="card-body">
                    <h5 class="card-title">{{ pd.pd_name }}</h5>
                    <p class="card-text">{{ pd.thebrand.brand_name }} - {{ pd.pd_price }}</p>
                    <router-link :to="{ name: 'ProductShow', params: { pd_id: pd.pd_id } }" style="text-decoration: none;">
                        <div class="btn btn-primary">ดูรายละเอียด</div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import axios from "axios"
import TomatyComponent from './TomatyComponent.vue'
axios.defaults.withCredentials = true
export default {
    name: "PageProduct",
    components : { TomatyComponent } ,
    data() {
        return {
            products: [],
            stext: ''
        }
    },
    mounted() {
        // fetch('http://localhost:3000/products')
        // .then(res=>res.json())
        // .then(data=>this.products=data)
        // .catch(err=>console.log(err.message))
        axios.get('http://localhost:3000/products/ten')
            .then(res => {
                this.products = res.data;
            })
            .catch(err => {
                console.error(err);
            })
            
    },
    methods: {
        searchProduct() {
            axios.get(`http://localhost:3000/products/search/${this.stext}`)
                .then(res => {
                    console.log(this.stext);
                    this.products = res.data;
                })
                .catch(err => {
                    console.error(err);
                })
        }
    }
}
</script>

<style>
/* เพิ่มเงาเมื่อเลื่อนเมาส์เหนือการ์ด */

.card:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

/* ทำให้รูปภาพในการ์ดขยายเต็มความกว้าง */
.card-img-top {
    width: 100%;
    height: auto;
    border: 4px solid #d87272;
}

/* สไตล์สำหรับปุ่ม */
.btn-primary {
    background-color: #3498db;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    color: #fff;
    text-align: center;
    text-decoration: none;
    transition: background-color 0.3s ease;
}

.col-lg-9 {
    background-color: aqua;
}
</style>
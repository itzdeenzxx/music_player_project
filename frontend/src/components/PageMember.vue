<template>
    <div>
    <div class="row ">
        <div class="col-md-6 col-sm-12 ">
            <h3 class="mt-5 text-end">Email : {{ memEmail }}</h3>
            <h5 class="text-end">Username : {{ memName }}</h5>
        </div>
        <div class="col-md-6 col-sm-12 ">
            <div class="card mt-5" style="width: 18rem" v-if="imageExists">
                <img :src="`http://localhost:3000/img_mem/${memEmail}.jpg?timestamp=${imageTimestamp}`"
            :alt="memEmail">
            </div>
            <div class="card mt-5" style="width: 18rem" v-else>
                <img :src="`http://localhost:3000/img_mem/${memEmail}.jpg`" :alt="memEmail">
            </div>
        </div>
    </div>
    <form @submit.prevent="uploadFile">
        <div class="row g-3 mt-3">
            <div class="col-md-6 col-sm-12 "></div>
            <div class="col-auto">
                <input class="form-control" type="file" id="formFile" @change="onFileChange" required />
            </div>
            <div class="col-auto">
                <button class="btn btn-primary" type="submit">Upload</button>
            </div>
        </div>
        <div class="row g-3 mt-3">
            <div class="col-md-6 col-sm-12 ">
            </div>
            <div class="col-auto">
                <div class="alert alert-success" v-if="fileMessage != 'fail' && fileMessage != null">
                {{ fileMessage }}
                </div>
            </div>
            <div class="col-auto"></div>
        </div>
    </form>
</div>
</template>


<script>
import axios from 'axios' //1.import axios มาใช้งาน
axios.defaults.withCredentials = true
export default {
    name: "PageMember",
    data() {
        return {
            memEmail: null,
            memName: null,
            dutyId: null,
            imageExists:false,
            fileMessage: null,
            file: null,
            imageTimestamp: Date.now(), // ใช้เป็น query parameter

        }
    }, async mounted() {
    await this.chkSession();
    this.checkImage()
  },
    methods: { 
        // อ่านค่าจาก input file เมื่อถูกเรียก
        onFileChange(e) {
        this.file = e.target.files[0];
        },
        // ทำการ Uploadfile เมื่อถูกSubmit
        async uploadFile() {
        if (!this.file) {
            this.fileMessage = "เลือก File ก่อน";
            return;
        }
        // อ่านค่าจาก Form เพื่อ POST
        const formData = new FormData();
        formData.append("file", this.file);
        // กำหนด endpoint และกำหนด Header ว่าเป็นการส่ง file
        try {
            const response = await axios.post(
            "http://localhost:3000/users/uploadImg",formData,
            {
                headers: {
                "Content-Type": "multipart/form-data",
                },
            }
            );
            this.fileMessage = response.data.message;
            // ให้ทำการตรวจสอบ image อีกครั้ง
            this.checkImage();
            this.imageTimestamp = Date.now();
        } catch (err) {
            this.fileMessage = "fail";
        }
        },
        async chkSession() {
            await axios.get(`http://localhost:3000/users/getss`)
                .then(res => {
                    console.log(res.data)
                    this.memEmail = res.data.email
                    this.memName = res.data.name
                    this.dutyId = res.data.duty
                    
                })
                .catch(err => {
                    console.error(err);
                });
        },
        checkImage() {
            const image = new Image();
            image.src = `http://localhost:3000/users/${this.memEmail}.jpg`;
            image.onload = () => {
                // รูปภาพโหลดสำเร็จ
                this.imageExists = true;
            };
            image.onerror = () => {
                // รูปภาพไม่สามารถโหลดได้
                this.imageExists = false;
            };
        },
        
    }
}
</script>


<style></style>

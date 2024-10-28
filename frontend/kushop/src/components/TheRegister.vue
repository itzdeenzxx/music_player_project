<template>
    <div class="row d-flex justify-content-center">
        <div class="col-lg-6 col-md-8 col-sm-12 ">
            <form @submit.prevent="handleSubmit()">
                <div class="card row mt-5 " style="background-color: #EEFFEE;">
                    <div class="card-body">
                        <h1 class="card-title text-secondary ">ลงทะเบียนสมาชิกใหม่</h1>
                        <div class="col-lg-12 mb-3">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="memEmail"
                                autocomplete="off" required placeholder="Email" v-model.trim="memEmail" >
                                <label for="memEmail">Email</label>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-3">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="memName"  
                                autocomplete="off" required placeholder="ชื่อ" v-model.trim="memName">
                                <label for="memName">ชื่อ</label>
                            </div>
                        </div>
                        <div class="col-lg-12 mb-3">
                            <div class="form-floating mb-3">
                                <input type="password" class="form-control" id="password"  
                                autocomplete="off" required placeholder="Password" 
                          v-model.trim="password">
                                <label for="password">Password</label>
                            </div>
                        </div>
                        <div class="col-sm-12">
                            <button class="btn btn-primary float-end" type="submit" >
                            <i class="bi bi-check-lg"></i>&nbsp;ตกลง</button>
                        </div>
                    </div>
                </div>
            </form>
            <!-- ส่วนแสดงสถานะ จากการตอบกลับของ Backend -->
            <p v-if="backendMessage=='success'" class="alert alert-success mt-3">
                ลงทะเบียนสำเร็จ-{{ backendMessage }}</p>
            <p v-else-if="backendMessage=='fail'" class="alert alert-danger mt-3">
                ลงทะเบียนผิดพลาด-{{ backendMessage }}</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'TheRegister',
    data(){
        return{ 
            memEmail:null,
            memName:null,
            password:null,
            backendMessage:null
        }
    },
    methods:{
        async handleSubmit(){
            let members={
                memEmail:this.memEmail,
                memName:this.memName,
                password:this.password
            }
            try{
                const response = await axios.post(
                    `http://localhost:3000/members`,members
                )
                this.backendMessage = response.data.messageregister
            }
            catch(err){
                console.log(err)
            }
        }
    }
}
</script>

<style scoped>
.card {
  background-color: #fffdfd;
}
.card-body {
  padding: 2rem;
}
.card-title {
  font-size: 1.5rem;
  font-weight: 500;
}
.form-floating > input::placeholder {
  color: #6c757d;
}
.btn-primary {
  background-color: #007bff;
  border: none;
}
.btn-primary:hover {
  background-color: #0056b3;
}
.alert {
  font-size: 0.875rem;
}
</style>
<template>
  <div class="tomato-container">
    <div class="row mt-5">
      <div class="col-sm-12 col-md-6 col-lg-6 mb-5 image-container">
        <img src="../assets/tomato.png" alt="" width="80%" class="tomato-image">
        <div class="background-circle"></div>
      </div>
      <div class="col-sm-12 col-md-6 col-lg-6 mb-3">
        <form @submit.prevent="handleSubmit()" class="login-form">
          <h2 class="login-title">Welcome Back!</h2>
          <div class="custom-column">
            <div class="form-floating mb-4">
              <input 
                class="form-control tomato-input" 
                type="text" 
                id="loginname" 
                v-model="loginname" 
                autocomplete="off" 
                required
                autofocus 
                placeholder="loginname">
              <label for="loginname">Email or Tel.</label>
            </div>
          </div>
          <div class="col-sm-12 col-md-10 col-lg-8">
            <div class="form-floating mb-4">
              <input 
                class="form-control tomato-input" 
                type="password" 
                id="password" 
                v-model="password" 
                required
                placeholder="Password">
              <label for="password">Password</label>
            </div>
          </div>
          <div class="button-group">
            <router-link to="/register" style="text-decoration: none;">
              <a href="#" class="btn btn-outline-danger register-btn">
                <i class="bi bi-heart-fill"></i>&nbsp;Register</a>
            </router-link>
            <div class="col-sm-12 col-md-6">
              <button class="cta" type="submit" style="width: 6rem;">
                <span>LogIn</span>
                <svg width="15px" height="10px" viewBox="0 0 13 10">
                  <path d="M1,5 L11,5"></path>
                  <polyline points="8 1 12 5 8 9"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <p v-if="backendMessage == 'success'" class="alert alert-success">
      เข้าระบบสำเร็จ - {{ backendMessage }}</p>
    <p v-else-if="backendMessage == 'fail'" class="alert alert-danger">
      เข้าระบบผิดพลาด - {{ backendMessage }}</p>
  </div>
</template>

<script>
import { EventBus } from '../event-bus';
import axios from 'axios';

export default {
  name: 'TheLogin',
  data() {
    return {
      loginname: null,
      password: null,
      backendMessage: null,
      memEmail: null,
      memName: null,
      dutyId: null,
    };
  },
  mounted() {
    if (sessionStorage.getItem('memEmail') != null) {
      this.$router.push('/pagemember');
    }
  },
  methods: {
    async handleSubmit() {
      let members = {
        loginname: this.loginname,
        password: this.password,
      };
      try {
        const response = await axios.post(
          `http://localhost:3000/users/login`, 
          members
        );
        this.backendMessage = response.data.messagelogin;
        
        if (this.backendMessage == 'success') {
          await this.chkSession();
          EventBus.emit('loginok');
          this.$router.push('/pagemember');
        }
      } catch (err) {
        console.log(err);
      }
    },
    async chkSession() {
      await axios.get(`http://localhost:3000/users/getss`)
        .then(res => {
          console.log(res.data);
          this.memEmail = res.data.email;
          this.memName = res.data.name;
          this.dutyId = res.data.duty;
          sessionStorage.setItem('memEmail', res.data.email);
          sessionStorage.setItem('memName', res.data.name);
          sessionStorage.setItem('dutyId', res.data.duty);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

body {
  font-family: 'Poppins', sans-serif;
  background-color: #FFF8F8;
  color: #333;
}

.tomato-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.background-circle {
  position: absolute;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255,99,71,0.1) 0%, rgba(255,99,71,0.05) 50%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  z-index: -1;
}

.tomato-image {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

.login-form {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(255, 99, 71, 0.1);
}

.login-title {
  color: #FF6347;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
}

.tomato-input {
  border: 2px solid #FFE4E1 !important;
  border-radius: 10px !important;
  transition: all 0.3s ease;
}

.tomato-input:focus {
  border-color: #FF6347 !important;
  box-shadow: 0 0 0 0.2rem rgba(255, 99, 71, 0.25) !important;
}

.register-btn {
  background-color: transparent;
  border: 2px solid #FF6347;
  color: #FF6347;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.register-btn:hover {
  background-color: #FF6347;
  color: white;
}

.icon-bar {
  background-color: #FF6347;
  position: sticky;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  box-shadow: 0 2px 10px rgba(255, 99, 71, 0.2);
}

.icon-bar a {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #FFF;
  padding: 10px 15px;
  transition: all 0.3s ease;
}

.icon-bar a:hover {
  transform: translateY(-2px);
}

.icon-bar a i {
  font-size: 18px;
  margin-bottom: 5px;
}

.custom-column {
  width: 100%;
  padding-top: 0;
}

@media (min-width: 768px) {
  .custom-column {
    width: 83.3333%;
  }
}

@media (min-width: 992px) {
  .custom-column {
    width: 66.6667%;
  }
}

/* Original Login Button Styles Preserved */
.cta {
  position: relative;
  margin: auto;
  transition: all 0.2s ease;
  border: none;
  background: none;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 20px;
  display: flex;
  align-items: center;
}

.cta:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  border-radius: 50px;
  background: #A4DAA0;
  width: 45px;
  height: 45px;
  transition: all 0.3s ease;
}

.cta span {
  position: relative;
  font-family: "Ubuntu", sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: black;
}

.cta svg {
  position: relative;
  top: 0;
  margin-left: 5px;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: black;
  stroke-width: 2;
  transform: translateX(-5px);
  transition: all 0.3s ease;
}

.cta:hover:before {
  width: 100%;
  background: #EA9C9C;
}

.cta:hover svg {
  transform: translateX(0);
}

.cta:active {
  transform: scale(0.95);
}

.button-group {
  display: flex;
  justify-content: flex-start;
  gap: 5rem;
  margin-top: 2rem;
}
</style>
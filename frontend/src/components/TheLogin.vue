<template>
  <div class="row mt-5">
    <div class="col-sm-12 col-md-6 col-lg-6 mb-5">
      <img src="../assets/tomato.png" alt="" width="80%">
    </div>
    <div class="col-sm-12 col-md-6 col-lg-6 mb-3">
      <form @submit.prevent="handleSubmit()">
        <div class="custom-column">
          <div class="form-floating mb-3">
            <input class="form-control" type="text" id="loginname" v-model="loginname" autocomplete="off" required
              autofocus placeholder="loginname">
            <label for="loginname">Email or Tel.</label>
          </div>
        </div>
        <div class="col-sm-12 col-md-10 col-lg-8">
          <div class="form-floating mb-3">
            <input class="form-control" type="password" id="password" v-model="password" required
              placeholder="Password">
            <label for="password">Password</label>
          </div>
        </div>
        <div class="button-group">
          <router-link to="/register" style="text-decoration: none;">
            <a href="#" class="btn btn-outline-danger">
              <i class="bi bi-heart-fill"></i>&nbsp;Register</a>
          </router-link>
          <div class="col-sm-12 col-md-6">
            <button class="cta" type="submit" style="width: 6rem;">
              <span>Log In</span>
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
  <p v-if="backendMessage == 'success'" class="alert alert-success ">
    เข้าระบบสำเร็จ - {{ backendMessage }}</p>
  <p v-else-if="backendMessage == 'fail'" class="alert alert-danger">
    เข้าระบบผิดพลาด - {{ backendMessage }}</p>
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
          this.memEmail = res.data.email;   // From session
          this.memName = res.data.name;     // From session
          this.dutyId = res.data.duty;      // From session
          sessionStorage.setItem('memEmail', res.data.email); // Save email in session storage
          sessionStorage.setItem('memName', res.data.name);   // Save name in session storage
          sessionStorage.setItem('dutyId', res.data.duty);    // Save dutyId in session storage
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
  background-color: #F7EDED;
  color: #333;
}

.icon-bar {
  background-color: #BD1D04;
  position: sticky;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
}

.icon-bar a {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #FFF;
  padding: 10px 15px;
}

.icon-bar a i {
  font-size: 18px;
  margin-bottom: 5px;
}

.custom-column {
  width: 100%;
  padding-top: 25%;
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
}

.btn-outline-danger {
  border-color: red;
  color: red;
}
</style>

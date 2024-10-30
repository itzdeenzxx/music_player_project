<template>
  <nav class="navbar navbar-expand-lg custom-navbar">
    <div class="container-fluid">
      <a class="navbar-brand text-white fw-bold" href="#">tomat<img width="25" height="25" src="https://img.icons8.com/fluency/48/tomato.png" alt="tomato"/> musics</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/" style="text-decoration: none;">
              <div class="nav-link text-white">Home</div>
            </router-link>
          </li>
          <li class="nav-item" v-if="memName === null">
            <router-link to="/Login" style="text-decoration: none;">
              <div class="nav-link text-white">Login</div>
            </router-link>
          </li>
          <li class="nav-item" v-else>
            <a href="#" @click="memlogout" style="text-decoration: none;">
              <div class="nav-link text-white">Logout</div>
            </a>
          </li>
          <li class="nav-item">
            <router-link to="/pagemember" style="text-decoration: none;">
              <div class="nav-link text-white fw-bold">{{ memName }}</div>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/cartlist" style="text-decoration: none;">
              <div class="nav-link text-white fw-bold">Cart</div>
            </router-link>
          </li>
        </ul>
        <div class="text-end pe-3">
          <CartInfo />
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true
import CartInfo from './CartInfo.vue';
import { EventBus } from "../event-bus";

export default {
  name: 'MainMenu',
  components: { CartInfo },
  data() {
    return {
      memName: null,
      backendmessage: null
    }
  },
  mounted() {
    this.memName = sessionStorage.getItem('memName');
    EventBus.on('loginok', () => {
      this.memName = sessionStorage.getItem('memName');
    });
  },
  beforeUnmount() {
    EventBus.off('loginok');
  },
  methods: {
    async memlogout() {
      EventBus.emit('memlogout');
      const cf = window.confirm('ต้องการออกจากระบบ?');
      if (cf) {
        try {
          const response = await axios.get(`http://localhost:3000/members/logout`);
          this.backendMessage = response.data.messagelogout;
          if (this.backendMessage == 'success') {
            sessionStorage.clear();
            this.memName = null;
            this.$router.push('/');
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.custom-navbar {
  background-color: #BD1D04 !important;
  font-family: 'Poppins', sans-serif;
}

.navbar-brand {
  color: #FFF !important; 
}
.nav-link {
  color: #FFF !important; 
}

.nav-link:hover {
  color: #f1f1f1 !important; 
}

.navbar-toggler-icon {
  background-color: #FFF; /* White icon for the hamburger menu */
}
</style>

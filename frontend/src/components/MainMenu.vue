<template>
  <nav class="navbar navbar-expand-lg custom-navbar">
    <div class="container-fluid">
      <a class="navbar-brand text-white fw-bold" href="#">tomat<img width="25" height="25"
          src="https://img.icons8.com/fluency/48/tomato.png" alt="tomato" /> musics</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
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
        <div class="d-flex align-items-center">
          <div class="text-end pe-3">
            <CartInfo />
          </div>
          <!-- Search Group -->
          <div class="group ms-3">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
              <g>
                <path
                  d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z">
                </path>
              </g>
            </svg>
            <input class="input" type="search" placeholder="Search" />
          </div>
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
  background-color: #FFF;
  /* White icon for the hamburger menu */
}

/* Search */ 
.group {
  display: flex;
  line-height: 28px;
  align-items: center;
  position: relative;
  max-width: 190px;
}

.input {
  width: 100%;
  height: 40px;
  line-height: 28px;
  padding: 0 1rem;
  padding-left: 2.5rem;
  border: 2px solid transparent;
  border-radius: 8px;
  outline: none;
  background-color: #f3f3f4;
  color: #0d0c22;
  transition: 0.3s ease;
}

.input::placeholder {
  color: #9e9ea7;
}

.input:focus,
input:hover {
  outline: none;
  border-color: rgba(0, 48, 73, 0.4);
  background-color: #fff;
  box-shadow: 0 0 0 4px rgb(0 48 73 / 10%);
}

.icon {
  position: absolute;
  left: 1rem;
  fill: #9e9ea7;
  width: 1rem;
  height: 1rem;
}

</style>

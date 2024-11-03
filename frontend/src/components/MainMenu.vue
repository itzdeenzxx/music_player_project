<template>
  <nav :class="['navbar navbar-expand-lg custom-navbar', { 'navbar-scrolled': isScrolled }]">
    <div class="container-fluid">
      <!-- Brand Logo -->
      <a class="navbar-brand d-flex align-items-center gap-2" href="#">
        <span class="brand-text">tomat</span>
        <img width="28" height="28" src="https://img.icons8.com/fluency/48/tomato.png" alt="tomato" 
          class="brand-logo bounce-animation"/>
        <span class="brand-text">musics</span>
      </a>

      <!-- Mobile Toggle -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar Content -->
      <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
        <ul class="navbar-nav align-items-center">
          <!-- Home Link -->
          <li class="nav-item">
            <router-link to="/" class="nav-link hover-effect">
              <i class="fas fa-home me-1"></i> Home
            </router-link>
          </li>

          <!-- Login/User Menu -->
          <li class="nav-item" v-if="!memName">
            <router-link to="/Login" class="nav-link hover-effect">
              <i class="fas fa-sign-in-alt me-1"></i> Login
            </router-link>
          </li>
          
          <!-- User Dropdown -->
          <li class="nav-item dropdown" v-else>
            <div class="nav-link dropdown-toggle user-menu" 
                 @click="toggleDropdown" 
                 role="button">
              <i class="fas fa-user-circle me-1"></i>
              {{ memName }}
            </div>
            <div class="dropdown-menu" :class="{ show: isDropdownOpen }">
              <router-link to="/pagemember" class="dropdown-item">
                <i class="fas fa-user me-2"></i> Profile
              </router-link>
              <div class="dropdown-divider"></div>
              <a @click="memlogout" class="dropdown-item text-danger">
                <i class="fas fa-sign-out-alt me-2"></i> Logout
              </a>
            </div>
          </li>

          <!-- Favorite Songs -->
          <li class="nav-item">
            <router-link to="/FavoriteSongs" class="nav-link hover-effect">
              <i class="fas fa-heart me-1"></i> Favmusic
            </router-link>
          </li>
        </ul>

        <!-- Search and Cart -->
        <div class="d-flex align-items-center gap-3">
          <div class="cart-wrapper">
            <CartInfo />
          </div>
          
          <!-- Search Form -->
          <form class="search-group" @submit.prevent="handleSearch">
            <div class="search-wrapper">
              <input 
                type="search" 
                class="search-input" 
                placeholder="Search for music..." 
                v-model="searchQuery"
                @keyup.enter="handleSearch"
              />
              <button type="submit" class="search-button">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
import CartInfo from './CartInfo.vue';
import { EventBus } from "../event-bus";

export default {
  name: 'MainMenu',
  components: { CartInfo },
  data() {
    return {
      memName: null,
      backendmessage: null,
      searchQuery: '',
      searchResults: [],
      searchError: null,
      isDropdownOpen: false,
      isScrolled: false
    }
  },
  mounted() {
    this.memName = sessionStorage.getItem('memName');
    EventBus.on('loginok', () => {
      this.memName = sessionStorage.getItem('memName');
    });
    
    // Add scroll event listener
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    EventBus.off('loginok');
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 0;
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    async handleSearch() {
      if (!this.searchQuery.trim()) return;
      
      try {
        const response = await axios.get(`http://localhost:3000/musics/search/${this.searchQuery}`);
        if (response.data && response.data.length > 0) {
          this.searchResults = response.data;
          this.$router.push(`/pagemusic/${this.searchQuery}`);
        } else {
          this.searchError = 'ไม่สามารถพบเพลง';
        }
      } catch (error) {
        console.error('Search error:', error);
        this.searchError = 'เกิดข้อผิดพลาดในการค้นหา';
      }
    },
    async memlogout() {
      EventBus.emit('memlogout');
      const cf = window.confirm('ต้องการออกจากระบบ?');
      if (cf) {
        try {
          const response = await axios.get(`http://localhost:3000/users/logout`);
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
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.custom-navbar {
  background: linear-gradient(135deg, #FF6B6B, #BD1D04);
  font-family: 'Poppins', sans-serif;
  padding: 0.8rem 1rem;
  transition: all 0.3s ease;
}

.navbar-scrolled {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(189, 29, 4, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: 600;
  color: white !important;
  text-decoration: none;
}

.brand-logo {
  transition: transform 0.3s ease;
}

.bounce-animation:hover {
  animation: bounce 0.5s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.nav-link {
  color: white !important;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.hover-effect:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* User Dropdown Styles */
.user-menu {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dropdown-menu {
  background: white;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  margin-top: 0.5rem;
}

.dropdown-item {
  padding: 0.7rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: #f8f9fa;
  transform: translateX(5px);
}

/* Search Styles */
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 300px;
  height: 40px;
  padding: 0.5rem 1rem;
  padding-right: 3rem;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  background: white;
  width: 320px;
}

.search-button {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: #BD1D04;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover {
  background: #FF6B6B;
  transform: translateY(-50%) scale(1.1);
}

/* Cart Wrapper */
.cart-wrapper {
  position: relative;
  margin-right: 1rem;
}

/* Responsive Adjustments */
@media (max-width: 991px) {
  .search-input {
    width: 200px;
  }
  
  .search-input:focus {
    width: 220px;
  }
  
  .navbar-nav {
    margin: 1rem 0;
  }
  
  .dropdown-menu {
    position: static !important;
    float: none;
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>
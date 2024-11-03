<template>
  <div class="container">
    <div class="form-card bounce-in">
      <h1 class="heading">Register to Your Account</h1>
      <form @submit.prevent="handleSubmit" class="form">
        <div class="input-group">
          <div class="input-field">
            <input
              type="email"
              id="userEmail"
              autocomplete="off"
              required
              v-model.trim="userEmail"
              ref="userEmail"
            />
            <label for="userEmail">Email</label>
            <div class="input-border"></div>
          </div>

          <div class="input-field">
            <input
              type="text"
              id="userName"
              autocomplete="off"
              required
              v-model.trim="userName"
            />
            <label for="userName">Name</label>
            <div class="input-border"></div>
          </div>

          <div class="input-field">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="userPassword"
              autocomplete="off"
              required
              v-model.trim="password"
            />
            <label for="userPassword">Password</label>
            <div class="input-border"></div>
            <span @click="togglePasswordVisibility" class="passicon">
              {{ showPassword ? '🙈' : '👀' }}
            </span>
          </div>
        </div>

        <div class="btn-container">
          <button class="btn" type="submit">ตกลง</button>
        </div>
      </form>

      <transition name="fade">
        <p v-if="backendMessage === 'success'" class="message success">
          ลงทะเบียนสำเร็จ <span class="icon">✨</span>
        </p>
        <p v-else-if="backendMessage === 'fail'" class="message error">
          ลงทะเบียนผิดพลาด <span class="icon">😢</span>
        </p>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TheSignIn',
  data() {
    return {
      userEmail: null,
      userName: null,
      password: null,
      backendMessage: null,
      errorMessage: null,
      showPassword: false,
    };
  },
  mounted() {
    this.$refs.userEmail.focus();
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async handleSubmit() {
      const members = {
        userEmail: this.userEmail,
        userName: this.userName,
        password: this.password,
      };
      try {
        const response = await axios.post('http://localhost:3000/users', members);
        this.backendMessage = response.data.messageregister || 'success';
        this.errorMessage = null;
      } catch (err) {
        this.backendMessage = 'fail';
        this.errorMessage = 'Registration failed. Please try again later.';
        console.log(err);
      }
    },
  },
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff5f5;
  padding: 1rem;
  overflow: hidden; /* Prevent bounce overflow */
}

.form-card {
  background: white;
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(255, 182, 193, 0.2);
  width: 100%;
  max-width: 420px;
  transition: transform 0.2s ease;
}

/* Bounce in animation */
.bounce-in {
  animation: bounceIn 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform-origin: center center;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: translateY(-500px);
  }
  60% {
    opacity: 1;
    transform: translateY(30px);
  }
  80% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.form-card:hover {
  transform: translateY(-2px);
}

.heading {
  font-size: 1.5rem;
  color: #ff6b6b;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 600;
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: 0.3s;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.input-field {
  position: relative;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.input-field:nth-child(1) { animation-delay: 0.4s; }
.input-field:nth-child(2) { animation-delay: 0.5s; }
.input-field:nth-child(3) { animation-delay: 0.6s; }

.input-field input {
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  border: none;
  border-radius: 12px;
  background: #fff8f8;
  transition: all 0.3s ease;
}

.input-field label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #ff9999;
  transition: all 0.3s ease;
  pointer-events: none;
  font-size: 0.9rem;
}

.input-field input:focus,
.input-field input:valid {
  background: #fff0f0;
  padding-top: 20px;
  padding-bottom: 4px;
}

.input-field input:focus ~ label,
.input-field input:valid ~ label {
  top: 25%;
  font-size: 0.7rem;
  color: #ff6b6b;
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background: linear-gradient(90deg, #ff6b6b, #ffa5a5);
  transition: width 0.3s ease;
}

.input-field input:focus ~ .input-border {
  width: 100%;
}

.passicon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.passicon:hover {
  opacity: 1;
}

.btn-container {
  text-align: center;
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: 0.7s;
  opacity: 0;
}

.btn {
  padding: 12px 32px;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #ff6b6b, #ffa5a5);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.btn:active {
  transform: translateY(0);
}

.message {
  margin-top: 1.5rem;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.success {
  background: #e8fff3;
  color: #0cc261;
}

.error {
  background: #fff0f0;
  color: #ff6b6b;
}

.icon {
  font-size: 1.2rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
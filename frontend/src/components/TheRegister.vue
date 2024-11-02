<template>
    <div class="container">
      <div class="heading">Sign In to Your Account</div>
      <form @submit.prevent="handleSubmit">
        <div class="input-field">
          <input
            type="text"
            id="userEmail"
            autocomplete="off"
            required
            v-model.trim="userEmail"
            ref="userEmail"
          />
          <label for="userEmail">Email</label>
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
          <span @click="togglePasswordVisibility" class="passicon">
            {{ showPassword ? 'Hide' : 'Show' }}
          </span>
        </div>
        <div class="btn-container">
          <button class="btn" type="submit">ตกลง</button>
        </div>
      </form>
      <!-- Status message -->
      <p v-if="backendMessage === 'success'" class="alert alert-success mt-3">
        ลงทะเบียนสำเร็จ - {{ backendMessage }}
      </p>
      <p v-else-if="backendMessage === 'fail'" class="alert alert-danger mt-3">
        ลงทะเบียนผิดพลาด - {{ backendMessage }}
      </p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'TheRegister',
    data() {
      return {
        userEmail: null,
        userName: null,
        password: null, // updated to match the input field's v-model
        backendMessage: null,
        errorMessage: null,
        showPassword: false,
      };
    },
    mounted() {
      this.$refs.userEmail.focus(); // Focus on the email input when mounted
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
  
  /* Styling from Uiverse.io */
  .container {
    border: solid 1px #8d8d8d;
    padding: 20px;
    border-radius: 20px;
    background-color: #fff;
  }
  
  .container .heading {
    font-size: 1.3rem;
    margin-bottom: 20px;
    font-weight: bold;
  }
  
  .form {
    max-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form .btn-container {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .form .btn {
    padding: 10px 20px;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    border-radius: 10px;
    border: solid 1px #1034aa;
    background: linear-gradient(135deg, #0034de, #006eff);
    color: #fff;
    font-weight: bold;
    transition: all 0.2s ease;
    box-shadow: 0px 2px 3px #000d3848, inset 0px 4px 5px #0070f0, inset 0px -4px 5px #002cbb;
  }
  
  .form .btn:active {
    box-shadow: inset 0px 4px 5px #0070f0, inset 0px -4px 5px #002cbb;
    transform: scale(0.995);
  }
  
  .input-field {
    margin-bottom: 20px;
    position: relative;
  }
  
  .input-field label {
    position: absolute;
    color: #8d8d8d;
    pointer-events: none;
    left: 15px;
    transform: translateY(0.6rem);
    transition: all 0.3s ease;
  }
  
  .input-field input {
    padding: 10px 15px;
    font-size: 1rem;
    border-radius: 8px;
    border: solid 1px #8d8d8d;
    width: 100%;
  }
  
  .input-field input:focus,
  .input-field input:valid {
    outline: none;
    border: solid 1px #0034de;
  }
  
  .input-field input:focus ~ label,
  .input-field input:valid ~ label {
    transform: translateY(-51%) translateX(-10px) scale(0.8);
    background-color: #fff;
    padding: 0px 5px;
    color: #0034de;
    font-weight: bold;
  }
  
  .passicon {
    cursor: pointer;
    font-size: 0.9rem;
    color: #007bff;
    position: absolute;
    top: 10px;
    right: 10px;
  }
  </style>
  
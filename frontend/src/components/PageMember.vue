<template>
    <div class="container">
    <div class="profile-header bounce-in">
      <div class="profile-image bounce-delay">
        <div class="image-wrapper">
          <img
            v-if="imageExists"
            :src="profileImageUrl"
            :alt="memEmail"
            class="profile-pic"
            @error="handleImageError"
          />
          <div v-else class="placeholder">
            <div class="tomato-placeholder">
              <div class="tomato-body"></div>
              <div class="tomato-leaf"></div>
            </div>
          </div>
        </div>
          <div class="tomato-decorations">
            <div class="tiny-tomato t1"></div>
            <div class="tiny-tomato t2"></div>
            <div class="tiny-tomato t3"></div>
          </div>
        </div>
  
        <div class="profile-info slide-in">
          <h2 class="profile-name">{{ memName }}</h2>
          <p class="profile-email">{{ memEmail }}</p>
        </div>
      </div>
  
      <form @submit.prevent="uploadFile" class="upload-form fade-up">
        <label class="upload-label">
          <span class="label-icon">🍅</span>
          อัพโหลดรูปโปรไฟล์
        </label>
        <div class="upload-input-container">
          <input
            type="file"
            @change="onFileChange"
            required
            accept="image/*"
            class="upload-input"
          />
          <button
            type="submit"
            class="upload-button"
            :disabled="!file"
          >
            อัพโหลด
          </button>
        </div>
  
        <div v-if="fileMessage" 
             class="file-message" 
             :class="{ success: fileMessage !== 'fail', error: fileMessage === 'fail' }"
        >
          {{ fileMessage }}
          <span class="message-icon">
            {{ fileMessage !== 'fail' ? '🎉' : '😢' }}
          </span>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
axios.defaults.withCredentials = true

export default {
  name: "PageMember",
  data() {
    return {
      memEmail: null,
      memName: null,
      imageExists: false,
      fileMessage: null,
      file: null,
      imageTimestamp: Date.now(),
      retryCount: 0,
      maxRetries: 3
    }
  },
  
  computed: {
    profileImageUrl() {
      return `http://localhost:3000/img_mem/${this.memEmail}.jpg?timestamp=${this.imageTimestamp}`
    }
  },

  watch: {
    memEmail: {
      immediate: true,
      handler(newEmail) {
        if (newEmail) {
          this.checkImage()
        }
      }
    }
  },
    
  async mounted() {
    await this.chkSession()
  },
  
    methods: {
        handleImageError() {
      if (this.retryCount < this.maxRetries) {
        this.retryCount++
        setTimeout(() => {
          this.imageTimestamp = Date.now()
          this.checkImage()
        }, 1000 * this.retryCount) // เพิ่มเวลารอในแต่ละครั้งที่ retry
      } else {
        this.imageExists = false
        this.retryCount = 0
      }
    },

      onFileChange(e) {
        this.file = e.target.files[0]
        
        if (this.file) {
          if (!this.file.type.match('image.*')) {
            this.fileMessage = 'กรุณาเลือกไฟล์รูปภาพเท่านั้น'
            this.file = null
            return
          }
        }
      },
  
      async uploadFile() {
      if (!this.file) {
        this.fileMessage = "กรุณาเลือกไฟล์ก่อนอัพโหลด"
        return
      }

      const formData = new FormData()
      formData.append("file", this.file)

      try {
        const response = await axios.post(
          "http://localhost:3000/users/uploadImg",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        this.fileMessage = response.data.message
        this.imageTimestamp = Date.now()
        this.retryCount = 0 // รีเซ็ต retry count
        await this.checkImage() // รอให้การเช็คภาพเสร็จสิ้น
        this.file = null
        document.querySelector('input[type="file"]').value = ''
      } catch (err) {
        this.fileMessage = "เกิดข้อผิดพลาดในการอัพโหลด กรุณาลองใหม่อีกครั้ง"
      }
    },
  
      async chkSession() {
        try {
          const res = await axios.get(`http://localhost:3000/users/getss`)
          this.memEmail = res.data.email
          this.memName = res.data.name
        } catch (err) {
          console.error(err)
        }
      },
  
      async checkImage() {
      if (!this.memEmail) return

      return new Promise((resolve) => {
        const image = new Image()
        image.src = this.profileImageUrl

        image.onload = () => {
          this.imageExists = true
          this.retryCount = 0
          resolve(true)
        }

        image.onerror = () => {
          this.handleImageError()
          resolve(false)
        }
      })
    },

    }
  }
  </script>
  
  <style scoped>
  .container {
    min-height: 100vh;
    background: linear-gradient(135deg, #fff5f5 0%, #ffe4e4 100%);
    padding: 3rem 1rem;
    position: relative;
    overflow: hidden;
  }
  
  /* Animation keyframes */
  @keyframes bounce-in {
    0% {
      opacity: 0;
      transform: translateY(-200px);
    }
    60% {
      opacity: 1;
      transform: translateY(25px);
    }
    80% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }
  
  @keyframes slide-in {
    0% {
      opacity: 0;
      transform: translateX(-100px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes fade-up {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Animated classes */
  .bounce-in {
    animation: bounce-in 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .bounce-delay {
    animation: bounce-in 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.2s;
    opacity: 0;
    animation-fill-mode: forwards;
  }
  
  .slide-in {
    animation: slide-in 0.8s ease-out 0.5s;
    opacity: 0;
    animation-fill-mode: forwards;
  }
  
  .fade-up {
    animation: fade-up 0.8s ease-out 0.8s;
    opacity: 0;
    animation-fill-mode: forwards;
  }
  
  /* Profile Header Styles */
  .profile-header {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 2rem;
    padding: 2.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 8px 32px rgba(255, 99, 99, 0.1);
    display: flex;
    align-items: center;
    gap: 3rem;
    position: relative;
  }
  
  .profile-image {
    flex: 1;
    display: flex;
    justify-content: center;
    position: relative;
  }
  
  .image-wrapper {
    position: relative;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    overflow: hidden;
    background: linear-gradient(45deg, #ff6b6b, #ff8787);
    box-shadow: 0 8px 32px rgba(255, 107, 107, 0.2);
    transition: transform 0.3s ease;
  }
  
  .image-wrapper:hover {
    transform: scale(1.05) rotate(5deg);
  }
  
  .profile-pic {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  /* Tomato placeholder styling */
  .tomato-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .tomato-body {
    width: 120px;
    height: 120px;
    background: linear-gradient(45deg, #ff6b6b, #ff8787);
    border-radius: 50%;
    position: relative;
    animation: float 3s ease-in-out infinite;
  }
  
  .tomato-leaf {
    position: absolute;
    width: 40px;
    height: 40px;
    background: #4ade80;
    border-radius: 50% 0;
    top: 20px;
    transform: rotate(-45deg);
    animation: spin 15s linear infinite;
  }
  
  /* Decorative tiny tomatoes */
  .tomato-decorations {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  
  .tiny-tomato {
    position: absolute;
    width: 20px;
    height: 20px;
    background: #ff6b6b;
    border-radius: 50%;
    animation: float 3s ease-in-out infinite;
  }
  
  .t1 { top: -10px; right: 20px; animation-delay: 0.2s; }
  .t2 { bottom: 20px; right: -10px; animation-delay: 0.4s; }
  .t3 { bottom: -10px; left: 20px; animation-delay: 0.6s; }
  
  .profile-info {
    flex: 2;
    text-align: center;
  }
  
  .profile-name {
    font-size: 2.5rem;
    font-weight: bold;
    background: linear-gradient(45deg, #ff6b6b, #ff8787);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }
  
  .profile-email {
    font-size: 1.25rem;
    color: #666;
  }
  
  /* Upload form styling */
  .upload-form {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 2rem;
    padding: 2.5rem;
    box-shadow: 0 8px 32px rgba(255, 99, 99, 0.1);
  }
  
  .upload-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: #ff6b6b;
    margin-bottom: 1.5rem;
  }
  
  .label-icon {
    font-size: 1.5rem;
    animation: float 3s ease-in-out infinite;
  }
  
  .upload-input-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .upload-input {
    flex-grow: 1;
    padding: 1rem;
    border-radius: 1rem;
    border: 2px dashed #ff8787;
    background: rgba(255, 255, 255, 0.8);
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .upload-input:hover {
    border-color: #ff6b6b;
    background: rgba(255, 255, 255, 0.95);
  }
  
  .upload-button {
    padding: 1rem 2rem;
    border-radius: 1rem;
    border: none;
    background: linear-gradient(45deg, #ff6b6b, #ff8787);
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.2);
  }
  
  .upload-button:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
  }
  
  .upload-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .file-message {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    animation: fade-up 0.3s ease-out;
  }
  
  .message-icon {
    font-size: 1.2rem;
    animation: float 3s ease-in-out infinite;
  }
  
  .file-message.success {
    background: rgba(74, 222, 128, 0.1);
    color: #4ade80;
  }
  
  .file-message.error {
    background: rgba(255, 107, 107, 0.1);
    color: #ff6b6b;
  }
  </style>
<template>
  <div>
<div id="body"> 
  
  <div id="chat-circle" class="btn btn-raised">
  <img width="50" height="50" src="https://img.icons8.com/fluency/48/tomato.png" alt="tomato" />
        <div id="chat-overlay">
        </div>
  </div>
  
  <div class="chat-box">
    <div class="chat-box-header">
      Tomaty มะเขือแดง
      <span class="chat-box-toggle"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M15.1 3.1L12.9.9L8 5.9L3.1.9L.9 3.1l5 4.9l-5 4.9l2.2 2.2l4.9-5l4.9 5l2.2-2.2l-5-4.9z"/></svg></span>
    </div>
    <div class="chat-box-body">
      <div class="chat-box-overlay">   
      </div>
      <div class="chat-logs">
       
      </div><!--chat-log -->
    </div>
    <div class="chat-input">      
      <form>
        <input type="text" id="chat-input" placeholder="ส่งคำถามถึงน้องมะเขือ..."/>
      <button type="submit" class="chat-submit" id="chat-submit"><svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M2.345 2.245a1 1 0 0 1 1.102-.14l18 9a1 1 0 0 1 0 1.79l-18 9a1 1 0 0 1-1.396-1.211L4.613 13H10a1 1 0 1 0 0-2H4.613L2.05 3.316a1 1 0 0 1 .294-1.071z" clip-rule="evenodd"/></svg></button>
      </form>      
    </div>
  </div>
</div>
  </div>
</template>
<script>
import $ from 'jquery';
import axios from 'axios';
import { EventBus } from "../event-bus";

export default {
  data(){
    return {
      memName: null
    }
  },
  mounted() {
    this.memName = sessionStorage.getItem('memName');
    EventBus.on('loginok', () => {
      this.memName = sessionStorage.getItem('memName');
    });
    this.INDEX = 0;
    this.generateMessage(
      "สวัสดี คุณ "+ this.memName +" เจ้าค่ะ 😊 น้องมะเขือแดงยินดีให้บริการค่ะ 🍅🎶 ถามอะไรเกี่ยวกับเพลงมาเลยเจ้าค่ะ น้องมะเขือแดงรู้จักเพลงทุกเพลงบนโลกเลยเจ้าค่ะ 🥰",
      'user'
    );

    $("#chat-submit").on("click", (e) => {
      e.preventDefault();
      const msg = $("#chat-input").val().trim();
      
      if (msg) {
        this.generateMessage(msg, 'self');
        $("#chat-input").val('');
        setTimeout(() => {
          this.generateMessage("Chatbot response to: " + msg, 'users');
        }, 1000);
      }
    });

    $("#chat-circle").on("click", () => {
      $("#chat-circle").toggle('scale');
      $(".chat-box").toggle('scale');
    });

    $(".chat-box-toggle").on("click", () => {
      $("#chat-circle").toggle('scale');
      $(".chat-box").toggle('scale');
    });
  },beforeUnmount() {
    EventBus.off('loginok');
  },
  methods: {
    async geminiApi(userMessage) {
      try {
        const response = await axios.post('http://localhost:3000/chat/tomaty', {
          message: userMessage + "ตอบคำถามให้คนชื่อ" + this.memName,
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        return response.data.response.candidates[0].content.parts[0].text;
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
      }
    },
    async generateMessage(msg, type) {
  this.INDEX++;
  if (type === 'users') {
    msg = await this.geminiApi(msg); // ใช้ await เพื่อรอค่า msg ที่เป็นผลลัพธ์จริง
    type = 'user';
  }
  const messageHtml = `
    <div id='cm-msg-${this.INDEX}' class="chat-msg ${type}">
      <span class="msg-avatar">
        <img width="50" height="50" src="https://img.icons8.com/fluency/48/tomato.png" alt="tomato" />
      </span>
      <div class="cm-msg-text">${msg}</div>
    </div>`;
  $(".chat-logs").append(messageHtml);
  $(`#cm-msg-${this.INDEX}`).hide().fadeIn(300);
  
  // Scroll to the latest message
  $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);    
}

  }
};
</script>
 
<style>
#chat-circle {
  position: fixed;
  bottom: 50px;
  right: 50px;
  background: #FF6B6B;
  width: 80px;
  height: 80px;  
  border-radius: 50%;
  color: white;
  padding-top: 15px;
  cursor: pointer;
  box-shadow: 0px 3px 16px 0px rgba(255, 107, 107, 0.6);
  transition: all 0.3s ease;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

#chat-circle:hover {
  transform: scale(1.1);
  background: #FF5252;
}

.chat-box {
  display: none;
  background: #FFF5F5;
  position: fixed;
  right: 30px;
  bottom: 50px;  
  width: 350px;
  max-width: 85vw;
  max-height: 100vh;
  border-radius: 20px;
  box-shadow: 0px 5px 35px 9px rgba(255, 107, 107, 0.2);
  transition: all 0.3s ease;
}

.chat-box-header {
  background: #FF6B6B;
  height: 70px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px; 
  color: white;
  text-align: center;
  font-size: 20px;
  padding-top: 17px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.chat-box-toggle {
  float: right;
  margin-right: 15px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.chat-box-toggle:hover {
  transform: scale(1.2);
}

.chat-box-body {
  position: relative;  
  height: 370px;  
  border: none;
  background: #FFF5F5;
}

#chat-input {
  background: white;
  width: 100%; 
  position: relative;
  height: 47px;  
  padding: 10px 50px 10px 15px;
  border: 2px solid #FFD5D5;
  border-radius: 25px;
  resize: none;
  outline: none;
  color: #666;
  font-size: 14px;
  transition: all 0.3s ease;
}

#chat-input:focus {
  border-color: #FF6B6B;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

#chat-input::placeholder {
  color: #FFB3B3;
}

.chat-submit {  
  position: absolute;
  bottom: 3px;
  right: 10px;
  background: transparent;
  box-shadow: none;
  border: none;
  border-radius: 50%;
  color: #FF6B6B;
  width: 35px;
  height: 35px;
  transition: all 0.3s ease;
}

.chat-submit:hover {
  transform: scale(1.2);
  color: #FF5252;
}

.chat-logs {
  padding: 15px; 
  height: 370px;
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: #FF6B6B #FFF5F5;
  background: #FFF5F5;
}

.chat-logs::-webkit-scrollbar {
  width: 6px;
}

.chat-logs::-webkit-scrollbar-track {
  background: #FFF5F5;
}

.chat-logs::-webkit-scrollbar-thumb {
  background-color: #FF6B6B;
  border-radius: 10px;
}

.chat-msg.user > .msg-avatar img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  float: left;
  box-shadow: 0 2px 6px rgba(255, 107, 107, 0.3);
  border: 2px solid #FFE8E8;
  padding: 2px;
  background: white;
}

.chat-msg.self > .msg-avatar img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  float: right;
  box-shadow: 0 2px 6px rgba(255, 107, 107, 0.3);
  border: 2px solid #FFE8E8;
  padding: 2px;
  background: white;
}

.cm-msg-text {
  background: white;
  padding: 12px 18px;
  color: #666;
  max-width: 75%;
  float: left;
  margin-left: 10px;
  position: relative;
  margin-bottom: 20px;
  border-radius: 18px;
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.1);
  border: 1px solid #FFE8E8;
}

.chat-msg.self > .cm-msg-text {  
  float: right;
  margin-right: 10px;
  background: #FF6B6B;
  color: white;
  border: none;
}

/* Animation for new messages */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.chat-msg {
  clear: both;    
  animation: fadeIn 0.3s ease;
}

/* Responsive adjustments */
@media only screen and (max-width: 500px) {
  .chat-logs {
    height: 40vh;
  }
  
  #chat-circle {
    width: 60px;
    height: 60px;
    bottom: 20px;
    right: 20px;
  }
  
  #chat-circle img {
    width: 35px;
    height: 35px;
  }
}
</style>
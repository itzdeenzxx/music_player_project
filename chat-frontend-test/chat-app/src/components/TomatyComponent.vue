<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <div class="user">
          <strong>User:</strong> <br>{{ message.user }}<br /><br />
        </div>
        <div class="bot">
          <strong>Bot:</strong> <br>{{ message.bot }}
        </div>
      </div>
    </div>
    <input
      v-model="userInput"
      @keyup.enter="sendMessage"
      placeholder="Type your message"
    />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
        userInput: '',
        messages: [],
        errorMessage: '',
    };
},
  methods: {
    async sendMessage() {
        if (this.userInput.trim() === '') return;

        const userMessage = this.userInput;
        this.messages.push({ user: userMessage, bot: '' });
        console.log(userMessage)
        this.userInput = '';
        
        try {
          const response = await axios.post('http://localhost:3000/chat/tomaty', {
              message: userMessage,
          }, {
              headers: {
                  'Content-Type': 'application/json',
              }
          });
          
          const botReply = response.data.response.candidates[0].content.parts[0].text;
          console.log(botReply)
          // this.messages.push({ user: userMessage, bot: botReply });
          this.messages[this.messages.length - 1].bot = botReply;
          this.errorMessage = '';
      } catch (error) {
          this.errorMessage = error.response ? error.response.data : 'Something went wrong!';
          console.error('Error sending message:', this.errorMessage);
      }

    },
},

};
</script>

<style scoped>
.chat-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.messages {
  height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 10px;
}
.message {
  margin-bottom: 10px;
}
</style>

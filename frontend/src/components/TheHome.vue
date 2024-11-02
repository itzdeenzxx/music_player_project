<template>
  <div>
    <div class="chat">
      <TomatyComponent />
  </div>
    <div class="main">
      <div class="currentplaying">
        <svg height="50px" width="50px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" class="spotify">
          <!-- SVG code remains same -->
        </svg>
        <p class="heading">Currently Playing</p>
      </div>
      <div v-for="(music, index) in musics" :key="music.ms_id" 
           class="loader" 
           @click="playMusic(index)">
        <div class="song">
          <p class="name">{{ music.ms_name }}</p>
          <p class="artist">{{ music.ms_album }}</p>
        </div>
        <div class="albumcover"></div>
        <div v-if="currentPlayingIndex === index" class="loading">
          <div class="load"></div>
          <div class="load"></div>
          <div class="load"></div>
          <div class="load"></div>
        </div>
        <div v-else class="play"></div>
      </div>
    </div>

    <div class="card" v-if="currentMusic">
      <div class="top">
        <div class="pfp">
          <div class="playing">
            <div class="greenline line-1"></div>
            <div class="greenline line-2"></div>
            <div class="greenline line-3"></div>
            <div class="greenline line-4"></div>
            <div class="greenline line-5"></div>
          </div>
        </div>
        <div class="texts">
          <p class="title-1">{{ currentMusic.ms_name }}</p>
          <p class="title-2">{{ currentMusic.ms_album }}</p>
        </div>
      </div>

      <div class="youtube-container" v-if="currentMusic">
        <div id="youtube-player"></div>
      </div>

      <div class="controls">
        <svg @click="toggleVolume" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height="20" width="24"
          class="volume_button">
          <path clip-rule="evenodd"
            d="M11.26 3.691A1.2 1.2 0 0 1 12 4.8v14.4a1.199 1.199 0 0 1-2.048.848L5.503 15.6H2.4a1.2 1.2 0 0 1-1.2-1.2V9.6a1.2 1.2 0 0 1 1.2-1.2h3.103l4.449-4.448a1.2 1.2 0 0 1 1.308-.26Z"
            fill-rule="evenodd"></path>
        </svg>
        <div class="volume">
          <div class="slider" @click="adjustVolume">
            <div class="green" :style="{ width: volume + '%' }"></div>
          </div>
          <div class="circle" :style="{ right: (100 - volume) + '%' }"></div>
        </div>
        <svg @click="previousTrack" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
          <path clip-rule="evenodd"
            d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm.848-12.352a1.2 1.2 0 0 0-1.696-1.696l-3.6 3.6a1.2 1.2 0 0 0 0 1.696l3.6 3.6a1.2 1.2 0 0 0 1.696-1.696L11.297 13.2H15.6a1.2 1.2 0 1 0 0-2.4h-4.303l1.551-1.552Z"
            fill-rule="evenodd"></path>
        </svg>
        <svg @click="togglePlay" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
          <path clip-rule="evenodd"
            d="M21.6 12a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 0 1 19.2 0ZM8.4 9.6a1.2 1.2 0 1 1 2.4 0v4.8a1.2 1.2 0 1 1-2.4 0V9.6Zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v4.8a1.2 1.2 0 1 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2Z"
            fill-rule="evenodd"></path>
        </svg>
        <svg @click="nextTrack" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
          <path clip-rule="evenodd"
            d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm4.448-10.448-3.6-3.6a1.2 1.2 0 0 0-1.696 1.696l1.551 1.552H8.4a1.2 1.2 0 1 0 0 2.4h4.303l-1.551 1.552a1.2 1.2 0 1 0 1.696 1.696l3.6-3.6a1.2 1.2 0 0 0 0-1.696Z"
            fill-rule="evenodd"></path>
        </svg>
        <div class="air"></div>
        <svg @click="toggleFavorite" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round"
          stroke-linecap="round" class="heart" :style="{ fill: isFavorite ? 'pink' : 'none' }" stroke="currentColor" height="20" width="24">
          <path
            d="M3.343 7.778a4.5 4.5 0 0 1 7.339-1.46L12 7.636l1.318-1.318a4.5 4.5 0 1 1 6.364 6.364L12 20.364l-7.682-7.682a4.501 4.501 0 0 1-.975-4.904Z">
          </path>
        </svg>
      </div>
      
      <div class="song-time">
        <p class="timetext time_now">{{ formatTime(currentTime) }}</p>
        <div class="time" @click="seekTime">
          <div class="elapsed" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="timetext time_full">{{ formatTime(duration) }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import TomatyComponent from './TomatyComponent.vue';

export default {
  name: 'MusicPlayer',
  data() {
    return {
      musics: [],
      currentPlayingIndex: -1,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 80,
      isFavorite: false,
      player: null,
      isYouTubeApiReady: false,
      playerStates: {
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        BUFFERING: 3,
        CUED: 5
      }
    }
  },
  
  components : { TomatyComponent },
  computed: {
    currentMusic() {
      return this.currentPlayingIndex >= 0 ? this.musics[this.currentPlayingIndex] : null;
    },
    progress() {
      return (this.currentTime / this.duration) * 100 || 0;
    }
  },
  methods: {
    async fetchMusics() {
      try {
        const response = await fetch('http://localhost:3000/musics');
        if (!response.ok) throw new Error('Failed to fetch music data');
        this.musics = await response.json();
      } catch (error) {
        console.error('Error fetching music:', error);
      }
    },
    loadYouTubeAPI() {
  return new Promise((resolve) => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
  });
},

async initYouTubePlayer() {
  if (!window.YT) {
    await this.loadYouTubeAPI();
  }
  
  this.player = new window.YT.Player('youtube-player', {
    height: '200',
    width: '100%',
    playerVars: {
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      modestbranding: 1,
      rel: 0
    },
    events: {
      onReady: this.onPlayerReady,
      onError: (event) => {
        console.error('YouTube Player Error:', event);
      }
    }
  });
},
    getYouTubeIdFromUrl(url) {
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[7].length === 11) ? match[7] : false;
    },
    async playMusic(index) {
  if (this.currentPlayingIndex === index) {
    this.togglePlay();
    return;
  }

  this.currentPlayingIndex = index;
  const videoId = this.getYouTubeIdFromUrl(this.musics[index].ms_path);
  
  if (!videoId) {
    console.error('Invalid YouTube URL');
    return;
  }

  // รอให้ผู้เล่นถูกสร้างขึ้น
  if (!this.player) {
    await this.initYouTubePlayer();
  }

  if (this.player && typeof this.player.loadVideoById === 'function') {
    this.player.loadVideoById(videoId);
    this.isPlaying = true;
  } else {
    console.error('Player not ready or loadVideoById is not a function');
  }
},
    togglePlay() {
      if (!this.player) return;
      
      if (this.isPlaying) {
        this.player.pauseVideo();
      } else {
        this.player.playVideo();
      }
    },
    nextTrack() {
      if (this.currentPlayingIndex < this.musics.length - 1) {
        this.playMusic(this.currentPlayingIndex + 1);
      }
    },
    previousTrack() {
      if (this.currentPlayingIndex > 0) {
        this.playMusic(this.currentPlayingIndex - 1);
      }
    },
    onPlayerStateChange(event) {
      this.isPlaying = event.data === this.playerStates.PLAYING;
      
      if (event.data === this.playerStates.ENDED) {
        this.nextTrack();
      }
    },
    onPlayerReady() {
      if (this.player) {
        this.player.setVolume(this.volume);
      }
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    seekTime(event) {
      const totalWidth = event.currentTarget.offsetWidth;
      const clickX = event.offsetX;
      const newTime = (clickX / totalWidth) * this.duration;
      this.player.seekTo(newTime);
    },
    toggleVolume() {
      this.volume = this.volume === 0 ? 80 : 0;
      if (this.player) {
        this.player.setVolume(this.volume);
      }
    },
    adjustVolume(event) {
      const totalWidth = event.currentTarget.offsetWidth;
      const clickX = event.offsetX;
      const newVolume = (clickX / totalWidth) * 100;
      this.volume = Math.min(Math.max(newVolume, 0), 100);
      if (this.player) {
        this.player.setVolume(this.volume);
      }
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
    },
    async chkLogin() {
            await this.chkSession();
            if (!this.memEmail) {
                alert("ต้อง Login เข้าระบบก่อน");
                return;
            }
            await this.chkCart();
            if (!this.cartId) {
                await this.addCart();
            }
            this.addCartDtl();
        }
  },
  mounted() {
    this.fetchMusics();
  }
}
</script>




<style>
.main {
  background-color: white;
  padding: 1em;
  padding-bottom: 1.1em;
  border-radius: 15px;
  margin: 1em;
}

.loader {
  display: flex;
  flex-direction: row;
  height: 4em;
  padding-left: 1em;
  padding-right: 1em;
  transform: rotate(180deg);
  justify-content: right;
  border-radius: 10px;
  transition: .4s ease-in-out;
}

.loader:hover {
  cursor: pointer;
  background-color: lightgray;
}

.currentplaying {
  display: flex;
  margin: 1em;
}

.spotify {
  width: 50px;
  height: 50px;
  margin-right: 0.6em;
}

.heading {
  color: black;
  font-size: 1.1em;
  font-weight: bold;
  align-self: center;
}

.loading {
  display: flex;
  margin-top: 1em;
  margin-left: 0.3em;
}

.load {
  width: 2px;
  height: 33px;
  background-color: limegreen;
  animation: 1s move6 infinite;
  border-radius: 5px;
  margin: 0.1em;
}

.load:nth-child(1) {
  animation-delay: 0.2s;
}

.load:nth-child(2) {
  animation-delay: 0.4s;
}

.load:nth-child(3) {
  animation-delay: 0.6s;
}

.play {
  position: relative;
  left: 0.35em;
  height: 1.6em;
  width: 1.6em;
  clip-path: polygon(50% 50%, 100% 50%, 75% 6.6%);
  background-color: black;
  transform: rotate(-90deg);
  align-self: center;
  margin-top: 0.7em;
  justify-self: center;
}

.albumcover {
  position: relative;
  margin-right: 1em;
  height: 40px;
  width: 40px;
  background-color: rgb(233, 232, 232);
  align-self: center;
  border-radius: 5px;
}

.song {
  position: relative;
  transform: rotate(180deg);
  margin-right: 1em;
  color: black;
  align-self: center;
}

.artist {
  font-size: 0.6em;
}

@keyframes move6 {
  0% {
    height: 0.2em;
  }

  25% {
    height: 0.7em;
  }

  50% {
    height: 1.5em;
  }

  100% {
    height: 0.2em;
  }
}
.card {
  position: relative;
  min-width: 100%;
  min-height: 100%;
  background: white;
  border-radius: 10px;
  padding: .5rem;
  display: flex;
  flex-direction: column;
  gap: .3rem;
  box-shadow: 0 10px 40px -25px rgba(100, 100, 100, .5);
  margin-top: 5%;
}


.top {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-block-end: .5rem;
}

.pfp {
  position: relative;
  height: 40px;
  width: 40px;
  background-color: white;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-1 {
  color: black;
  font-size: 1.25rem;
  font-weight: 900;
}

.title-2 {
  color: black;
  font-size: .75rem;
  opacity: .8;
}

/* new */
.song-time {
  width: 100%;
  margin-inline: auto;
  position: relative;
  display: flex;
  align-items: center;
  gap: .3rem;
}

.time {
  width: 90%;
  background-color: #5e5e5e;
  height: .35rem;
  border-radius: 3px;
}

.elapsed {
  width: 42%;
  background-color: #1db954;
  height: 100%;
  border-radius: 3px;
}

.controls {
  color: black;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
}

.volume {
  height: 100%;
  width: 48px;
}

.air {
  height: 100%;
  width: 48px;
}

.controls svg {
  cursor: pointer;
  transition: 0.1s;
}

.controls svg:hover {
  color: #1db954;
}

.controls .heart:hover {
  color: pink;
}

.volume {
  opacity: 0;
  position: relative;
  transition: 0.2s;
}

.volume .slider {
  height: 4px;
  background-color: #5e5e5e;
  width: 80%;
  border-radius: 2px;
  margin-left: .3rem;
}

.volume .slider .green {
  background-color: #1db954;
  height: 100%;
  width: 80%;
  border-radius: 3px;
}

.volume .circle {
  background-color: white;
  height: 6px;
  width: 6px;
  border-radius: 3px;
  position: absolute;
  right: 20%;
  top: 50%;
  transform: translateY(-50%);
}

.volume_button:hover~.volume {
  opacity: 1;
}

.timetext {
  color: white;
}

.time_now {
  font-size: .8rem;
  background-color: #00000060;
  padding: .5rem;
  border-radius: .5rem;
  background-blend-mode: multiply;
}

.time_full {
  font-size: .8rem;
  background-color: #00000060;
  padding: .5rem;
  border-radius: .5rem;
  background-blend-mode: multiply;
}

.playing {
  display: flex;
  position: relative;
  justify-content: center;
  gap: 1px;
  width: 30px;
  height: 20px;
}

.greenline {
  background-color: #1db954;
  height: 20px;
  width: 2px;
  position: relative;
  transform-origin: bottom;
}

.line-1 {
  animation: infinite playing 1s ease-in-out;
  animation-delay: 0.2s;
}

.line-2 {
  animation: infinite playing 1s ease-in-out;
  animation-delay: 0.5s;
}

.line-3 {
  animation: infinite playing 1s ease-in-out;
  animation-delay: 0.6s;
}

.line-4 {
  animation: infinite playing 1s ease-in-out;
  animation-delay: 0s;
}

.line-5 {
  animation: infinite playing 1s ease-in-out;
  animation-delay: 0.4s;
}

@keyframes playing {
  0% {
    transform: scaleY(0.1);
  }

  33% {
    transform: scaleY(0.6);
  }

  66% {
    transform: scaleY(0.9);
  }

  100% {
    transform: scaleY(0.1);
  }
}
.youtube-container {
  width: 100%;
  margin: 10px 0;
  border-radius: 8px;
  overflow: hidden;
}

#youtube-player {
  width: 100%;
  aspect-ratio: 16/9;
}
.chat {
  z-index: 9999;
    position: absolute;
}
</style>
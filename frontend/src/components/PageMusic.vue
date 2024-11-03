<template>
    <div class="container mt-4">
      <div class="row">
        <!-- Music Player Section -->
        <div v-if="selectedMusic" class="col-12 mb-4">
          <div class="card tomato-card">
            <div class="card-body">
              <div class="youtube-container" :class="{ 'no-padding': noPadding }">
                <div id="youtube-player">
                  <div class="tomato-placeholder">
                    <div class="tomato-icon">🍅</div>
                    <h2>Select Your Tomato Tune!</h2>
                  </div>
                </div>
              </div>
              <div class="mt-3">
                <h4 class="tomato-title">{{ selectedMusic.ms_name }} <span class="tomato-icon">🍅</span></h4>
                <p class="text-muted">
                  <span class="tomato-detail">Album: {{ selectedMusic.ms_album }}</span> • 
                  <span class="tomato-detail">Type: {{ selectedMusic.ms_type }}</span> • 
                  <span class="tomato-detail">Duration: {{ formatDuration(selectedMusic.ms_duration) }}</span>
                </p>
  
                <!-- Custom Player Controls -->
                <div class="custom-player-controls">
                  <!-- Timeline -->
                  <div class="timeline-container">
                    <input 
                      type="range" 
                      class="timeline" 
                      :value="currentTime"
                      :max="duration"
                      @input="handleTimelineChange"
                    >
                    <div class="time-display">
                      {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                    </div>
                  </div>
  
                  <!-- Control Buttons -->
                  <div class="controls-container">
                    <button @click="togglePlay" class="control-btn">
                      <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
                    </button>
                    <button @click="toggleLoop" :class="['control-btn', { active: isLooping }]">
                      <i class="fas fa-redo"></i>
                    </button>
                    <button @click="stopVideo" class="control-btn">
                      <i class="fas fa-stop"></i>
                    </button>
                    <button 
                      @click="toggleFavorite(selectedMusic)" 
                      class="control-btn"
                      :class="{ 'active': isFavorite(selectedMusic.ms_id) }"
                    >
                      <i class="fas fa-heart" :class="{ 'text-danger': isFavorite(selectedMusic.ms_id) }"></i>
                    </button>
                  </div>
                  <div @click="hideMV()" class="btn-hide">
                    <button class="tomato-btn">Hide Music Video 🍅</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Music Grid -->
        <div class="col-12">
          <h2 class="mb-4 tomato-heading">{{ title }} <span class="tomato-icon">🍅</span></h2>
          
          <div v-if="loading" class="text-center py-5">
            <div class="tomato-spinner">🍅</div>
          </div>
  
          <div v-else-if="error" class="alert alert-warning tomato-alert" role="alert">
            {{ error }}
          </div>
  
          <div v-else-if="musicList.length === 0" class="alert alert-info tomato-alert" role="alert">
            ไม่พบเพลงที่ต้องการ 🍅
          </div>
        
          <div v-else class="row row-cols-1 row-cols-md-3 g-4">
            <div v-for="music in musicList" :key="music.ms_id" class="col">
              <div class="card h-100 music-card tomato-music-card">
                <div class="card-body">
                  <h5 class="card-title">{{ music.ms_name }}</h5>
                  <p class="card-text">
                    <small class="text-muted">
                      Album: {{ music.ms_album }}<br>
                      Type: {{ music.ms_type }}<br>
                      Duration: {{ formatDuration(music.ms_duration) }}
                    </small>
                  </p>
                  <div class="d-flex gap-2">
                    <button 
                      @click="playMusic(music)" 
                      class="tomato-play-btn flex-grow-1"
                    >
                      <i class="fas fa-play"></i> Play
                    </button>
                    <button 
                      @click="toggleFavorite(music)"
                      class="tomato-fav-btn"
                      :class="isFavorite(music.ms_id) ? 'active' : ''"
                    >
                      <i class="fas fa-heart"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
 import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
axios.defaults.withCredentials = true


export default {
  name: 'PageMusic',
  data() {
    return {
      musicList: [],
      selectedMusic: null,
      loading: true,
      error: null,
      title: 'All Music',
      player: null,
      isPlaying: false,
      isLooping: false,
      currentTime: 0,
      duration: 0,
      timeUpdateInterval: null,
      noPadding: false,
      favorites: new Set(),
    };
  },async mounted() {
    await this.chkSession()
  },

  async created() {
    try {
      this.loadYouTubeAPI();
      await this.fetchAllMusic();
      await this.fetchFavorites();
      
      const searchQuery = this.$route.params.query;
      if (searchQuery) {
        this.title = `Search Results: "${searchQuery}"`;
        await this.searchMusic(searchQuery);
      }
    } catch (error) {
      console.error('Error in component creation:', error);
      this.error = 'An error occurred while loading the application.';
    }
  },
    methods: {
        async chkSession() {
    try {
        const res = await axios.get('http://localhost:3000/users/getss');
        if (res.data && res.data.id) {
            this.userId = res.data.id;
            this.memEmail = res.data.email;
            this.memName = res.data.name;
            console.log("User ID:", this.userId);
        } else {
            console.warn("User ID not found in session data:", res.data);
            this.error = 'User ID not found in session.';
        }
    } catch (err) {
        console.error('Error fetching session:', err);
        this.error = 'Failed to load session data.';
    }
}
,
      loadYouTubeAPI() {
        if (!window.YT) {
          const tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
          window.onYouTubeIframeAPIReady = () => {
            this.initializeYouTubePlayer();
          };
        } else {
          this.initializeYouTubePlayer();
        }
      },
      initializeYouTubePlayer() {
        if (this.selectedMusic) {
          const videoId = this.extractVideoId(this.selectedMusic.ms_path);
          this.player = new window.YT.Player('youtube-player', {
            height: '720',
            width: '1280',
            videoId: videoId,
            playerVars: {
              controls: 0,
              disablekb: 1,
              enablejsapi: 1,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              autoplay: 1
            },
            events: {
              onReady: this.onPlayerReady,
              onStateChange: this.onPlayerStateChange
            }
          });
        }
      },
      onPlayerReady(event) {
        event.target.playVideo();
        this.duration = this.player.getDuration();
        this.startTimeUpdate();
      },
      onPlayerStateChange(event) {
        this.isPlaying = event.data === window.YT.PlayerState.PLAYING;
        
        // Handle loop
        if (event.data === window.YT.PlayerState.ENDED && this.isLooping) {
          this.player.seekTo(0);
          this.player.playVideo();
        }
      },
      startTimeUpdate() {
        this.timeUpdateInterval = setInterval(() => {
          if (this.player && this.isPlaying) {
            this.currentTime = this.player.getCurrentTime();
          }
        }, 1000);
      },
      async fetchAllMusic() {
        this.loading = true;
        try {
          const response = await axios.get('http://localhost:3000/musics');
          this.musicList = response.data;
        } catch (error) {
          console.error('Error fetching music:', error);
          this.error = 'Failed to load music. Please try again later.';
        } finally {
          this.loading = false;
        }
      },
      async searchMusic(query) {
        this.loading = true;
        try {
          const response = await axios.get(`http://localhost:3000/musics/search/${query}`);
          this.musicList = response.data;
        } catch (error) {
          console.error('Error searching music:', error);
          this.error = 'Failed to search music. Please try again later.';
        } finally {
          this.loading = false;
        }
      },
      extractVideoId(url) {
        const regex = /(?:embed\/|v=|\/)([\w-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
      },
      playMusic(music) {
        this.selectedMusic = music;
        if (this.player) {
          this.player.destroy();
        }
        this.initializeYouTubePlayer();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      togglePlay() {
        try {
          if (this.isPlaying) {
            this.player.pauseVideo();
          } else {
            this.player.playVideo();
          }
        } catch (err) {
          alert("Please select music");
        }
      },
      toggleLoop() {
        this.isLooping = !this.isLooping;
      },
      stopVideo() {
        try {
          if (this.player) {
            this.player.stopVideo();
          }
        } catch (err) {
          alert("Please select music");
        }
      },
      handleTimelineChange(event) {
        const newTime = event.target.value;
        this.player.seekTo(newTime);
      },
      formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
      },
      formatDuration(duration) {
        const minutes = Math.floor(duration / 60);
        const secs = Math.floor(duration % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
      },
      isFavorite(musicId) {
      return this.favorites.has(musicId);
    },

    async fetchFavorites() {
      try {
        // Fix: Update endpoint URL
        const response = await axios.post('http://localhost:3000/favs/getfavsbyuser', {
          id: this.userId
        });
        
        if (response.data && Array.isArray(response.data)) {
          // Add debugging log
          console.log('Favorites data received:', response.data);
          
          // Convert favorite data to Set of music IDs
          this.favorites = new Set(response.data.map(fav => fav.ms_id));
          
          // Add debugging log
          console.log('Favorites set created:', Array.from(this.favorites));
        } else {
          console.warn('Unexpected favorites data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        // Add more detailed error logging
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        }
        this.error = 'Failed to load favorites';
      }
    },hideMV() {
    if (this.player) {
      // แค่ซ่อน iframe แต่ยังให้เสียงเล่นอยู่
      this.noPadding = !this.noPadding;
      const playerElement = document.getElementById('youtube-player');
      if (this.noPadding) {
        playerElement.style.visibility = 'hidden'; // ซ่อนวิดีโอ
      } else {
        playerElement.style.visibility = 'visible'; // แสดงวิดีโอ
      }
    }
  },

    async toggleFavorite(music) {
      if (!music?.ms_id) {
        console.error('Invalid music selection');
        return;
      }

      try {
        if (this.isFavorite(music.ms_id)) {
          // Remove from favorites
          const response = await axios.get(`http://localhost:3000/favs/getfavsdtl/${music.ms_id}`, {
            params: { userId: this.userId }
          });

          if (response.data.deleteOK) {
            const newFavorites = new Set(this.favorites);
            newFavorites.delete(music.ms_id);
            this.favorites = newFavorites;
            console.log('Removed from favorites:', music.ms_id);
          } else {
            throw new Error(response.data.message || 'Failed to remove from favorites');
          }
        } else {
          // Add to favorites
          const response = await axios.post('http://localhost:3000/favs/addfavs', {
            userId: this.userId,
            musicId: music.ms_id
          });

          if (response.data.favoriteOK) {
            const newFavorites = new Set(this.favorites);
            newFavorites.add(music.ms_id);
            this.favorites = newFavorites;
            console.log('Added to favorites:', music.ms_id);
          } else {
            throw new Error(response.data.messageAddFavorite || 'Failed to add to favorites');
          }
        }
      } catch (error) {
        console.error('Error updating favorites:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        }
        this.error = error.response?.data?.error || error.message || 'Failed to update favorites';
      }
    },

    
    }
  };
  </script>
 
  
 <style scoped>
 .tomato-card {
   border: 2px solid #ff6b6b;
   border-radius: 20px;
   box-shadow: 0 4px 12px rgba(255, 107, 107, 0.1);
 }
 
 .tomato-placeholder {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   height: 200px;
   background-color: #fff5f5;
   border-radius: 15px;
 }
 
 .tomato-icon {
   font-size: 2rem;
   margin-bottom: 1rem;
 }
 
 .tomato-title {
   color: #ff6b6b;
   font-weight: 600;
 }
 
 .tomato-heading {
   color: #ff6b6b;
   font-weight: 600;
   display: flex;
   align-items: center;
   gap: 0.5rem;
 }
 
 .tomato-spinner {
   font-size: 3rem;
   animation: spin 2s linear infinite;
 }
 
 @keyframes spin {
   from { transform: rotate(0deg); }
   to { transform: rotate(360deg); }
 }
 
 .tomato-alert {
   border: none;
   background-color: #fff5f5;
   color: #ff6b6b;
   border-radius: 15px;
 }
 
 .tomato-music-card {
   border: 2px solid #ffd8d8;
   border-radius: 15px;
   transition: all 0.3s ease;
 }
 
 .tomato-music-card:hover {
   transform: translateY(-5px);
   border-color: #ff6b6b;
   box-shadow: 0 4px 12px rgba(255, 107, 107, 0.15);
 }
 
 .tomato-play-btn {
   background-color: #ff6b6b;
   color: white;
   border: none;
   border-radius: 25px;
   padding: 8px 16px;
   transition: all 0.3s ease;
 }
 
 .tomato-play-btn:hover {
   background-color: #ff5252;
   transform: scale(1.02);
 }
 
 .tomato-fav-btn {
   background-color: #fff5f5;
   color: #ff6b6b;
   border: 2px solid #ff6b6b;
   border-radius: 50%;
   width: 40px;
   height: 40px;
   display: flex;
   align-items: center;
   justify-content: center;
   transition: all 0.3s ease;
 }
 
 .tomato-fav-btn.active {
   background-color: #ff6b6b;
   color: white;
 }
 
 .tomato-btn {
   border: none;
   color: white;
   background-color: #ff6b6b;
   border-radius: 25px;
   font-family: inherit;
   font-size: 17px;
   padding: 0.6em 1.5em;
   transition: all 0.3s ease;
 }
 
 .tomato-btn:hover {
   background-color: #ff5252;
   transform: scale(1.05);
   box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
 }
 
 .timeline {
   width: 100%;
   height: 4px;
   background: #ffd8d8;
   border-radius: 2px;
   cursor: pointer;
   margin-bottom: 0.5rem;
 }
 
 .timeline::-webkit-slider-thumb {
   background: #ff6b6b;
 }
 
 .timeline::-moz-range-thumb {
   background: #ff6b6b;
 }
 
 .control-btn {
   color: #ff6b6b;
   border: 2px solid #ffd8d8;
   border-radius: 50%;
   width: 40px;
   height: 40px;
   transition: all 0.3s ease;
 }
 
 .control-btn:hover {
   background: #fff5f5;
   border-color: #ff6b6b;
 }
 
 .control-btn.active {
   color: white;
   background: #ff6b6b;
   border-color: #ff6b6b;
 }
 
 .custom-player-controls {
   background: #fff5f5;
   border-radius: 15px;
   padding: 1.5rem;
   margin-top: 1.5rem;
 }
 
 .time-display {
   color: #ff6b6b;
   font-size: 0.9rem;
 }
 
 .tomato-detail {
   background-color: #fff5f5;
   padding: 4px 8px;
   border-radius: 12px;
   font-size: 0.9rem;
 }
 #youtube-player.hidden {
  display: none;
}

 </style>
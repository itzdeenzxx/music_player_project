<template>
  <div class="tomato-favorites-container">
    <div class="floating-tomatoes">
      <div class="tomato" v-for="n in 5" :key="n">🍅</div>
    </div>
    
    <div class="favorites-wrapper">
      <!-- Header -->
      <div class="favorites-header">
        <div class="tomato-title">
          <span class="tomato-bounce">🍅</span>
          <h1>My Tomato Tunes</h1>
          <span class="tomato-bounce">🍅</span>
        </div>
        <p>Your juicy collection of favorite songs</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="tomato-spinner">
          <span class="tomato-spin">🍅</span>
        </div>
        <p>Picking fresh tomatoes...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="error-message">
        <span class="error-tomato wiggle">🍅</span>
        <p>{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && favorites.length === 0" class="empty-state">
        <div class="empty-tomato bounce">🍅</div>
        <p>Your tomato garden is empty!</p>
        <button @click="goToMusic" class="tomato-button">
          Plant Some Tunes 🍅
        </button>
      </div>

      <!-- Favorites Grid -->
      <div v-if="!loading && favorites.length > 0" class="favorites-grid">
        <div 
  v-for="song in favorites" 
  :key="song.ms_id"
  class="tomato-card"
>
  <div class="tomato-card-content">
    <div class="song-info">
      <div class="song-header">
        <span class="tiny-tomato">🍅</span>
        <h3>{{ song[0].ms_name }}</h3>
      </div>
      <p class="album">Album: {{ song[0].ms_album }}</p>
      <div class="song-details">
        <span class="song-type">{{ song[0].ms_type }}</span>
        <span class="duration">{{ formatDuration(song[0].ms_duration) }}</span>
      </div>
    </div>
    <button
      @click="removeFavorite(song.ms_id)"
      :disabled="removingId === song.ms_id"
      class="remove-button"
      :class="{ 'removing': removingId === song.ms_id }"
    >
      <span v-if="removingId !== song.ms_id">❌</span>
      <span v-else class="removing-tomato">🍅</span>
    </button>
  </div>
</div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FavoriteSongs',
  data() {
    return {
      favorites: [],
      loading: true,
      error: null,
      removingId: null,
      userId: null
    };
  },
  async created() {
    await this.getUserId();
    if (this.userId) {
      await this.fetchFavorites();
    }
  },
  methods: {
    formatDuration(seconds) {
      if (!seconds) return '--:--';
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    
    async getUserId() {
      try {
        const response = await axios.get('http://localhost:3000/users/getss');
        if (response.data && response.data.id) {
          this.userId = response.data.id;
        } else {
          this.error = 'Unable to load user session.';
        }
      } catch (err) {
        console.error('Error fetching user session:', err);
        this.error = 'Failed to load user session.';
      }
    },

    async fetchFavorites() {
    try {
        this.loading = true;
        this.error = null;
        const response = await axios.get(`http://localhost:3000/favs/getfavs/${this.userId}`);
        
        console.log('Favorites API Response:', response.data);
        
        const favoritesWithDetails = await Promise.all(
            response.data.map(async (fav) => {
                try {
                    const musicResponse = await axios.get(`http://localhost:3000/musics/${fav.ms_id}`);
                    console.log('Music Details Response:', musicResponse.data);
                    return { ...fav, ...musicResponse.data };
                  } catch (err) {
                    console.error(`Error fetching details for music ${fav.ms_id}:`, err);
                    return fav;
                  }
                })
              );
              
              this.favorites = favoritesWithDetails;
        console.log('Final Favorites:', favoritesWithDetails);
    } catch (err) {
        console.error('Error fetching favorites:', err);
        this.error = 'Unable to load your favorite songs.';
    } finally {
        this.loading = false;
    }
}
,

    async removeFavorite(musicId) {
      try {
        this.removingId = musicId;
        await axios.get(`http://localhost:3000/favs/getfavsdtl/${musicId}`, {
          params: { userId: this.userId }
        });
        this.favorites = this.favorites.filter(song => song.ms_id !== musicId);
      } catch (err) {
        console.error('Error removing favorite:', err);
        this.error = 'Failed to remove song from favorites.';
      } finally {
        this.removingId = null;
      }
    },

    goToMusic() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.tomato-favorites-container {
  min-height: 100vh;
  background-color: #fff5f5;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.floating-tomatoes {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-tomatoes .tomato {
  position: absolute;
  font-size: 2rem;
  animation: float 15s infinite linear;
  opacity: 0.2;
}

.floating-tomatoes .tomato:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
.floating-tomatoes .tomato:nth-child(2) { top: 30%; right: 20%; animation-delay: -3s; }
.floating-tomatoes .tomato:nth-child(3) { top: 50%; left: 30%; animation-delay: -6s; }
.floating-tomatoes .tomato:nth-child(4) { top: 70%; right: 15%; animation-delay: -9s; }
.floating-tomatoes .tomato:nth-child(5) { top: 85%; left: 25%; animation-delay: -12s; }

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, 30px) rotate(120deg); }
  66% { transform: translate(-20px, 50px) rotate(240deg); }
  100% { transform: translate(0, 0) rotate(360deg); }
}

.favorites-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.tomato-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.tomato-bounce {
  font-size: 2.5rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.favorites-header {
  margin-bottom: 2rem;
  text-align: center;
}

.favorites-header h1 {
  font-size: 2.5rem;
  color: #ff6b6b;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.favorites-header p {
  color: #ff8787;
  font-size: 1.1rem;
}

.loading-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.1);
}

.tomato-spinner {
  display: inline-block;
  margin-bottom: 1rem;
}

.tomato-spin {
  font-size: 3rem;
  display: inline-block;
  animation: spin 1.5s infinite linear;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background-color: #fff0f0;
  border: 2px solid #ff8787;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 15px;
  display: flex;
  align-items: center;
}

.error-tomato {
  margin-right: 0.8rem;
  font-size: 1.5rem;
}

.wiggle {
  display: inline-block;
  animation: wiggle 1s infinite;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.1);
}

.empty-tomato {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: inline-block;
}

.tomato-button {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.2);
}

.tomato-button:hover {
  background-color: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.tomato-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.1);
  transition: all 0.3s ease;
  border: 2px solid #ffd8d8;
}

.tomato-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.2);
  border-color: #ff6b6b;
}

.tomato-card-content {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.song-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tiny-tomato {
  font-size: 1.2rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.song-info h3 {
  font-size: 1.25rem;
  color: #ff6b6b;
  margin: 0;
}

.album {
  color: #ff8787;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.song-details {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.song-type {
  background-color: #fff0f0;
  color: #ff6b6b;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  border: 1px solid #ffd8d8;
}

.duration {
  color: #ff8787;
  font-size: 0.9rem;
}

.remove-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.remove-button:hover {
  background-color: #fff0f0;
  transform: scale(1.1);
}

.removing-tomato {
  display: inline-block;
  animation: spin 1s infinite linear;
}

@media (max-width: 768px) {
  .tomato-favorites-container {
    padding: 1rem;
  }

  .favorites-header h1 {
    font-size: 2rem;
  }

  .favorites-grid {
    grid-template-columns: 1fr;
  }
}
</style>
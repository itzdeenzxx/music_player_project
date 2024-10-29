<template>
  <div>
    
    <MainMenu/>
    <!-- <h1>KUSHOP</h1> -->
    <!-- <router-link to="/">Home<router-link/> &nbsp;
      <router-link to="/login">login<router-link/> -->
        <div class="container">
          <router-view/>
        </div>
      </div>
  
</template>

<script>
import MainMenu from './components/MainMenu.vue';



export default {
  name: 'App',
  components:{
    MainMenu
  }
  
}
</script>

<style>

</style>

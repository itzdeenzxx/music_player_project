<template>
  <div id="app">
    <h1>Chat Application</h1>
    <TomatyComponent />
  </div>
</template>

<script>
import TomatyComponent from './components/TomatyComponent.vue';

export default {
  components: {
    TomatyComponent,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

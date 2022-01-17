<template>
  <div id="app">
    <Nav/>
    <router-view />
  </div>
</template>

<script>
import M from "materialize-css";
import Nav from './components/sections/Nav.vue';

export default {
  mounted() {
    M.AutoInit();
  },
  components:{
    Nav,
  }
};
</script>


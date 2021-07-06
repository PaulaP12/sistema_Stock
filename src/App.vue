<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->

    <nav>
      <div class="nav-wrapper">
        <a class="brand-logo" style="margin-left:30px;font-size:25px;"><router-link to="/"><font-awesome-icon :icon="['fas','boxes']"/> SISTEMA STOCK</router-link></a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          <li><router-link to="/"><font-awesome-icon :icon="['fas','home']"/> Home</router-link></li>
          <li><router-link to="/LastMovements"><font-awesome-icon :icon="['fas','history']"/> Ultimos movimientos</router-link></li>
          <li><router-link to="/Articles"><font-awesome-icon :icon="['fas','box']"/> Artículos</router-link></li>
          <li><router-link to="/Categories"><font-awesome-icon :icon="['fas','align-justify']"/> Rubros</router-link></li>
          <li><router-link to="/Receipts"><font-awesome-icon :icon="['fas','receipt']"/> Comprobantes</router-link></li>
        </ul>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script>
import M from "materialize-css";

export default {
  mounted() {
    M.AutoInit();
  },
};
</script>

<style>
	.nav-wrapper{background-color:#476F7E;}
</style>


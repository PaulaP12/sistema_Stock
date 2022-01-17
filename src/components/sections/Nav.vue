<template>
  <nav>
    <div class="nav-wrapper">
      <a class="brand-logo" style="margin-left:30px;font-size:25px;"><router-link to="/"><font-awesome-icon icon="shopping-cart" /> Sistema Stock</router-link></a>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><router-link to="/">Inicio</router-link></li>
        <li><router-link to="/LastMovements">Ultimos movimientos</router-link></li>
        <li><router-link to="/Articles">Artículos</router-link></li>
        <li><router-link to="/Categories">Rubros</router-link></li>
        <li><router-link to="/Receipts">Comprobantes</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script>
  import '../../assets/css/global.css';

  export default {
    
  }
</script>

<style>
	.nav-wrapper{background-color: var(--secondary-bg-color);}
</style>  
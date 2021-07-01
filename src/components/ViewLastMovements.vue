<template>
	<div class="container">
		<div class="rowTitle">
			<h4 id="title">ÚLTIMOS MOVIMIENTOS</h4>
			<a v-if="periodOfTime" @click="periodOfTime=!periodOfTime" class="waves-effect waves-light btn deep-orange">Filtrar por periodo de tiempo</a>

			<div v-if="!periodOfTime">
				<font-awesome-icon v-if="!periodOfTime" @click="filtersDate" style="margin-left:5px;" :icon="['fas', 'undo-alt']"/>

				<label class="active">Inicio</label>
				<input v-model="iniDate" type="date" class="input-date" min="2021-01-01">

				<label class="active">Fin</label>
				<input v-model="finDate" type="date" class="input-date" max="2099-09-13">
			</div>
			<font-awesome-icon v-if="!periodOfTime" @click="periodOfTime = true" style="margin-left:5px;" :icon="['fas', 'undo-alt']"/>
		</div>

		<table class="highlight centered" v-if="periodOfTime">
			<thead>
				<tr>
					<th>#</th>
					<th>Tipo de movimiento</th>
					<th>Fecha realizado</th>
					<th>Cantidad</th>
					<th>Importe</th>
				</tr>
			</thead>

			<tbody>
				<tr v-for="(movement, index) in lastMovements" :key="index">
					<td>{{index}}</td>
					<td><b>{{movement.type_movement}}</b></td>
					<td>{{movement.date_movement}}</td>
					<td>{{movement.quantity_movement}}</td>
					<td>${{movement.amount_movement}}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
    import ApiRest from "@/mixins/ApiRest.vue";

    export default {
        mixins: [ApiRest],
        data(){
            return{
                param:'lastmovements',
                lastMovements:[],
				MovFilt:[],
                periodOfTime:true,
                iniDate:'',
                finDate:'',
            }
        },
        created(){
			this.getInfo(this.param).then((res) => {
				this.lastMovements = res;
				//console.log()
			})
		},
    }
</script>

<style scoped>
	.rowTitle{display:flex;align-items:center;}
	#title{flex:1 1 auto}
	.input-date{width: 130px !important;}
	.active{margin:0 18px 0 18px;}

</style>
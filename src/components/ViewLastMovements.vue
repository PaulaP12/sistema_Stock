<template>
	<div class="container">
		<div class="rowTitle">
			<h4 id="title">ÚLTIMOS MOVIMIENTOS</h4>
			<a v-if="periodOfTime" @click="periodOfTime=!periodOfTime" class="waves-effect waves-light btn deep-orange">Filtrar por periodo de tiempo</a>

			<div v-if="!periodOfTime">
				<a @click="filterBetweenDates()" class="waves-effect waves-light btn-small red darken-1">OK</a>

				<label class="active">Inicio</label>
				<input v-model="startDate" type="date" class="input-date" min="2021-01-01">

				<label class="active">Fin</label>
				<input v-model="endDate" type="date" class="input-date" max="2099-09-13">
			</div>
			<font-awesome-icon v-if="!periodOfTime" @click="backFilter()" style="margin-left:20px;" :icon="['fas', 'undo-alt']"/>
		</div>

		<table class="highlight centered">
			<thead>
				<tr>
					<th>#</th>
					<th>Tipo de movimiento</th>
					<th>Fecha realizado</th>
					<th>Cantidad</th>
				</tr>
			</thead>

			<tbody>
				<tr v-for="(movement, index) in lastMovements" :key="index">
					<td>{{index}}</td>
					<td><b>{{movement.type_movement}}</b></td>
					<td>{{movement.date_movement}}</td>
					<td>{{movement.quantity_movement}}</td>
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
                param:['lastmovements','betweenDates'],
                lastMovements:[],
				MovFilt:[],
                periodOfTime:true,
                startDate: "",
				endDate: "",
            }
        },
        created(){
			this.getInfo(this.param[0]).then((res) => {
				this.lastMovements = res;
			})
		},
		methods:{
			filterBetweenDates(){
				this.dataBetweenDates(this.param[1],this.startDate,this.endDate).then((res) => {
					this.lastMovements = res;
				})
			},
			backFilter(){
				this.periodOfTime = true
				this.getInfo(this.param[0]).then((res) => {
					this.lastMovements = res;
				})
			}
		}
    }
</script>

<style scoped>
	.rowTitle{display:flex;align-items:center;}
	#title{flex:1 1 auto}
	.input-date{width: 130px !important;}
	.active{margin:0 18px 0 18px;}

</style>
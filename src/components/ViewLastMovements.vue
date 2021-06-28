<template>
    <div class="container">
		<table class="highlight centered">
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
        <ul  >
			<li></li>
        </ul>
    </div>
</template>

<script>
    import ApiRest from "@/mixins/ApiRest.vue";

    export default {
        mixins: [ApiRest],
        data(){
            return{
                param:'lastmovements',
                lastMovements:[]
            }
        },
        created(){
			this.getInfo(this.param).then((res) => {
				this.lastMovements = res;
				console.log(this.lastMovements)
			});
		}
    }
</script>

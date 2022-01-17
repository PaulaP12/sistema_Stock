<template>
	<div class="container">
		<div class="rowTitle">
			<h4 id="title">ÚLTIMOS MOVIMIENTOS</h4>
			<a v-if="periodOfTime" @click="periodOfTime=!periodOfTime" class="waves-effect waves-light btn filter">Filtrar por periodo de tiempo</a>
		</div>

		<div v-if="!periodOfTime">
			<a @click="filterBetweenDates()" class="waves-effect waves-light btn-small red darken-1">OK</a>

			<label class="active">Inicio</label>
			<input v-model="startDate" type="date" class="input-date" min="2021-01-01">

			<label class="active">Fin</label>
			<input v-model="endDate" type="date" class="input-date" max="2099-09-13">
		</div>
			<font-awesome-icon v-if="!periodOfTime" @click="backFilter()" style="margin-left:20px;" :icon="['fas', 'undo-alt']"/>

		<div class="details">
			<div class="container-spinner">
	      <div v-if="loading" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
	    </div>
			<table class="highlight centered" v-if="!loading">
				<thead>
					<tr>
						<th>Tipo de movimiento</th>
						<th>Fecha realizado</th>
						<th>Cantidad</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="(movement, index) in lastMovements" :key="index">
						<td><b :class="[ movement.type_movement == 'Compra' ? 'purchase' : 'sale']">{{movement.type_movement}}</b></td>
						<td>{{movement.date_movement}}</td>
						<td>{{movement.quantity_movement}}</td>
					</tr>
				</tbody>
			</table>

			<ul class="pagination">
				<li v-if="pagination.current_page > 1">
					<a class="btn-page first" @click.prevent="changePage(pagination.current_page - 1)">
						<span>Atras</span>
					</a>
				</li>

				<li v-for="page in pagesNumber" :class="[ page == isActived ? 'active' : '']" :key="page">
					<a class="btn-page" @click.prevent="changePage(page)">
						{{ page }}
					</a>
				</li>

				<li v-if="pagination.current_page < pagination.last_page">
					<a class="btn-page last" @click.prevent="changePage(pagination.current_page + 1)">
						<span>Siguiente</span>
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
    import ApiRest from "@/mixins/ApiRest.vue";
		import '../assets/css/global.css';
		import '../assets/css/spinner.css';

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
					pagination: {
						'total': 0,
						'current_page': 0,
						'per_page': 0,
						'last_page': 0,
						'from': 0,
						'to': 0
					},
					offset:3,
					loading:true,
        }
      },
			created(){
				this.viewLastmovements(1)
			},
			computed: {
				isActived: function() {
					return this.pagination.current_page;
				},
				pagesNumber: function() {
					if(!this.pagination.to){
						return [];
					}

					var from = this.pagination.current_page - this.offset; 
					if(from < 1){
						from = 1;
					}

					var to = from + (this.offset * 2); 
					if(to >= this.pagination.last_page){
						to = this.pagination.last_page;
					}

					var pagesArray = [];
					while(from <= to){
						pagesArray.push(from);
						from++;
					}
					return pagesArray;
				}
			},
			methods:{
				viewLastmovements(page){
					this.getInfo(this.param[0],page).then((res) => {
						this.lastMovements = res.movements.data;
						this.pagination = res.pagination
						this.loading = false;
					})
				},
				filterBetweenDates(){
					this.dataBetweenDates(this.param[1],this.startDate,this.endDate).then((res) => {
						this.lastMovements = res;
					})
				},
				backFilter(){
					this.periodOfTime = true;
					this.viewLastmovements(1);
				},
				changePage: function(page) {
					this.pagination.current_page = page;
					this.viewLastmovements(page);
				}
			}
    }
</script>

<style scoped>
	.container{
		margin-top: 2rem;
	}
	.rowTitle{display:flex;align-items:center;}
	#title{flex:1 1 auto}
	.input-date{width: 130px !important;}
	.active{margin:0 18px 0 18px;}

	#app > div > div > div > a{ background: var(--green-color); }
	#app > div > div > div > a:hover{ background: var(--green-secondary-color); }

	.btn-page{
		cursor: pointer;
	}

	.btn-page.first, .btn-page.last{
		background-color: #1e212d4d;
		border-radius: 2px;
	}

	.btn-page.first:hover, .btn-page.last:hover{ background-color: #1e212d; color: #ffff }

	.pagination li.active{
		background-color: #1e212d;
	}

	#app > div > div > div.details > table > thead > tr > th:nth-child(1),
	#app > div > div > div.details > table tbody tr td:nth-child(1){
		text-align: left;
	}

	.purchase,.sale{
		padding:5px 10px;
		border-radius: 5px;
		color:#FFF;
		font-weight: 400;
		text-transform: uppercase;
	}

	.purchase{ background-color: rgb(180, 84, 29); }
	.sale{ background-color: var(--green-color); }

</style>
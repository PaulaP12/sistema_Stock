<template>
	<div class="container">
		<div class="rowTitle">
			<h4 id="title">COMPROBANTES</h4>
			<a @click="modalView = 2" class="waves-effect waves-light btn blue lighten-1">Añadir</a>
		</div>

		<div v-if="messageWarning">
			<span>¿Seguro que quiere eliminar este comprobante?  </span>
			<a @click="deleteReceipt()" class="waves-effect waves-light btn-small red darken-1">SI</a>
			<a @click="messageWarning = false" class="waves-effect waves-light btn-small grey">No</a>
		</div>

		<div>
			<table>
				<thead>
				<tr>
					<th>ID</th>
					<th>TIPO DE MOVIMIENTO</th>
					<th>FECHA</th>
					<th></th>
				</tr>
				</thead>

				<tbody>
				<tr v-for="(header,index) in receipt_headproof" :key="index">
					<td>{{header.id}}</td>
					<td>{{header.type_movement}}</td>
					<td>{{header.date_movement}}</td>
					<td><font-awesome-icon @click="showModalDelete(index)" class="icon-trash" :icon="['fas', 'trash']"/></td>
					<td><font-awesome-icon @click="getDetailsReceipt(header.id)" class="icon-eye" :icon="['fas', 'eye']"/></td>
				</tr>
				</tbody>
			</table>

			<Pagination arrayForPage="5" param="headproofs" @paginado="formatPaged"/>
		</div>


		<!-- Añadir comprobante -->
		<div v-if="modalView == 2">
			<transition name="modal">
				<div class="modal-mask">
				<div class="modal-wrapper">
					<div class="modal-container center-align">

					<div class="modal-header">
						<slot name="header">
							<h5>Añadir comprobante</h5>
							<span class="span">Tipo de movimiento:</span>
							<label>
								<input type="checkbox" value="Compra" v-model="type_movementCheckbox"/>
								<span class="span">Compra</span>
							</label>

							<label>
								<input type="checkbox" value="Venta" v-model="type_movementCheckbox"/>
								<span class="span">Venta</span>
							</label>

							<div class="input-field col s6">
								<span class="span">Fecha Movimiento</span>
								<input class="center-align validate input-date" type="date" v-model="data.date_movement">
							</div>

							<div class="row row-product" v-for="(input,k) in OrderedData" :key="k">
								<div class="col s5">
									<input type="text" placeholder="Artículo" class="validate" v-model="OrderedData[k].nameArticle">
								</div>
								<div class="col s3">
									<input type="number" placeholder="Cantidad" class="validate" min="0" v-model="OrderedData[k].cant_article">
								</div>
								<div class="col s4">
									<a @click="add()" class="btn-add green"><font-awesome-icon :icon="['fas', 'plus']"/></a>
									<a @click="remove(k)" class="btn-add red lighten-2"><font-awesome-icon :icon="['fas', 'times']"/></a>
								</div>
							</div>
							
						</slot>
					</div>

					<div class="modal-footer">
						<slot name="footer">
						<a @click="addReceipt()" class="waves-effect waves-light btn blue lighten-1">AGREGAR</a>
						<a @click="modalView = 1">VOLVER</a>
						</slot>
					</div>
					</div>
				</div>
				</div>
			</transition>
		</div>

		<!-- Detalle de comprobante -->
		<div v-if="modalView == 3">
		<transition name="modal">
			<div class="modal-mask">
				<div class="modal-wrapper">
					<div class="modal-container center-align">

					<div class="modal-header"><slot name="header"><h4>Detalles</h4></slot></div>

					<div>
						<table>
							<thead>
								<tr>
									<th>ID Artículo</th>
									<th>Cantidad</th>
									<th>N° Cabecera</th>
								</tr>
							</thead>

							<tbody>
								<tr v-for="(detail, index) in receipt_details" :key="index">
									<td>{{detail.nameArticle}}</td>
									<td>{{detail.quantity_movement}}</td>
									<td>{{detail.headproof_id}}</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div class="modal-footer">
						<a class="waves-effect waves-light btn backLink" @click="modalView = 1">VOLVER</a>
					</div>
					</div>
				</div>
			</div>
		</transition>
		</div>


	</div>
</template>

<script>
	import ApiRest from "@/mixins/ApiRest.vue";
	import Pagination from "../components/Pagination.vue";

	export default {
		name: 'receipts',
		mixins:[ApiRest],
		components:{Pagination},
		data(){
			return {
				dataPaged:[],
				param:'headproofs',
				receipt_headproof:[],
				receipt_details:[],
				modalView:1,
				OrderedData:[{
					nameArticle:'',
					cant_article:0,
				}],
				data:{
					type_movement:'',
					date_movement:''
				},
				type_movementCheckbox: [],

				messageWarning:false,
				receipt_id: 0,
			}
		},
		created(){
			this.getInfo(this.param).then((res) => {
				this.receipt_headproof = res;
			})
		},
		methods:{
			// Paginación
			formatPaged(info){this.dataPaged = info},

			add(){
				if(this.OrderedData.length<4){
					this.OrderedData.push({nameArticle:'',cant_article:0})
				}
			},
			remove(index){
				if(this.OrderedData.length>1){
					this.OrderedData.splice(index,1)
				}
			},
			addReceipt(){
				this.data.type_movement = this.type_movementCheckbox[0]
				this.data.OrderedData = this.OrderedData
				this.addElement(this.param,this.data).then((res) => {
					let response = res;
					console.log(response)
					if (response == undefined) {
						this.getInfo(this.param).then((res) => {
							this.receipt_headproof = res;
						})
						this.modalView = 1
						alert('COMPROBANTE AGREGADO')		
					}else{
						alert(response.Estado + ' - ' + response.Mensaje)
					}
				})
			},
			getDetailsReceipt(index){
				console.log(index)
				this.modalView = 3
				this.getElementById(this.param,index).then((res) => {
					this.receipt_details = res;
					console.log(this.receipt_details)
				})				
			},
			showModalDelete(index){ 
				this.receipt_id = index  + 1
				this.messageWarning = true
			},
			deleteReceipt(){
				this.deleteElement(this.param,this.receipt_id).then((res) => {
					let response = res;
					console.log(response)
					if (response == undefined) {
						this.getInfo(this.param).then((res) => {
							this.receipt_headproof = res;
						})
						this.modalView = 1
						alert('COMPROBANTE ELIMINADO')
						this.messageWarning = false
					}
				})
			}
		}
	}
</script>

<style scoped>	
	.rowTitle{display:flex;align-items:center;}
	#title{flex:1 1 auto}
	.btn{margin: 0 10px}
	.btn-small{border-radius: 10%; margin: 0 10px;}
	.icon-eye{color:gray}
	.icon-trash{color:red}
	.span{margin: 0 10px 10px 10px}
	.input-date{width:50px}
	.validate{width: 200px;}
	.row-product{display: flex;align-items:center;}
	.backLink{margin-top: 227px;}
	.btn-add{padding:10px;color:white;margin:0 10px;border-radius: 10%;}
	.btn-add:hover{background-color: #00000021;}

	/* ESTILOS MODAL */
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
  }

  .modal-wrapper { display: table-cell; vertical-align: middle;}

  .modal-container {
    width: 500px;
    height: 558px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {margin: 10px;color: #42b983;}

  .modal-enter {opacity: 0}

  .modal-leave-active {opacity: 0;}

  .modal-enter .modal-container,.modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
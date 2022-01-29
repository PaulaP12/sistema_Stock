<template>
	<div class="container">
		<div class="row_title">
			<h4 id="title">COMPROBANTES</h4>
			<a v-if="!modal_add" class="waves-effect waves-light btn deep-orange">Filtrar por fecha</a>
			<a v-if="!model_add" class="waves-effect waves-light btn green darken-1" @click="addReceipts()">AÑADIR COMPROBANTES</a>
		</div>
		<div v-if="!model_add">
			<div class="accordions" >
				<div v-for="(header,index) in receipt_headproof" :key="index">
					<div class="text-box" @click="header.open = !header.open;viewDetails(header.id)">
						<p class="type_movement">
							<b>{{header.type_movement}}</b>
						</p>
						<div class="other-text">
							<span>Realizada el: <b>{{header.date_movement}}</b></span>
							<font-awesome-icon icon="angle-down" />
						</div>
					</div>
					<div v-if="header.open" class="child-text">
						<div style="padding: 10px 10px;">
							<transition name="fade">
								<table>
									<thead>
										<th>ID</th>
										<th>Articulo</th>
										<th>Cantidad</th>
									</thead>
									<tbody>
										<tr v-for="(line,index) in receipt_details" :key="index">
											<td>{{line.id}}</td>
											<td>{{line.nameArticle}}</td>
											<td>{{line.quantity_movement}}</td>
										</tr>
									</tbody>
								</table>
							</transition>
						</div>
						<div class="delete-btn" @click="deleteReceipt(header.id)">
							<p>¿Quieres borrar este comprobante?</p>
						</div>
					</div>
				</div>
			</div>

			<Pagination v-if="pagination && pagination.current_page" :pagination="pagination" @page="page"/>
		</div>

		<div class="box" id="addReceipts" v-if="model_add">
			<div class="row" style="margin-bottom:0;">
				<div class="input-field col s6" style="text-align:left;">
					<span class="span">Tipo de movimiento</span><br>
					<p><label>
							<input type="checkbox" v-model="tm_venta"><span for="cbox">Venta</span>
						</label>
					</p>
					<br>
					<p style="margin-top: -30px;"><label>
						<input type="checkbox" v-model="tm_compra"/> <span>Compra</span>
						</label>
					</p>
				</div>
				<div class="input-field col s6">
					<span class="span">Fecha Movimiento</span>
					<input class="center-align validate input-date" type="date" v-model="data.date_movement">
				</div>
			</div>
			<div class="box-article">
				<span>Añadir artículo:</span>
				<div style="display: flex;flex-direction: row;align-items:center;">
					<input type="text" maxlength="15" placeholder="Agregar artículo" v-model="nameArticle">
					<input type="number" max="500000" class="price_article" placeholder="Precio" v-model="cant_article">
					<button @click="add()" class="btn green" style="box-shadow:none;"><span style="font-size:21px;">+</span></button>
				</div>
				<div>
					<h5>Lista de artículos</h5>
					<div class="box-list">
						<div style="margin: 0 10px;padding: 10px;" v-for="(input,k) in OrderedData" :key="k">
							<a href="#"><span class="highlight blue">{{OrderedData[k].nameArticle}} (
							{{OrderedData[k].cant_article}}) <span class="btn-delete" @click="remove(k)"><font-awesome-icon icon="trash"/></span></span></a>
						</div>
					</div>
				</div>
				<div class="center-align">
          <a class="waves-effect waves-light btn btn-edit" @click="save=true;addReceipts()">AÑADIR</a>
        </div>
			</div>
		</div>
	</div>
</template>

<script>
	import ApiRest from "@/mixins/ApiRest.vue";
	import Pagination from './sections/Pagination.vue';

	export default {
		name: 'receipts',
		mixins:[ApiRest],
		components:{
			Pagination,
		},
		data(){
			return {
				receipt_id: 0,
				// startDate: "",
				// endDate: "",

				param:'headproofs',
				receipt_headproof:[],
				receipt_details:[],
				open: false,

				// Paginado
	      pagination: {
	        'total': 0,
	        'current_page': 0,
	        'per_page': 0,
	        'last_page': 0,
	        'from': 0,
	        'to': 0
	      },

				//Crear comprobante
				OrderedData:[{}],
				data:{
					type_movement:'',
					date_movement:''
				},
				nameArticle:'',
				cant_article: 0,
				tm_venta:"",
				tm_compra:"",
				model_add:false,
				save:false,
			}
		},
		created(){
			this.viewReceipts(1);
			this.OrderedData.splice(0,1)
		},
		methods:{
			viewReceipts(page){
				this.getInfo(this.param,page).then((res) => {
					this.receipt_headproof = res.headproof.data;
					this.pagination = res.pagination;
				})
			},
			viewDetails(headproof){
				this.getElementByAtributte(this.param,headproof).then((res) => {
					console.log(res);
					this.receipt_details = res;
				})
			},
			addReceipts(){
				this.model_add = true;
				if (this.save) {
					if (this.tm_venta) {
						this.data.type_movement = "Venta"
					}else{
						this.data.type_movement = "Compra"
					}
					this.data.OrderedData = this.OrderedData;
					console.log(this.data);
					this.addElement(this.param,this.data).then((res) => {
						let response = res;
						console.log("respuesta:",res);
						if (response == undefined) {
							Swal.fire({
		              icon: 'success',
		              html: "Se ha agregado el componente con éxito",
									timer: 2000,
		          })
							setTimeout(this.viewReceipts(1), 3000);
							this.model_add = false;
						}else{
							Swal.fire({
		              icon: 'error',
		              html: response.Message,
									timer: 5000,
		          })
						}
					})
				}
			},
			deleteReceipt(id){
				Swal.fire({
				  title: '¿Estás seguro?',
				  text: "No podrás revertir esta acción.",
				  icon: 'warning',
				  showCancelButton: true,
				  confirmButtonColor: '#3085d6',
				  cancelButtonColor: '#d33',
				  confirmButtonText: 'Si, quiero borrarlo.'
				}).then((result) => {
					this.deleteElement(this.param,id).then((res) => {
						let response = res;
						if (response == undefined) {
							if (result.isConfirmed) {
						    Swal.fire({
									icon: "success",
									title: 'Borrado!',
						      text: 'El comprobante ha sido borrado.',
									timer: 2000,
								})
						  }
							setTimeout(this.viewReceipts(1), 3000);
						}
					})

				})
			},

			page: function(page) {
	      var pageView = page;
	      this.viewReceipts(pageView);
	    },
			add(){
				if(this.OrderedData.length<10){
					this.OrderedData.push({nameArticle:this.nameArticle,cant_article:this.cant_article})
					this.nameArticle = '';
					this.cant_article = 0;
				}
			},
			remove(index){
				if(this.OrderedData.length>1){
					this.OrderedData.splice(index,1)
				}
			},

		}
	}
</script>

<style scoped>
	.row_title{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			margin-top: 10px;
	}

	.box{
		background:#fff;
		padding: 39px;
	}

	.text-box {
		display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
		padding: 0 20px;
		background: #FFF;
		margin: 10px 0 0 ;
	}

	.text-box:hover {
		cursor: pointer;
	}

	.text-box p {
		text-transform: uppercase;
	}

	.child-text {
		background: #d4d2d2;
		display: flex;
		flex-direction: column;
	}

	.type_movement {
		flex: 1px 1 1;
		letter-spacing: 2px;
		font-weight: 200;
	}

	.other-text{
		display: flex;
		justify-content: row;
		justify-content: space-between;
		width: 30%;
		padding-right: 30px;
		align-items: center;
	}

	tr { border-bottom: none}

	.box-article{
		padding: 15px 30px;
		color: #000;
	}

	.box-list {
		display: flex;
		flex-direction: row;
		flex-wrap:wrap;
	}

	.highlight {
	  background: #f5f5f5;
	  border-radius: 3vw;
    padding: 0 1.5vw 0.50vw;
	  margin-bottom: 0.25vw;
	  display: inline-block;
		padding-top:5px;

	  &.blue {
	    background: #4359f6;
	    color: white;
	  }
	}

	a {
	  color: black;

	  .highlight {
	    transition: 0.35s ease all;

    &::after {
      content: "\e5c8";
      margin-left: 0.5vw;
      transform-origin: center;
      transform: translateY(5px) rotate(-45deg) scale(0.8);
      display: inline-block;
      font-weight: 700;
      transition: 0.35s ease all;
      font-family: 'Material Icons';
    }
  }

  &:hover, &:focus {
    outline: none;

    .highlight {
      &.blue {
        background: darken(#4359f6, 10%);
      }

      &::after {
        transform: translate(35%, -11%) rotate(-45deg) scale(0.8);
      }
    }
  }
}

	.btn-delete{
		color: white;
		padding-left: 10px;
	}

	.btn-delete:hover{
		color:red;
	}

	.delete-btn{
		background: #eb4034;
		color: #FFF;
		display: flex;
		justify-content: center;
	}

	.delete-btn:hover { background: #8a251e}

</style>

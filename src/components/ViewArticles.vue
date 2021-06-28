<template>
  <div class="container">
	<div class="rowTitle">
		<h3 :class="title"><span v-if="ModalAction==4">EDITAR </span> ARTÍCULOS</h3>
		<a class="waves-effect waves-light btn btnAdd" v-if="ModalAction==1" @click="actionAdd()">Añadir Artículo</a>
	</div>
 
    <ADDArticle v-if='ModalAction==2'/>

    <!--Mensaje Borrar rubro-->
    <div v-show="viewMessageDelete == true">
      <span class="messageError"><font-awesome-icon class="icon" :icon="['fas','trash']"></font-awesome-icon> {{messaggeAdd.Estado}} - {{messaggeAdd.Mensaje}}</span>
    </div>

    <div class="table-article" v-if='ModalAction == 1 | ModalAction == 5'>
      <table class="striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Artículo</th>
            <th>Precio</th>
            <th>Stock Minimo</th>
            <th>Stock Máximo</th>
            <th>Fecha Vencimiento</th>
            <th>Rubro</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(article, index) in dataPaged" :key="index">
            <td>{{ article.id }}</td>
            <td><b>{{ article.nameArticle }}</b></td>
            <td>$ {{ article.priceArticle }}</td>
            <td>{{ article.stockMinArticle }}</td>
            <td>{{ article.stockMaxArticle }}</td>
            <td>{{ article.dateExpirationArt }}</td>
            <td>{{ article.category_id }}</td>
            <td><font-awesome-icon @click="showModalDelete(article.id)" class='icon' style="color:red;" :icon="['fas', 'trash']" /></td>
            <td><font-awesome-icon @click="articleSelected(article.id,4)" class='icon' style="color:blue;" :icon="['fas', 'edit']" /></td>
            <td><font-awesome-icon @click="articleSelected(article.id,3)" class='icon' style="color:gray;" :icon="['fas', 'eye']" /></td>
          </tr>
        </tbody>
      </table>
      
	<ul class="pagination">
		<li v-on:click="previousPage()"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
		<li v-for="(page,index) of totalPages()" :key="index" v-on:click="getDataPage(page)" :class="isActive(page)"><a href="#!">{{page}}</a></li>
		<li class="waves-effect" v-on:click="nextPage()"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
	</ul>
    </div>

    <!-- Mostrar info de un artículo -->
    <div class="center-align" v-show="ModalAction==3">
      <div class="row">
        <div class="col s12 m5">
          <div class="card-panel teal">
            <h5 class="white-text"><b>Información del artículo</b></h5>
            <li class="white-text">ID: {{ articleSelect.id }}</li>
            <li class="white-text">ARTÍCULO: {{ articleSelect.nameArticle }}</li>
            <li class="white-text">PRECIO: $ {{ articleSelect.priceArticle }}</li>
            <li class="white-text">STOCK MIN: {{ articleSelect.stockMinArticle }}</li>
            <li class="white-text">STOCK MAX: {{ articleSelect.stockMaxArticle }}</li>
            <li class="white-text">FECHA VENCIMIENTO: {{ articleSelect.dateExpirationArt }}</li>
            <li class="white-text">RUBRO: {{ articleSelect.category_id }}</li>
            <div class="right-align ">
              <a @click="returnShowModal()" class="btn-floating waves-effect waves-light red"><font-awesome-icon class='icon i-back' :icon="['fas', 'undo']"/></a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal eliminar -->
    <div v-if="ModalAction == 5">
      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container center-align">

              <div class="modal-header">
                <slot name="header">
                  ¿Desea borrar el rubro?
                </slot>
              </div>

              <div class="modal-footer">
                <slot name="footer">
                  <a class="waves-effect waves-light btn red yesbtn" @click="deleteArticle()">SI</a>
                  <a class="waves-effect waves-light btn grey darken-1" @click="ModalAction= ModalAction-4">NO</a>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Modal editar -->
    <div v-if="ModalAction == 4">
      <div class="row form">
        <form class="col s12">
          <div class="row">
            <div class="col s6">
              <label>Nombre Artículo</label>
              <input v-model="dataEdit.nameArticle" type="text" class="validate" :placeholder="[articleSelect.nameArticle]">
            </div>
            
            <div class="col s6">
              <label>Precio</label>
              <input v-model="dataEdit.priceArticle" type="number" class="validate" :placeholder="[articleSelect.priceArticle]">
            </div>
            
            <div class="col s6">
              <label>Stock Minimo</label>
              <input v-model="dataEdit.stockMinArticle" type="number" class="validate" :placeholder="[articleSelect.stockMinArticle]">
            </div>
          
            <div class="col s6">
              <label>Stock Máximo</label>
              <input v-model="dataEdit.stockMaxArticle" type="number" class="validate" :placeholder="[articleSelect.stockMaxArticle]">
            </div>

            <div class="col s6">
              <label>Fecha de Vencimiento</label><br>
              <input v-model="date" type="date" class="validate" :placeholder="[articleSelect.dateExpirationArt]">
            </div>

            <div class="col s6">
              <v-select v-model="dataEdit.category_id" :value="dataEdit.category_id" :options="categories" label="nameCategory"></v-select>
            </div>
          </div> 
            <a class="waves-effect waves-light btn lime darken-1" @click="editArticle()">Editar Artículo</a><br>
            <br><a @click="ModalAction= ModalAction-3">No quiero editar el artículo</a>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
import ApiRest from "@/mixins/ApiRest.vue";
import ADDArticle from "../components/ADDArticle.vue";

export default {
  mixins: [ApiRest],
  components:{
    ADDArticle,
  },
  data() {
    return {
      articles: [],
      categories: [],
      ModalAction:1,
      OpenModal: false,
      OpenModalShow: false,
      showModal:false,
      messaggeAdd:[],
      viewMessageDelete:false,
      viewMessage:false,
      viewMessageError:false,

      param:'articles',
      idArticle:0,
      option:0,
      articleSelect: [],

      // Contenido Artículo
      dataEdit:{
        nameArticle: "",
        priceArticle: null,
        stockMinArticle: null,
        stockMaxArticle: null,
        dateExpirationArt: new Date(),
        category_id: null,
      },
        date:'',
        dataPage:[],
        
       // Paginación
		articlesForPage: 5,
		dataPaged:[],
		pageCurrent:1
              
    };
  },
  created() {
    this.getInfo(this.param).then((res) => {
      this.articles = res;
      this.getDataPage(1)
    });
  },
  methods:{
    // Methods CRUD (Salvo Añadir articulo)
    articleSelected(idArticle,option){

      if(option==3){ // Selecciono el icono de mostrar info de artículo
        this.ModalAction = 3

        this.idArticle = idArticle
        this.getElementById(this.param,this.idArticle).then((res)=>{
          this.articleSelect = res;
        })
      }else if (option == 4) {// Selecciono el icono de editar artículo
        this.ModalAction = 4
        
        this.idArticle = idArticle
        this.getElementById(this.param,this.idArticle).then((res)=>{
			this.articleSelect = res;
        });
        this.getInfo("categories").then((res) => {
          this.categories = res;
        })
      }
    },    
    returnShowModal(){
      this.ModalAction=1
    },
    // Añadir artículo
    actionAdd(){
      this.ModalAction = 2
    },
    showModalDelete(id){ 
      this.idArticle = id 
      this.ModalAction = 5
    },
    deleteArticle(){
      this.deleteElement(this.param,this.idArticle).then((res) => {
        this.showModal = false

        if(res.Estado == 'Satisfactorio'){
          this.messaggeAdd = res
          this.viewMessageDelete = true
          setTimeout(() => this.viewMessageDelete = false, 5000);
          this.viewMessage = false
        }
      });

      this.getInfo(this.param).then((res) => {
        this.articles = res;
        this.ModalAction = 1;
      });
    },
    editArticle(){
		this.dataEdit.category_id = this.categories.indexOf(this.dataEdit.category_id)
		this.dataEdit.category_id = this.dataEdit.category_id + 1

		this.dataEdit.dateExpirationArt = this.date
		this.dataEdit.dateExpirationArt = this.dataEdit.dateExpirationArt.toString("yyyy-mm-dd");
		
		this.editElement(this.param,this.idArticle,this.dataEdit).then((res)=>{
			this.articles = res;
		})
		
		this.getInfo(this.param).then((res) => {
			this.articles = res;
			this.ModalAction = 1;
		});
	},
	
	// Paginación
	
	totalPages(){
		return Math.ceil(this.articles.length / this.articlesForPage)
	},
	getDataPage(numberPage){
		this.dataPaged = []
		let inicio = (numberPage * this.articlesForPage) - this.articlesForPage
		let fin = (numberPage * this.articlesForPage)
		this.dataPaged = this.articles.slice(inicio,fin)
	},
	previousPage(){
		if(this.pageCurrent > 1){
			this.pageCurrent--
		}
		this.getDataPage(this.pageCurrent)
	},
	nextPage(){
		if(this.pageCurrent < this.totalPages()){
			this.pageCurrent++
		}
		this.getDataPage(this.pageCurrent)
	},
	isActive(numberPage){
		if(numberPage == this.pageCurrent){
			return 'active'
		}else{
			return ''
		}
		
	}
  }
}
</script>

<style scoped>
  .messageError{
    padding:10px;
    color:#ffffff;
    background-color: #b83e35;
    font-size: 14px;
  }
  h3{text-align: center;flex:1;}
  .btn {background-color: #476f7e;}
  .btn:hover {background-color: #2a4752;}

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
    width: 300px;
    height: 120px;
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

  .container{text-align: center;margin-top:10px;}
  .icon{cursor:pointer;margin-right:10px;}
  .i-back{margin-right: 12px;}
  .white-text{text-decoration: none;text-align: left;}
  .card-panel{padding-left: 50px;}
  .teal{background-color: #222d31 !important;}
  .row .col.m5{margin-left: 280px;}
  .yesbtn{margin: 10px 10px 0 0;}
  .btn{margin: 10px 10px 0 0;}
  .rowTitle{display:flex;align-items:center;}
  .active{background-color: #476f7e !important}
</style>

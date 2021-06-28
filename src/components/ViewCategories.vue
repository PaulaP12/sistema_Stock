<template>
  <div>
    <h3 class="title">RUBROS</h3>
    <a class="add" v-if="AccionInicial" @click="AccionInicial=!AccionInicial">Añadir nuevo rubro</a>
    <div class="row">
      <div :class="{'table-article col m8 l10': AccionInicial, 'table-article col m8 l4': !AccionInicial }">
        <table class="striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Rubro</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(category, index) in dataPaged" :key="index">
              <td>{{ category.id }}</td>
              <td class="nameCategory">{{ category.nameCategory }}</td>
              <td>
                <font-awesome-icon @click="showModalDelete(category.id)" class="icon" style="color: red" :icon="['fas', 'trash']"/>
              </td>
              <td>
                <font-awesome-icon @click="editCategoryBtn(index)" class="icon" style="color: blue" :icon="['fas', 'edit']"/>
              </td>
            </tr>
          </tbody>
        </table>
        
        <ul class="pagination">
			<li v-on:click="previousPage()"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
			<li v-for="(page,index) of totalPages()" :key="index" v-on:click="getDataPage(page)" :class="isActive(page)"><a href="#!">{{page}}</a></li>
			<li class="waves-effect" v-on:click="nextPage()"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
		</ul>
      </div>

      <div class="col l6 form" v-if="!AccionInicial">
        <h6>Agregar Rubro</h6>
        <div class="">
          <div class="input-field col">
            <input v-if="!editClick" v-model="dataNewAdd.nameCategory" type="text" placeholder="NUEVO RUBRO"/>

            <input v-if="editClick" v-model="dataEdit.nameCategory" type="text" placeholder="RUBRO A EDITAR"/>
            
            <a @click="addCategory()" v-if="!editClick" class="waves-effect waves-light btn">Añadir Rubro</a>
            <a v-if="editClick" class="waves-effect waves-light btn indigo darken-1" @click="editCategory()">Editar Rubro</a>
            <a v-if="editClick" @click="editClick=!editClick">No quiero editar</a>
          </div>
        </div>
        
        <!-- Mensajes agregar nuevo rubro -->
        <div v-show="viewMessage == true">
          <span class="message">{{messaggeAdd.Estado}} - {{messaggeAdd.Mensaje}} <font-awesome-icon class="icon" :icon="['fas','check-circle']"></font-awesome-icon></span>
        </div>
        <div v-show="viewMessageError == true">
          <span class="messageError"><font-awesome-icon class="icon" :icon="['fas','exclamation-circle']"></font-awesome-icon> {{messaggeAdd.Estado}} - {{messaggeAdd.Mensaje}}</span>
        </div>
        <!--Mensaje Borrar rubro-->
        <div v-show="viewMessageDelete == true">
          <span class="messageError"><font-awesome-icon class="icon" :icon="['fas','trash']"></font-awesome-icon> {{messaggeAdd.Estado}} - {{messaggeAdd.Mensaje}}</span>
        </div>
        <!--Mensaje Editar rubro-->
        <div v-show="viewMessageEdit == true">
			<span class="message"><font-awesome-icon class="icon" :icon="['fas','edit']"></font-awesome-icon> Rubro editado</span>
		</div>
      </div>

    </div>

    <div v-if="showModal">
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
                  <a class="waves-effect waves-light btn red" @click="deleteCategory()">SI</a>
                  <a class="waves-effect waves-light btn grey darken-1" @click="showModal=false">NO</a>
                </slot>
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

export default {
  mixins: [ApiRest],
  data() {
    return {
      categories: [],
      param: "categories",

      dataNewAdd:{
        nameCategory:"",
      },
      messaggeAdd:'',
      viewMessage:false,
      viewMessageError:false,
      viewMessageDelete:false,
      viewMessageEdit:false,
      showModal: false,
      AccionInicial: true,
      
      // Edit variable
      editClick:false,
      idCategory:0,
      idBD: 0,
      dataEdit:{
		nameCategory:'',
      },
      IdEdit:'',
      
      // Paginación
		categoriesForPage: 5,
		dataPaged:[],
		pageCurrent:1

    };
  },
  created() {
    this.getInfo(this.param).then((res) => {
      this.categories = res;
      this.getDataPage(1)
    });
  },
  methods:{
    addCategory(){
      this.addElement(this.param, this.dataNewAdd).then((res)=>{

        if(res.Estado == 'Satisfactorio'){
          this.messaggeAdd = res
          this.viewMessage = true
          this.viewMessageError = false
          setTimeout(() => this.viewMessage = false, 3000);
        }else{
          this.messaggeAdd = res
          this.viewMessageError = true
          this.viewMessage = false
          setTimeout(() => this.viewMessageError = false, 3000);
        }

        // Actualizar lista
        this.getInfo(this.param).then((refresh) => {
          this.categories = refresh;
        });
        
      })
    },
    showModalDelete(id){ 
      this.idCategory = id 
      this.showModal = true
    },

    deleteCategory(){
      this.deleteElement(this.param,this.idCategory).then((res) => {
        this.categories = res;
        this.showModal = false

        if(res.Estado == 'Satisfactorio'){
          this.messaggeAdd = res
          this.viewMessageDelete = true
          setTimeout(() => this.viewMessageDelete = false, 3000);
          this.viewMessage = false
        }
      });

      this.getInfo(this.param).then((res) => {
        this.categories = res;
      });
    },
    
    editCategoryBtn(idLista){ 
      // Id que se encuenta en la base de datos
      this.idCategory = idLista
      this.idBD = this.categories[this.idCategory].id
      
      this.editClick = true 
      
      if(this.AccionInicial){
        this.AccionInicial=!this.AccionInicial
      }
    },
    editCategory(){
      this.editElement(this.param,this.idBD,this.dataEdit).then((res)=>{
        this.categories = res;
        this.dataEdit.nameCategory = ''
      })
      
      this.getInfo(this.param).then((res) => {
        this.categories = res;
      });

      this.viewMessageEdit = true
      setTimeout(() => {
        this.viewMessageEdit = false
        this.editClick=!this.editClick
      }, 3000);
    },
    
    // Paginación
	
	totalPages(){
		return Math.ceil(this.categories.length / this.categoriesForPage)
	},
	getDataPage(numberPage){
		this.dataPaged = []
		let inicio = (numberPage * this.categoriesForPage) - this.categoriesForPage
		let fin = (numberPage * this.categoriesForPage)
		this.dataPaged = this.categories.slice(inicio,fin)
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
};
</script>

<style scoped>
.form{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title{text-align: center;}
.add{margin-left: 615px;}

.row{
  margin-left: 200px;
}
.icon {
  cursor: pointer;
}
.btn {
  margin: 15px 10px;
  background-color: #6bc05c;
}
.btn:hover {
  background-color: #4a8640;
}
.message{
  padding:10px;
  color:#ffffff;
  background-color: #93dd86;
}
.messageError{
  padding:10px;
  color:#ffffff;
  background-color: #b83e35;
  margin-left:30px;
}
.nameCategory{
  padding-right:30px;
}

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

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

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

.modal-header h3 {
  margin: 10px;
  color: #42b983;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.active{background-color: #476f7e !important}
.pagination{text-align:center}
</style>

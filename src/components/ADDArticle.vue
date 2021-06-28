<template>
    <div>
      <div class="container">
          
      <div class="row form">
        <form class="col s12">
          <div class="row">
            <div class="col s6">
              <label>Nombre Artículo</label>
              <input v-model="dataNewAdd.nameArticle" type="text" class="validate">
            </div>
            
            <div class="col s6">
              <label>Precio</label>
              <input v-model="dataNewAdd.priceArticle" type="number" class="validate">
            </div>
            
            <div class="col s6">
              <label>Stock Minimo</label>
              <input v-model="dataNewAdd.stockMinArticle" type="number" class="validate">
            </div>
          
            <div class="col s6">
              <label>Stock Máximo</label>
              <input v-model="dataNewAdd.stockMaxArticle" type="number" class="validate">
            </div>

            <div class="col s6">
              <label>Fecha de Vencimiento</label><br>
              <input v-model="date" type="date" class="validate">
            </div>

            <div class="col s6">
              <label>Rubro</label>
              <v-select v-model="dataNewAdd.category_id" :value="dataNewAdd.category_id" :options="categories"></v-select>
            </div>
          </div> 
            <a v-if="!editClick" @click="addArticle()" class="waves-effect waves-light btn green">Añadir Artículo</a><br>
            <br><a class="backArticle" @click="$router.go('articles')">No quiero añadir un nuevo artículo</a>
        </form>
      </div>

      <div v-if="ErrorMessage">
        <span class="messageError"><font-awesome-icon class="icon" :icon="['fas','exclamation-circle']"></font-awesome-icon> El articulo no se pudo agregar correctamente</span>
      </div>
      <div v-if="SatisfactorilyMessage">
        <span class="message"><font-awesome-icon class="icon" :icon="['fas','check-circle']"></font-awesome-icon>  Artículo agregado con exito </span>
      </div>

      </div>
    </div>
</template>

<script>
import ApiRest from "@/mixins/ApiRest.vue";
import M from "materialize-css";

export default {
  mixins:[ApiRest],
  mounted() {
    M.AutoInit();
  },
  data(){
    return{
        categories:[],
        param:'categories',
        messageSend:[],
        ErrorMessage:false,
        SatisfactorilyMessage:false,
        editClick:false,

        dataNewAdd:{
          nameArticle: "",
          priceArticle: 0,
          stockMinArticle: 0,
          stockMaxArticle: 0,
          dateExpirationArt: new Date(),
          category_id: 0,
        },
        date:'',
    }
  },
  created(){
    this.getInfo(this.param).then((res) => {
        this.categories = res;
        this.categories = this.categories.map((a)=>a.nameCategory)
      })
  },
  methods:{
    addArticle(){
      this.dataNewAdd.category_id = this.categories.indexOf(this.dataNewAdd.category_id)
      this.dataNewAdd.category_id = this.dataNewAdd.category_id + 1

      this.dataNewAdd.dateExpirationArt = this.date
      this.dataNewAdd.dateExpirationArt = this.dataNewAdd.dateExpirationArt.toString("yyyy-mm-dd");
      
      this.dataNewAdd.priceArticle = parseInt(this.dataNewAdd.priceArticle)
      this.dataNewAdd.stockMinArticle = parseInt(this.dataNewAdd.stockMinArticle)
      this.dataNewAdd.stockMaxArticle = parseInt(this.dataNewAdd.stockMaxArticle)

      this.addElement('articles', this.dataNewAdd).then((res)=>{
        if (res != null) {
          this.SatisfactorilyMessage = true
          setTimeout(() => {
            this.SatisfactorilyMessage = false
            this.$router.go('articles')
          }, 3000);    
        }else{
          this.ErrorMessage = true
          setTimeout(() => this.ErrorMessage = false, 3000);
        }
      })
    },
  }
}
</script>

<style scoped>
    .form{margin: 10px;}
    input[type="date"]{width:300px}
    .input-field input[type="search"] {height: 10px}
    .messageError{
      padding:10px;
      color:#ffffff;
      background-color: #b83e35;
      font-size: 14px;
    }
    .message{
      padding:10px;
      color:#ffffff;
      background-color: #93dd86;
    }
    .btn, .btn-large, .btn-small{margin-top: 10px;}
</style>

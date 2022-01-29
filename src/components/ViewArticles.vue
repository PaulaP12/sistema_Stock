<template>
  <div class="container">
    <div class="details">
      <div class="cardHeader">
          <h4>Articulos</h4>
          <a class="waves-effect waves-light btn" @click="ADDArticle()">AÑADIR ARTÍCULO</a>
      </div>
      <div class="table" v-if="modal === 1">
        <table>
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
            <tr v-for="(article, index) in articles" :key="index">
              <td>{{ article.id }}</td>
              <td><b>{{ article.nameArticle }}</b></td>
              <td>${{ formatPrice(article.priceArticle) }}</td>
              <td>{{ article.stockMinArticle }}</td>
              <td>{{ article.stockMaxArticle }}</td>
              <td>{{ article.dateExpirationArt }}</td>
              <td>{{ article.category_id }}</td>
              <td><font-awesome-icon @click="deleteArticle(article.id)" class='icon' icon="trash" style="color:red"/></td>
              <td><font-awesome-icon @click="editArticle(article)" class='icon' icon="edit" style="color:blue;"/></td>
              <td><font-awesome-icon @click="detailsArticle(article.id)" class='icon' icon="eye" style="color:gray;" /></td>
            </tr>
          </tbody>
        </table>

        <Pagination v-if="pagination && pagination.current_page" :pagination="pagination" @page="page"/>
      </div>

      <div class="row details" v-if="modal === 2">
        <div class="row">
          <div class="input-field col s6">
            <span class="span">Nombre:</span>
            <input :placeholder='filtered.nameArticle' type='text' v-model="dataCrud.nameArticle"/>
          </div>
          <div class="input-field col s6">
            <span class="span">Precio:</span>
            <input type="number" :placeholder='filtered.priceArticle' v-model="dataCrud.priceArticle"/>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s6">
            <span class="span">Fecha Vencimiento:</span>
            <input :placeholder='filtered.dateExpirationArt' type='date' v-model="dataCrud.dateExpirationArt"/>
          </div>
          <div class="input-field col s6">
            <span class="span">Stock Máximo:</span>
            <input :placeholder="filtered.stockMaxArticle" type='number' v-model="dataCrud.stockMaxArticle"/>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s6">
            <span class="span">Stock Mínimo:</span>
            <input :placeholder='filtered.stockMinArticle' type='number' v-model="dataCrud.stockMinArticle"/>
          </div>
          <div class="input-field col s6 center-align">
            <span class="span">Categoria:</span>
            <Select2 :options="categories" v-model="selectedValue" @change="myChangeEvent($event)" @select="mySelectEvent($event)"/>
          </div>
        </div>
        <div class="center-align">
          <a class="waves-effect waves-light btn btn-edit" @click="save=true;editArticle()">EDITAR</a>
        </div>
      </div>

      <div class="row details" v-if="modal === 3">
        <div class="row">
          <div class="input-field col s6">
            <span class="span">Nombre:</span>
            <input type='text' v-model="dataCrud.nameArticle"/>
          </div>
          <div class="input-field col s6">
            <span class="span">Precio:</span>
            <input type="number" v-model="dataCrud.priceArticle"/>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s6">
            <span class="span">Fecha Vencimiento:</span>
            <input type='date' v-model="dataCrud.dateExpirationArt"/>
          </div>
          <div class="input-field col s6">
            <span class="span">Stock Máximo:</span>
            <input type='number' v-model="dataCrud.stockMaxArticle"/>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s6">
            <span class="span">Stock Mínimo:</span>
            <input type='number' v-model="dataCrud.stockMinArticle"/>
          </div>
          <div class="input-field col s6">
            <span class="span">Categoria:</span>
            <Select2 :options="categories" v-model="selectedValue" @change="myChangeEvent($event)" @select="mySelectEvent($event)"/>
          </div>
        </div>
        <div class="center-align">
          <a class="waves-effect waves-light btn btn-edit" @click="save=true;ADDArticle()">AÑADIR</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiRest from "@/mixins/ApiRest.vue";
import Pagination from './sections/Pagination.vue';
import '../assets/css/global.css'
import Select2 from 'v-select2-component';

export default {
  mixins: [ApiRest],
  components:{
    Pagination,
    Select2,
  },
  data() {
    return {
      articles: [],

      categories: [],
      selectedValue: "",
      filtered: [],
      modal: 1,
      save: false,

      param:'articles',
      dataCrud:{
        nameArticle: "",
        priceArticle: 0,
        stockMinArticle: 0,
        stockMaxArticle: 0,
        dateExpirationArt: new Date().toISOString().slice(0, 10),
        category_id: 0,
      },

      // Paginado
      pagination: {
        'total': 0,
        'current_page': 0,
        'per_page': 0,
        'last_page': 0,
        'from': 0,
        'to': 0
      },
    };
  },
  mounted() {
    this.viewAllArticles(1);
  },
  methods:{
    viewAllArticles(page){
      this.getInfo(this.param,page).then((res) => {
        this.articles = res.articles.data;
        this.pagination = res.pagination;
      });
    },
    deleteArticle(id){
      Swal.fire({
        title: '¿Estás seguro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1e212d',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, seguro.'
      }).then((result) => {
        if (result.value) {
          if (result.isConfirmed) {
            this.deleteElement(this.param,id).then((res) => {
              console.log("Rta:",res)
              if (res.Estado == 'Satisfactorio') {
                Swal.fire(
                  'Borrado!',
                  '-' + res.Mensaje + '-'
                )
              }else {
                Swal.fire("Cancelado", "Error" + re);
              }
            });
          }
        }
      })

      this.viewAllArticles(1);
    },
    detailsArticle(id){
      const filtered = this.articles.filter(a => { return a.id === id });
      Swal.fire({
        title: '<strong> Detalle del artículo</strong>',
        html:
          `<h5><b> ${filtered[0].nameArticle} </b></h5>` +
          `<p> Precio: <i>$ ${filtered[0].priceArticle} </i> </p> ` +
          `<p> Stock minimo: <b> ${filtered[0].stockMaxArticle} </b> </p> ` +
          `Fecha de expiración: <b> ${filtered[0].dateExpirationArt} </b>`,
        showCloseButton: true,
        confirmButtonText:
          '<i class="fa fa-thumbs-up"></i> Ok'
      })
    },
    editArticle(article){
      if (!this.save) {
        this.filtered = article;
        this.modal = 2

        var self = this;
        this.getInfo("categoriesAll").then(function (response) {
          self.categories = response.map(x => {return x.nameCategory});
        })
      }else{
        this.editElement(this.param,this.filtered.id,this.dataCrud).then((res)=>{
          Swal.fire({
              icon: 'success',
              html: "Se ha editado con éxito",
          })
        });
        this.modal = 1;
      }
    },
    ADDArticle(){
      if (!this.save) {
        this.modal = 3

        var self = this;
        this.getInfo("categoriesAll").then(function (response) {
          self.categories = response.map(x => {return x.nameCategory});
        })
      }else{
        this.addElement('articles', this.dataCrud).then((res)=>{
          if (res != null) {
            Swal.fire({
                icon: 'success',
                html: "Se ha agregado con éxito",
            })
            setTimeout(() => {
              this.modal = 1;
              this.$router.go('articles')
            }, 3000);
          }
        })

      }
    },
    // Metodos exentos al CRUD
    page: function(page) {
      var pageView = page;
      this.viewAllArticles(pageView);
    },
    formatPrice(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    mySelectEvent(){
      var self = this;
      this.getElementByAtributte("categoriaIdByName",this.selectedValue).then((res) => {
        self.dataCrud.category_id = res;
        console.log(res);
      })
    },
    myChangeEvent(){
      console.log("Cambiado")
      var self = this;
      this.getElementByAtributte("categoriaIdByName",this.selectedValue).then((res) => {
        self.dataCrud.category_id = res;
      })
    }
  }
}
</script>

<style scoped>
  .details{
    position: relative;
    width: 100%;
    padding: 20px;
    padding-top: 0;
  }

  .details .table {
    position:relative;
    display: grid;
    min-height: 450px;
    background-color: var(--boxes-color);
    padding:20px;
  }

  .cardHeader{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cardHeader h4 { font-weight: 400; padding-left: 15px; }

  .details table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }

  .details table thead td{ font-weight: 600; }

  .details .table table tr {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .details .table table tbody tr:last-child{ border-bottom: none; }

  td,th { border-radius: 0; }

  .table > table > thead > tr > th:nth-child(3),
  .details .table table tbody tr td:nth-child(3){
    text-align: right;
    padding-right: 20px;
  }

  .table > table > thead > tr > th:nth-child(4),
  .details .table table tbody tr td:nth-child(4){
    text-align: right;
    padding-right: 20px;
  }

  .btn {
    position:relative;
    background: var(--green-color);
    text-decoration: none;
    border-radius: 5px;
    text-decoration: none;
    color: #FFF;
  }

  .btn:hover{ background:var(--green-secondary-color); }

  .router{
    text-decoration: none;
    color: inherit;
  }

  .icon{ margin: 0 5px}

  .v-select .dropdown-menu {
    display: block;
  }

  .btn-edit{ background: var(--secondary-bg-color); }
</style>

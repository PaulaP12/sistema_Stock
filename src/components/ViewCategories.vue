<template>
  <div class="container">
    <h3 class="title">RUBROS</h3>
    <div class="details">
      <div class="table-details">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(category, index) in categories" :key="index">
              <td>{{ category.id }}</td>
              <td class="nameCategory">{{ category.nameCategory }}</td>
              <td><font-awesome-icon @click="deleteArticle(article.id)" class='icon' icon="trash" style="color:red"/></td>
              <td><font-awesome-icon @click="editArticle(article.id)" class='icon' icon="edit" style="color:blue;"/></td>
            </tr>
          </tbody>
        </table>
        <Pagination v-if="pagination && pagination.current_page" :pagination="pagination" @page="page"/>
      </div>
      <div class="filters">
        <h6>Filtrar por nombre</h6>
        <input type="text" name="" id="">
      </div>
    </div>
  </div>
</template>

<script>
import ApiRest from "@/mixins/ApiRest.vue";
import Pagination from "./sections/Pagination.vue";

export default {
  mixins: [ApiRest],
  components:{
    Pagination
  },
  data() {
    return {
      categories: [],
      param: "categories",
    
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
  created() {
    this.viewAllCategories(1);
  },
  methods:{
    viewAllCategories(page){
      this.getInfo(this.param,page).then((res) => {
        this.categories = res.categories.data;
        this.pagination = res.pagination;
      });
    },
    page: function(page) {
      var pageView = page;
      this.viewAllCategories(pageView);
    },
 }
};
</script>

<style scoped>
.details{
        position: relative;
        width: 100%;
        padding-top: 0;
        display: grid;
        grid-gap:20px;
        grid-template-columns: 2fr 1fr;
    }

    .details .table-details {
      position:relative;
      display: grid;
      min-height: 420px;
      background-color: var(--boxes-color);
      padding: 0 20px;
    }

    .details .filters {
      position:relative;
      max-height: 420px;
      background-color: var(--boxes-color);
      padding:20px;
    }

    .nameCategory{
      color:#1d880a;
      text-transform: capitalize;
      font-weight: 600;
    }
</style>

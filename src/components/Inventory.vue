<template>
    <div class="container">
        <div class="cardBox">
            <div class="card" v-for="section in sections" :key="section.id">
                <div>
                    <div class="numbers">{{section.amount}}</div>
                    <div class="cardName"><router-link class="router" :to="section.url">{{section.title}}</router-link></div>
                </div>
                <div class="iconBox">
                    <font-awesome-icon :icon="section.icon" />
                </div>
            </div>
        </div>

        <div class="details">
            <div class="recentOrders">
                <div class="cardHeader">
                    <h4>Últimos pedidos</h4>
                    <a class="btn"><router-link class="router" to="/">Ver todos</router-link></a>
                </div>
                <div class="container-spinner">
                    <div v-if="loading" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div>
                <transition name="fade">
                    <table v-if="!loading">
                        <thead>
                            <tr>
                                <th>Artículo</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Total</th>
                                <th>Rubro</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr :class="{littleStockClass: inv.littleStock}" v-for="(inv,i) in filterCategories" :key="i">
                                <td><div title="Hay menos cantidad que el stock mínimo.">{{inv.nameArticle}}</div></td>
                                <td>{{inv.cantForArticle}}</td>
                                <td>${{formatPrice(inv.priceArticle)}}</td>
                                <td>${{formatPrice(inv.total)}}</td>
                                <td>{{inv.nameCategory}}</td>
                            </tr>
                        </tbody>
                    </table>
                </transition>
            </div>
            <div class="filters">
                <div class="cardFilters">
                    <h4>Filtrar por:</h4>
                    <div class="input-field">
                        <input placeholder="Rubro" type="text" class="validate" v-model="filter">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ApiRest from "@/mixins/ApiRest.vue";
    import '../assets/css/spinner.css';

    export default {
        mixins: [ApiRest],
        data(){
            return {
                param:'inventory',
                inventory:[],
                filter:'',
                littleStock:false,
                articles:[],
                sections:[
                    { id:1, title: 'Articulos', url:'/Articles', icon:"box", amount:0},
                    { id:2, title: 'Rubros', url:'/Categories', icon: "tag", amount:0 },
                    { id:3, title: 'Comprobantes', url:'/Receipts', icon: 'receipt', amount:0  },
                ],
                loading:true,
            }
        },
        created(){
            this.getInfo("articles").then((res) => { this.sections[0].amount = res.length; });
            this.getInfo("categories").then((res) => { this.sections[1].amount = res.length; });
            this.getInfo(this.param).then((res) => {
                this.inventory = res;
                this.loading = false;
            });
        },
        computed:{
            filterCategories(){
                return this.inventory.filter(row => {
                    return row.nameCategory.match(this.filter)
                })
            }
        },
        methods:{
            formatPrice(value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
        }
    }
</script>

<style scoped>
    .router{
        text-decoration: none; 
        color: inherit;
    }

    .container{
        width: 91%;
    }

    .cardBox{
        position:relative;
        width: 100%;
        padding:20px;
        display:grid;
        grid-template-columns: repeat(3,1fr);
        grid-gap:20px;
    }

    .cardBox .card {
        position:relative;
        background-color: var(--boxes-color);
        padding: 20px;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
    }

    .cardBox .card .numbers {
        position:relative;
        font-size: 2rem;
        font-weight: 500;
    }

    .cardBox .card .cardName {
        color: var(--green-secondary-color);
    }

    .cardBox .card .iconBox{
        font-size: 2.5rem;
        color: var(--secondary-text);
    }

    .details{
        position: relative;
        width: 100%;
        padding: 20px;
        padding-top: 0;
        display: grid;
        grid-gap:20px;
        grid-template-columns: 2fr 1fr;
    }

    .details .recentOrders {
        position:relative;
        display: grid;
        min-height: 530px;
        background-color: var(--boxes-color);
        padding:20px;
    }
    
    .cardHeader{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .cardHeader h4 { font-weight: 600; }

    .btn {
        position:relative;
        background: var(--green-color);
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
    }

    .btn:hover{ background:var(--green-secondary-color); }

    .details table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
    }

    .details table thead td{ font-weight: 600; }

    .details .recentOrders table tr {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .details .recentOrders table tbody tr:last-child{ border-bottom: none; }

    .details .recentOrders table tbody tr:hover{
        background: var(--green-color);
        color: #fff;
        border:none;
    }

    td,th { border-radius: 0; }

    .recentOrders > table > thead > tr > th:nth-child(3),
    .details .recentOrders table tbody tr td:nth-child(3){
        text-align: right;
        padding-right: 20px;
    }

    .recentOrders > table > thead > tr > th:nth-child(4),
    .details .recentOrders table tbody tr td:nth-child(4){
        text-align: right;
        padding-right: 20px;
    }

    .details .filters {
        position:relative;
        display: grid;
        min-height: 530px;
        background-color: var(--boxes-color);
        padding:20px;
    }

    .littleStockClass{color:#c92222;}

</style>


<template>
    <div class="container">
        <div class="rowTitle">
            <h3 class="title">INVENTARIO</h3>
            <font-awesome-icon class='icon' :icon="['fas', 'square']"/><span class="span-comment">Hay menos cantidad que el stock mínimo</span>
            <span class="span">Filtrar por Rubro:</span>
            <div class="input-field">
                <input type="text" class="validate" v-model="filter">
            </div>
        </div>
        <table class="centered">
            <thead class="color">
            <tr>
                <th>Rubro</th>
                <th>Artículo</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
            </tr>
            </thead>

            <tbody>
                <tr :class="{littleStockClass: inv.littleStock}" v-for="(inv,i) in filterCategories" :key="i">
                    <td>{{inv.nameCategory}}</td>
                    <td><b>{{inv.nameArticle}}</b></td>
                    <td>{{inv.cantForArticle}}</td>
                    <td>${{formatPrice(inv.priceArticle)}}</td>
                    <td>${{formatPrice(inv.total)}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import ApiRest from "@/mixins/ApiRest.vue";

    export default {
        mixins: [ApiRest],
        data(){
            return {
                param:'inventory',
                inventory:[],
                filter:'',
                littleStock:false,
                articles:[]
            }
        },
        created(){
            this.getInfo(this.param).then((res) => {
                this.inventory = res;
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
    .color {background-color: #080a0a94; color: white;}
    .rowTitle{display:flex;align-items:center;}
    .title{flex:1 1 auto;}
    .span{margin-right: 10px;}
    .span-comment{margin-right: 70px;font-size: 12px;}
    .littleStockClass{background-color:#ff000048;color:#000000;border:1px solid #FFF}
    .icon{color:#ff000048;flex:1 1 auto}
</style>


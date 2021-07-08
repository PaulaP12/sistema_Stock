<template>
    <div class="container">
        <h3>INVENTARIO</h3>
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
                <tr v-for="(cant,i) in inventory" :key="i">
                    <td>{{articles[i].category_id}}</td>
                    <td>{{articles[i].nameArticle}}</td>
                    <td>{{cant}}</td>
                    <td>${{articles[i].priceArticle}}</td>
                    <td>${{articles[i].priceArticle * cant}}</td>
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
                articles:[],
                inventory:[],
            }
        },
        created(){
            this.getInfo(this.param).then((res) => {
                this.inventory = res;
            });
            this.getInfo('articles').then((res) => {
                this.articles = res;
            });
        },
    }
</script>

<style scoped>
    .color {background-color: #080a0a94; color: white;}
</style>
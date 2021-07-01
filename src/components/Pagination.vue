<template>
    <div>
        <ul class="pagination">
            <li v-on:click="previousPage()"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
            <li v-for="(page,index) of totalPages()" :key="index" v-on:click="getDataPage(page)" :class="isActive(page)"><a href="#!">{{page}}</a></li>
            <li class="waves-effect" v-on:click="nextPage()"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
        </ul>
    </div>
</template>

<script>
    import ApiRest from "@/mixins/ApiRest.vue";
    
    export default {
        mixins: [ApiRest],
        props:['param'],
        created(){
            this.getInfo(this.param).then((res) => {
                this.array = res;
                this.getDataPage(1)
            });
        },
        data(){
            return{
                arrayForPage: 5,
                dataPaged:[],
                pageCurrent:1,
                array:[],
            }
        },
        methods:{
            totalPages(){
                return Math.ceil(this.array.length / this.arrayForPage)
            },
            getDataPage(numberPage){
                this.dataPaged = []
                let inicio = (numberPage * this.arrayForPage) - this.arrayForPage
                let fin = (numberPage * this.arrayForPage)
                this.dataPaged = this.array.slice(inicio,fin)
                this.$emit('paginado',this.dataPaged)
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
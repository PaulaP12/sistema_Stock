<template>
  <ul class="pagination">
		{{ }}
		<li v-if="pagination.current_page > 1">
			<a class="btn-page first" @click.prevent="changePage(pagination.current_page - 1)">
		    	<span>Atras</span>
	    	</a>
		</li>

		<li v-for="page in pagesNumber" :class="[ page == isActived ? 'active' : '']" :key="page">
			<a class="btn-page" @click.prevent="changePage(page)"> {{ page }} </a>
		</li>

		<li v-if="pagination.current_page < pagination.last_page">
			<a class="btn-page last" @click.prevent="changePage(pagination.current_page + 1)">
				<span>Siguiente</span>
			</a>
		</li>
	</ul>
</template>

<script>
    export default {
        props:['pagination'],
        data(){
            return{
							offset:3,
            }
        },
				computed: {
					isActived: function() {
						return this.pagination.current_page;
					},
					pagesNumber: function() {
						if(!this.pagination.to){
							return [];
						}

						var from = this.pagination.current_page - this.offset; 
						if(from < 1){
							from = 1;
						}

						var to = from + (this.offset * 2); 
						if(to >= this.pagination.last_page){
							to = this.pagination.last_page;
						}

						var pagesArray = [];
						while(from <= to){
							pagesArray.push(from);
							from++;
						}
						return pagesArray;
					}
				},
        methods:{
					changePage: function(page) {
						this.pagination.current_page = page;
						this.$emit('page', page)
					},
        }
    }
</script>

<style scoped>
	#app > div > div > div > a{ background: var(--green-color); }
	#app > div > div > div > a:hover{ background: var(--green-secondary-color); }
	.pagination li.active { background: var(--secondary-bg-color); }
</style>
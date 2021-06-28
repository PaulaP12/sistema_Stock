<template>
  <div>
    <ViewArticles/>
  </div>
</template>

<script>
// @ is an alias to /src
import ViewArticles from '../components/ViewArticles.vue'

export default {
  name: 'Articles',
  components: {
    ViewArticles
  }
}
</script>

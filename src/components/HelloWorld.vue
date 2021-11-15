<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script setup>
const props = defineProps({
    msg: {
        type: String,
        default: 'hello'
    }
})
</script>

<style scoped>
.hello {
  width: 200px;
}
</style>

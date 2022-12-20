<template>
    <div class="max-w-7xl m-auto py-5 shadow-lg rounded">
        <h3 class="text-2xl font-semibold">What's Popular in TV Shows:</h3>
        <div v-if="loading">
            <img class="h-20 m-auto" src="../assets/loadingGif.gif" alt="loading.." />
        </div>
        <Card v-else :list="list" />
    </div>
</template>

<script>
import axios from "axios";
import Card from "./global/card.vue";

export default {
    name: "PopularTV",
    data() {
        return {
            list: [],
            loading: true,
        }
    },
    async mounted() {
        await axios.get(`${import.meta.env.VITE_API_URL}/tv/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`)
            .then(response => this.list = response.data.results)
            .catch(error => console.log(error))
            .finally(() => this.loading = false);
    },
    components: {
        Card
    }
}
</script>
<style>

</style>
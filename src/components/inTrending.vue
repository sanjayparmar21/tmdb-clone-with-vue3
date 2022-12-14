<template>
    <div class="max-w-7xl m-auto py-5">
        <h3 class="text-2xl font-semibold">What's in Trending:</h3>
        <div v-if="loading">
            <img class="h-20 m-auto" src="../assets/loadingGif.gif" alt="loading.." />
        </div>
        <TrendingCard v-else :list="list" />
    </div>
</template>

<script>
import axios from "axios";
import TrendingCard from "./global/trendingCard.vue";

export default {
    name: "Trending",
    data() {
        return {
            list: [],
            loading: true,
            movie: "Trending",
        }
    },
    async mounted() {
        await axios.get(`${import.meta.env.VITE_API_URL}/trending/all/day?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=2`)
            .then(response => this.list = response.data.results)
            .catch(error => console.log(error))
            .finally(() => this.loading = false);
    },
    components: {
        TrendingCard
    }
}
</script>
<style>

</style>
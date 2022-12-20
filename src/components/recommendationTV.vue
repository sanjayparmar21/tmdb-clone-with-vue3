<template>
    <h3 v-if="list.length" class="text-xl font-bold max-w-7xl m-auto py-2">Recommendations</h3>
    <div class="flex flex-nowrap gap-4 overflow-auto cursor-pointer max-w-7xl m-auto maskImage">
        <div v-for="item in list" :key="item.id">
            <div v-if="item.backdrop_path" class="h-40 sm:h-52 w-44 sm:w-96">
                <!-- @click=clickMe(item.id) -->
                <img :src="(prefix + item.backdrop_path)" alt="banner" class="rounded-xl " />
            </div>
            <div v-else
                class="h-40 sm:h-52 w-44 sm:w-96 bg-gradient-to-r from-[#afe6d1] via-[#abc4ec] to-[#c299e9] rounded-xl">
            </div>
            <div class="flex item-center justify-between py-2">
                <h3 class="text-lg font-semibold w-3/4 truncate">{{ item.name }}</h3>
                <h3 class="text-lg font-semibold">{{ item.first_air_date }}</h3>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { useRoute } from 'vue-router';

export default {
    name: "RecommendationTV",
    data() {
        return {
            list: [],
            prefix: "",
            details: true,
            loading: true,
        }
    },
    async mounted() {
        const route = useRoute();
        this.prefix = `${import.meta.env.VITE_API_IMAGE_PREFIX}`;

        await axios.get(`${import.meta.env.VITE_API_URL}/tv/${this.$store.state.movieId}/recommendations?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`)
            .then(response => this.list = response.data.results)
            .catch(error => console.log(error))
            .finally(() => this.loading = false);
    },
    // methods: {
    //     clickMe(id) {
    //         this.$router.push(`/TVDetails/${id}`);
    //     },
    // }
};

</script>

<style>
.maskImage {
    -webkit-mask-image: linear-gradient(to right, rgb(46, 46, 49) 95%, transparent 100%);
}
</style>
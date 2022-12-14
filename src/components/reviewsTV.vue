<template>
    <div v-if="list.author" class="bg-gradient-to-r from-green-100 to-blue-100 max-w-7xl m-auto">
        <article class="p-4 px-8">
            <p class="text-2xl font-bold text-slate-700 pt-2">Author Name: {{ list.author }}</p>
            <div class="flex items-center gap-2">
                <p class="text-xl font-semibold text-red-500">Rating: </p>
                <div v-for="item in list.author_details?.rating" class="text-orange-500">
                    <Star />
                </div>
            </div>
            <p class="text-lg text-justify text-amber-700 font-semibold py-2">Content: {{ list.content }}</p>
            <p class="truncate"><b>More Details: </b>
                <a class="text-blue-600" :href=list.url target="_blank">{{ list.url }}</a>
            </p>
        </article>
    </div>
</template>

<script>
import { useRoute } from 'vue-router';
import axios from "axios";
import Star from "../assets/star.vue"

export default {
    data() {
        return {
            viewMore: false,
            star: false,
            list: [],
        }
    },
    async mounted() {
        const route = useRoute();
        this.prefix = `${import.meta.env.VITE_API_IMAGE_PREFIX}`

        await axios.get(
            `${import.meta.env.VITE_API_URL}/tv/${route.params.TVDetails}/reviews?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`
        )
            .then(response => this.list = response.data.results[0])
            .catch(error => console.log(error))
    },
    components: {
        Star
    },
}
</script>

<style>

</style>

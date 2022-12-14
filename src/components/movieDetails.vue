<template>
    <Navbar />
    <div v-if="loading">
        <img class="h-20 m-auto" src="../assets/loadingGif.gif" alt="loading.." />
    </div>
    <div v-else class="justify-center block sm:flex items-center bg-slate-500 max-w-7xl m-auto">
        <img :src="prefix + list.poster_path" alt="banner" class="max-h-[20rem] sm:h-96 rounded-lg m-auto sm:m-6" />
        <article class="text-white p-4">
            <div>
                <p class="text-4xl font-semibold">{{ list.title }}</p>
                <p>{{ list.tagline }}</p>
            </div>
            <div class="flex flex-row items-center gap-2 sm:gap-4 my-4">
                <p class="font-bold">User<br/>Votes:</p>
                <p class="p-3 w-fit rounded-full text-xl font-bold bg-slate-800 border-4 border-green-500">{{ (list.vote_average * 10).toFixed() }}</p>
                <p class="p-3 w-fit rounded-full text-sm font-bold bg-slate-800" v-on:mouseover="viewMore = true" v-on:mouseleave="viewMore = false">
                    <ViewMore />
                    <span class="absolute bg-slate-900 mt-4 p-1 rounded-lg font-normal" v-if="viewMore">Add To List</span>
                </p>
                <p class="p-3 w-fit rounded-full text-sm font-bold bg-slate-800" v-on:mouseover="heart = true" v-on:mouseleave="heart = false">
                    <Heart />
                    <span class="absolute bg-slate-900 mt-4 p-1 rounded-lg font-normal" v-if="heart">Mark As Favorite</span>
                </p>
                <p class="p-3 w-fit rounded-full text-sm font-bold bg-slate-800" v-on:mouseover="bookmark = true" v-on:mouseleave="bookmark = false">
                    <Bookmark />
                    <span class="absolute bg-slate-900 mt-4 p-1 rounded-lg font-normal" v-if="bookmark">Watch List</span>
                </p>
                <p class="p-3 w-fit rounded-full text-sm font-bold bg-slate-800" v-on:mouseover="star = true" v-on:mouseleave="star = false">
                    <Star />
                    <span class="absolute bg-slate-900 mt-4 p-1 rounded-lg font-normal" v-if="star">Rate It!</span>
                </p>
            </div>
            <div>
                <h5 class="text-xl font-bold">Overview</h5>
                <p class="text-md sm:text-lg text-justify pr-8">{{ list.overview }}</p>
            </div>
        </article>
    </div>
    <ReviewsMovie />
    <!-- data from state
    {{title}} -->
    <RecommendationMovie />
    <Footer />
</template>

<script>
    import Navbar from '../components/global/header/navbar.vue';
    import RecommendationMovie from './RecommendationMovie.vue';
    import ReviewsMovie from "./reviewsMovie.vue";
    import Footer from './global/footer/footer.vue';
    import ViewMore from '../assets/viewMore.vue';
    import Heart from '../assets/heart.vue';
    import Bookmark from '../assets/bookmark.vue';
    import Star from '../assets/star.vue';
    import { useRoute } from 'vue-router';
    import axios from "axios";
    import {useStore} from "vuex";

    export default {
        data() {
            let store = useStore();
            let title = store.state.title;
            
            return{
                viewMore: false,
                heart: false,
                bookmark: false,
                star: false,
                list: [],
                loading: true,
                title,
            }
        },
        async mounted() {
            const route = useRoute();
            this.prefix = `${import.meta.env.VITE_API_IMAGE_PREFIX}`;

            await axios.get(
                `${import.meta.env.VITE_API_URL}/movie/${route.params.movieDetails}?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`
            )
                .then(response => this.list = response.data)
                .catch(error => console.log(error))
                .finally(() => this.loading = false);
        },
        components: { 
            Navbar, RecommendationMovie, ReviewsMovie, Footer, ViewMore, Heart, Bookmark, Star 
        },
    }
</script>

<style>

</style>

<template>
    <Navbar />
    <div class="block sm:flex items-center bg-slate-600 max-w-7xl m-auto">
        <img :src="(prefix + list.poster_path)" alt="banner" class="max-h-[20rem] sm:h-96 rounded-lg m-auto sm:m-6 imgSkeleton" />

        <article class="text-white p-4">
            <div>
                <p>{{ list.tagline }}</p>
            </div>
            <div :class="this.loading ? 'voteSkeleton flex flex-row items-center gap-2 sm:gap-4 my-4' : 'flex flex-row items-center gap-2 sm:gap-4 my-4'">
                <p class="font-bold">User<br />Votes:</p>
                <p class="p-3 w-fit rounded-full text-xl font-bold bg-slate-800 border-4 border-green-500">
                    {{
                        list.vote_average ? (list.vote_average * 10).toFixed() : 0
                    }}
                </p>
                <p 
                    class="p-3 w-fit rounded-full text-sm font-bold bg-slate-800" 
                    v-on:mouseover="viewMore = true"
                    v-on:mouseleave="viewMore = false"
                >
                    <ViewMore />
                    <span class="absolute bg-slate-900 mt-4 p-1 rounded-lg font-normal" v-if="viewMore">Add To
                        List</span>
                </p>
                <p class="p-3 w-fit rounded-full text-sm font-bold bg-slate-800" v-on:mouseover="heart = true"
                    v-on:mouseleave="heart = false">
                    <Heart />
                    <span class="absolute bg-slate-900 mt-4 p-1 rounded-lg font-normal" v-if="heart">Mark As
                        Favorite</span>
                </p>
                <p class="p-3 w-fit rounded-full text-sm font-bold bg-slate-800" v-on:mouseover="bookmark = true"
                    v-on:mouseleave="bookmark = false">
                    <Bookmark />
                    <span class="absolute bg-slate-900 mt-4 p-1 rounded-lg font-normal" v-if="bookmark">Watch
                        List</span>
                </p>
                <p class="p-3 w-fit rounded-full text-sm font-bold bg-slate-800" v-on:mouseover="star = true"
                    v-on:mouseleave="star = false">
                    <Star />
                    <span class="absolute bg-slate-900 mt-4 p-1 rounded-lg font-normal" v-if="star">Rate It!</span>
                </p>
            </div>
             <div :class="this.loading ? 'dateSkeleton flex items-center gap-3' : 'flex items-center gap-3'">
                <h5 v-if="list.first_air_date" class="text-xl font-semibold">Starting Date: </h5>
                <p v-if="list.first_air_date" class="text-xl">{{ list.first_air_date }}</p>
            </div>
            <!-- class="dateSkeleton flex items-center gap-3" -->
            <!-- :class="this.loading ? 'dateSkeleton flex items-center gap-3' : 'flex items-center gap-3'" -->
            <div 
                v-if="list.networks?.length"
                :class="this.loading ? 'dateSkeleton flex items-center gap-3' : 'flex items-center gap-3'"
            >
                <h5 class="text-xl font-semibold">Networks: </h5>
                <p class="text-xl">{{ list.networks[0].name }}</p>
            </div>
            <div :class="this.loading ? 'overviewSkeleton' : '' " >
                <h5 v-if="list.overview" class="text-xl font-bold mt-4">Overview</h5>
                <p v-if="list.overview" class="text-md sm:text-lg text-justify pr-8">{{ list.overview }}</p>
            </div>
        </article>
    </div>
    <ReviewsTV />
    <RecommendationTV />
    <Footer />
</template>

<script>
import Navbar from '../components/global/header/navbar.vue';
import RecommendationTV from './recommendationTV.vue';
import ReviewsTV from "./reviewsTV.vue";
import Footer from './global/footer/footer.vue';
import ViewMore from '../assets/viewMore.vue';
import Heart from '../assets/heart.vue';
import Bookmark from '../assets/bookmark.vue';
import Star from '../assets/star.vue';
import { useRoute } from 'vue-router';
import axios from "axios";

export default {
    data() {
        return {
            viewMore: false,
            heart: false,
            bookmark: false,
            star: false,
            list: [],
            loading: true,
        }
    },
    async mounted() {
        const route = useRoute();
        this.prefix = `${import.meta.env.VITE_API_IMAGE_PREFIX}`;

        await axios.get(
            `${import.meta.env.VITE_API_URL}/tv/${route.params.TVDetails}?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`
        )
            .then(response => this.list = response.data)
            .catch(error => console.log(error))
            .finally(() => this.loading = false);
    },
    components: {
        Navbar, RecommendationTV, ReviewsTV, Footer, ViewMore, Heart, Bookmark, Star
    },
}
</script>

<style>
.imgSkeleton {
    height: 320px;
    width: 250px;
    animation: skeleton-loading 1s linear infinite alternate;
}
.voteSkeleton {
    width: 380px;
    animation: skeleton-loading 1s linear infinite alternate;
}
.dateSkeleton {
    width: 250px;
    animation: skeleton-loading 1s linear infinite alternate;
}
.overviewSkeleton {
    width: 900px;
    height: 100px;
    animation: skeleton-loading 1s linear infinite alternate;
}

@keyframes skeleton-loading {
    0% {
        background-color: hsl(200, 20%, 70%);
    }

    100% {
        background-color: hsl(200, 20%, 90%);
    }
}
</style>

<template>
        <section v-if="this.$store.state.movieId" class="bg-black bg-opacity-50 w-full fixed inset-0" @click="close">
            <!-- for movie details -->
            <section v-if="$route.path === '/movieList'" :style="{ backgroundImage: `url(${this.prefix + details.backdrop_path})` }"
                class="bg-cover z-10 text-white bg-slate-100 max-w-5xl fixed right-0 top-14 bottom-0 rounded-tl-xl rounded-bl-xl">
                <section class="bg-black bg-opacity-40 min-h-full rounded-tl-xl rounded-bl-xl">
                    <RecommendationTV />
                    <article class="justify-center block sm:flex items-start max-w-7xl m-auto rounded-tl-xl p-6">
                        <img :src="prefix + details.poster_path" alt="banner" class="max-h-[20rem] sm:h-96 rounded-lg m-auto skeleton-for-image" />
                        <article class="ml-10">
                            <div>
                                <p :class="this.loading ? 'skeleton-for-title text-4xl font-semibold' : 'text-4xl font-semibold'">{{ details.title }}</p>
                                <p :class="this.loading ? 'skeleton-for-sub-title mt-2' : ''">{{ details.tagline }}</p>
                            </div>
                            <div 
                                :class="this.loading 
                                    ? 'flex flex-row items-center gap-2 sm:gap-4 my-4 skeleton-for-vote' 
                                    : 'flex flex-row items-center gap-2 sm:gap-4 my-4'"
                            >
                                <p class="font-bold">User<br />Votes:</p>
                                <p class="p-3 w-fit rounded-full text-xl font-bold text-white bg-slate-800 border-4 border-green-500">{{
                                details.vote_average ? (details.vote_average * 10).toFixed() : 0 }}</p>
                                <p class="p-3 w-fit rounded-full text-sm font-bold text-white bg-slate-800" v-on:mouseover="viewMore = true"
                                    v-on:mouseleave="viewMore = false">
                                    <ViewMore />
                                    <span class="absolute bg-slate-900 mt-4 p-1 rounded-lg font-normal" v-if="viewMore">Add To List</span>
                                </p>
                                <p class="p-3 w-fit rounded-full text-sm font-bold text-white bg-slate-800" v-on:mouseover="heart = true"
                                    v-on:mouseleave="heart = false">
                                    <Heart />
                                    <span class="absolute bg-slate-900 mt-4 p-1 rounded-lg font-normal" v-if="heart">Mark As Favorite</span>
                                </p>
                                <p class="p-3 w-fit rounded-full text-sm font-bold text-white bg-slate-800" v-on:mouseover="bookmark = true"
                                    v-on:mouseleave="bookmark = false">
                                    <Bookmark />
                                    <span class="absolute bg-slate-900 mt-4 p-1 rounded-lg font-normal" v-if="bookmark">Watch List</span>
                                </p>
                                <p class="p-3 w-fit rounded-full text-sm font-bold text-white bg-slate-800" v-on:mouseover="star = true"
                                    v-on:mouseleave="star = false">
                                    <Star />
                                    <span class="absolute bg-slate-900 mt-4 p-1 rounded-lg font-normal" v-if="star">Rate It!</span>
                                </p>
                            </div>
                            <div>
                                <h5 :class="this.loading ? 'skeleton-for-overview-title text-xl font-bold' : 'text-xl font-bold'">Overview</h5>
                                <p :class="this.loading ? 'skeleton-for-overview mt-2 text-md sm:text-lg text-justify pr-8' : 'text-md sm:text-lg text-justify pr-8'">{{ details.overview }}</p>
                            </div>
                            <div :class="this.loading ? 'skeleton-for-date flex items-center gap-2 text-xl mt-2' : 'flex items-center gap-2 text-xl'">
                                <h4 class="text-xl font-bold">Release Date: </h4>
                                <p class="text-md sm:text-lg text-justify py-2">{{ details.release_date }}</p>
                            </div>
                        </article>
                        <button class="text-2xl px-2 font-bold border-2 rounded-full" @click="close">X</button>
                    </article>
                    <article class="pb-10 pt-2 px-8 rounded-bl-xl flex gap-10">
                        <section :class="this.loading && 'skeleton-for-language'">
                            <a :href="details.homepage" target="_blank"
                                class="cursor-pointer text-xl font-semibold hover:underline hover:underline-offset-4">Go To Home Page </a>
                            <div class="flex items-center gap-2 text-xl">
                                <h4 class="text-xl font-semibold">Language: </h4>
                                <p class="font-serif">{{details.original_language}}</p>
                            </div>
                            <div class="flex items-center gap-2 text-xl">
                                <h4 class="text-xl font-semibold">Popularity: </h4>
                                <p class="font-sans">{{details.popularity}}</p>
                            </div>
                            <div class="flex items-center gap-2 text-xl">
                                <h4 class="text-xl font-semibold">Total Vote </h4>
                                <p class="font-sans">{{ details.vote_count }}</p>
                            </div>
                            <div class="flex items-center gap-2 text-xl">
                                <h4 class="text-xl font-semibold">Vote Average: </h4>
                                <p class="font-sans">{{ details.vote_average }}</p>
                            </div>
                        </section>
                        <section :class="this.loading ? 'skeleton-for-overview' : 'w-full min-h-[300px] max-h-[480px] overflow-auto'">
                            <ul class="text-xl font-semibold flex items-center gap-4">Genres:
                                <li class="text-xl font-normal font-serif" v-for="item in details.genres">{{item.name}}</li>
                            </ul>
                            <ul class="text-xl font-semibold">Production Company:
                                <li class="text-xl font-normal font-serif pl-20" v-for="item in details.production_companies">~> {{ item.name }}, ({{ item.origin_country }})</li>
                            </ul>
                            <ul class="text-xl font-semibold">Production Country:
                                <li class="text-xl font-normal font-serif pl-20" v-for="item in details.production_countries">~> {{ item.name }}</li>
                            </ul>
                            <ul class="text-xl font-semibold">Spoken Languages
                                <li class="text-xl font-normal font-serif pl-20" v-for="item in details.spoken_languages">~> {{ item.name }}</li>
                            </ul>
                        </section>
                    </article>
                </section>
            </section>
            <!-- for tv details -->
            <section v-else :style="{ backgroundImage: `url(${this.prefix + details.backdrop_path})` }"
                class="bg-cover z-10 text-white bg-slate-100 max-w-5xl fixed right-0 top-14 bottom-0 rounded-tl-xl rounded-bl-xl">
                <section class="bg-black bg-opacity-40 min-h-full rounded-tl-xl rounded-bl-xl">
                    <article class="justify-center block sm:flex items-start max-w-7xl m-auto rounded-tl-xl p-6">
                        <img :src="prefix + details.poster_path" alt="banner"
                            class="max-h-[20rem] sm:h-96 rounded-lg m-auto skeleton-for-image" />
                        <article class="ml-10">
                            <div>
                                <p :class="this.loading ? 'skeleton-for-title text-4xl font-semibold' : 'text-4xl font-semibold'">{{
                                details.original_name }}</p>
                                <p :class="this.loading ? 'skeleton-for-sub-title mt-2' : ''">{{ details.tagline }}</p>
                            </div>
                            <div
                                :class="this.loading ? 'flex flex-row items-center gap-2 sm:gap-4 my-4 skeleton-for-vote' : 'flex flex-row items-center gap-2 sm:gap-4 my-4'">
                                <p class="font-bold">User<br />Votes:</p>
                                <p
                                    class="p-3 w-fit rounded-full text-xl font-bold text-white bg-slate-800 border-4 border-green-500">
                                    {{
                                    details.vote_average ? (details.vote_average * 10).toFixed() : 0 }}</p>
                                <p class="p-3 w-fit rounded-full text-sm font-bold text-white bg-slate-800"
                                    v-on:mouseover="viewMore = true" v-on:mouseleave="viewMore = false">
                                    <ViewMore />
                                    <span class="absolute  bg-slate-900 mt-4 p-1 rounded-lg font-normal" v-if="viewMore">Add To
                                        List</span>
                                </p>
                                <p class="p-3 w-fit rounded-full text-sm font-bold text-white bg-slate-800"
                                    v-on:mouseover="heart = true" v-on:mouseleave="heart = false">
                                    <Heart />
                                    <span class="absolute bg-slate-900 mt-4 p-1 rounded-lg font-normal" v-if="heart">Mark As
                                        Favorite</span>
                                </p>
                                <p class="p-3 w-fit rounded-full text-sm font-bold text-white bg-slate-800"
                                    v-on:mouseover="bookmark = true" v-on:mouseleave="bookmark = false">
                                    <Bookmark />
                                    <span class="absolute bg-slate-900 mt-4 p-1 rounded-lg font-normal" v-if="bookmark">Watch
                                        List</span>
                                </p>
                                <p class="p-3 w-fit rounded-full text-sm font-bold text-white bg-slate-800"
                                    v-on:mouseover="star = true" v-on:mouseleave="star = false">
                                    <Star />
                                    <span class="absolute bg-slate-900 mt-4 p-1 rounded-lg font-normal" v-if="star">Rate It!</span>
                                </p>
                            </div>
                            <div>
                                <h5 :class="this.loading ? 'skeleton-for-overview-title text-xl font-bold' : 'text-xl font-bold'">
                                    Overview</h5>
                                <p
                                    :class="this.loading ? 'skeleton-for-overview mt-2 text-md sm:text-lg text-justify pr-8' : 'text-md sm:text-lg text-justify pr-8'">
                                    {{ details.overview }}</p>
                            </div>
                            <div
                                :class="this.loading ? 'skeleton-for-date flex items-center gap-2 text-xl mt-2' : 'flex items-center gap-2 text-xl'">
                                <h4 class="text-xl font-bold">Release Date: </h4>
                                <p class="text-md sm:text-lg text-justify py-2">{{ details.first_air_date }}</p>
                            </div>
                        </article>
                        <button class="text-2xl px-2 font-bold border-2 rounded-full" @click="close">X</button>
                    </article>
                    <article class="pb-10 pt-2 px-8 rounded-bl-xl flex gap-10">
                        <section :class="this.loading && 'skeleton-for-language'">
                            <a :href="details.homepage" target="_blank"
                                class="cursor-pointer text-xl font-semibold hover:underline hover:underline-offset-4">Go To Home
                                Page </a>
                            <div class="flex items-center gap-2 text-xl">
                                <h4 class="text-xl font-semibold">Language: </h4>
                                <p class="font-serif">{{details.original_language}}</p>
                            </div>
                            <div class="flex items-center gap-2 text-xl">
                                <h4 class="text-xl font-semibold">Popularity: </h4>
                                <p class="font-sans">{{details.popularity}}</p>
                            </div>
                            <div class="flex items-center gap-2 text-xl">
                                <h4 class="text-xl font-semibold">Total Vote </h4>
                                <p class="font-sans">{{ details.vote_count }}</p>
                            </div>
                            <div class="flex items-center gap-2 text-xl">
                                <h4 class="text-xl font-semibold">Vote Average: </h4>
                                <p class="font-sans">{{ details.vote_average }}</p>
                            </div>
                        </section>
                        <section
                            :class="this.loading ? 'skeleton-for-overview' : 'w-full min-h-[300px] max-h-[480px] overflow-auto'">
                            <ul class="text-xl font-semibold flex items-center gap-4">Genres:
                                <li class="text-xl font-normal font-serif" v-for="item in details.genres">{{item.name}}</li>
                            </ul>
                            <ul class="text-xl font-semibold">Production Company:
                                <li class="text-xl font-normal font-serif pl-20" v-for="item in details.production_companies">~> {{
                                item.name }}, ({{ item.origin_country }})</li>
                            </ul>
                            <ul class="text-xl font-semibold">Production Country:
                                <li class="text-xl font-normal font-serif pl-20" v-for="item in details.production_countries">~> {{
                                item.name }}</li>
                            </ul>
                            <ul class="text-xl font-semibold">Spoken Languages
                                <li class="text-xl font-normal font-serif pl-20" v-for="item in details.spoken_languages">~> {{
                                item.name }}</li>
                            </ul>
                        </section>
                    </article>
                    <!-- <RecommendationTV /> -->
                </section>
            </section>
        </section>
</template>

<script>
import axios from "axios";
import { useRoute } from "vue-router";
import ViewMore from '../../assets/viewMore.vue';
import Heart from '../../assets/heart.vue';
import Bookmark from '../../assets/bookmark.vue';
import Star from '../../assets/star.vue';
import RecommendationTV from "../recommendationTV.vue";

export default {
    name: "Modal",
    data() {
        return {
            details: [],
            loading: true,
        }
    },
    methods: {
        getDataById() {
            const route = useRoute();
            this.prefix = `${import.meta.env.VITE_API_IMAGE_PREFIX}`;
            if (route.path === "/movieList") {
                if (this.$store.state.movieId !== this.details.id) {
                    axios.get(`${import.meta.env.VITE_API_URL}/movie/${this.$store.state.movieId}?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`)
                        .then(response => this.details = response.data)
                        .catch(error => console.log(error))
                        .finally(() => this.loading = false)
                }
            } else {
                if (this.$store.state.movieId !== this.details.id) {
                    axios.get(`${import.meta.env.VITE_API_URL}/tv/${this.$store.state.movieId}?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`)
                        .then(response => this.details = response.data)
                        .catch(error => console.log(error))
                        .finally(() => this.loading = false)
                }
            }           
        },
        close() {
            this.$store.dispatch('selectedMovieId', '')
        }
    },
    updated() {
        this.getDataById();
    },
    components: {
    ViewMore,
    Heart,
    Bookmark,
    Star,
    RecommendationTV
},
}
</script>

<style>
.skeleton-for-image {
    width: 240px;
    height: 350px;
    animation: skeleton-loading 1s linear infinite alternate;
}
.skeleton-for-title {
    width: 350px;
    height: 40px;
    animation: skeleton-loading 1s linear infinite alternate;
}
.skeleton-for-sub-title {
    width: 350px;
    height: 25px;
    animation: skeleton-loading 1s linear infinite alternate;
}
.skeleton-for-vote {
    width: 400px;
    height: 70px;
    animation: skeleton-loading 1s linear infinite alternate;
}
.skeleton-for-overview-title {
    width: 90px;
    height: 25px;
    animation: skeleton-loading 1s linear infinite alternate;
}
.skeleton-for-overview {
    animation: skeleton-loading 1s linear infinite alternate;
}
.skeleton-for-date {
    width: 250px;
    height: 25px;
    animation: skeleton-loading 1s linear infinite alternate;
}
.skeleton-for-language {
    width: 260px;
    height: 120px;
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
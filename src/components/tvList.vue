<template>
    <Navbar />
    <div class="pt-14 max-w-7xl m-auto text-2xl font-semibold">
        <h3>List of TV series: </h3>
        <div class="flex">
            <input v-debounce:500ms="getSearchTVList" v-model="searchData" type="search" placeholder="Search for TV series"
                class="font-normal border-2 border-blue-500 rounded-lg w-full px-2 py-1 outline-blue-700" />
        </div>
    </div>
    <section class="flex justify-between gap-4 max-w-7xl m-auto">
        <article class="w-1/5">
            <!-- component for sorting -->
            <div class="p-2 rounded-lg border shadow-xl my-2 border-gray-400 font-semibold">
                Sort:
                <span 
                    class="relative inset-0 ml-10 p-2 py-[9px] w-full border border-gray-400 rounded-md cursor-pointer" 
                    :class="this.titleForSorting === 'Ascending' || this.titleForSorting === 'Descending' 
                    ? 'bg-gradient-to-r from-yellow-200 to-red-400 text-red-900' 
                    : 'bg-gradient-to-r from-green-200 to-blue-400'"
                    @click="changeSorting"
                >
                    {{ titleForSorting }}
                </span>
            </div>

            <!-- component for genre filtering -->
            <div class="p-2 rounded-lg border shadow-xl my-4 border-gray-400 font-semibold">
                Filters With Genre:
                <div v-if="this.activeBtn" class="p-2 mb-2 w-full border border-gray-400 rounded-md cursor-pointer text-center 
                    bg-gradient-to-r from-yellow-200 to-red-400 text-red-900"
                    @click="filterData('')">
                    Clear Filter
                </div>
                <div class="flex flex-wrap gap-2 max-w-md">
                    <div 
                        v-for="item in genreList" 
                        class="p-1 px-2 border w-fit border-gray-400 rounded-md cursor-pointer"
                        :class="this.activeBtn === item.id ? 'bg-gradient-to-r from-yellow-200 to-red-400 text-red-900' : 'bg-gradient-to-r from-green-200 to-blue-400'"
                        @click="filterData(item.id)">
                        {{item.name}}
                    </div>
                </div>
            </div>

            <!-- component for voting filtering -->
            <div class="p-2 rounded-lg border shadow-xl my-4 border-gray-400 font-semibold">
                Filters With Time:
                <div 
                    class="p-2 py-[9px] w-full border border-gray-400 rounded-md cursor-pointer" 
                    :class="this.onTVTodayBtn
                    ? 'bg-gradient-to-r from-yellow-200 to-red-400 text-red-900' 
                    : 'bg-gradient-to-r from-green-200 to-blue-400'" 
                    @click="onTVToday"
                    >
                    On TV Today
                </div>
                <div 
                    class="my-2 p-2 py-[9px] w-full border border-gray-400 rounded-md cursor-pointer" 
                    :class="this.topRatedBtn 
                    ? 'bg-gradient-to-r from-yellow-200 to-red-400 text-red-900' 
                    : 'bg-gradient-to-r from-green-200 to-blue-400'" 
                    @click="topRated"
                >
                    Top Rated
                </div>
                <div 
                    class="p-2 py-[9px] w-full border border-gray-400 rounded-md cursor-pointer" 
                    :class="this.airingTodayBtn
                    ? 'bg-gradient-to-r from-yellow-200 to-red-400 text-red-900' 
                    : 'bg-gradient-to-r from-green-200 to-blue-400'" 
                    @click="airingToday"
                >
                    Airing Today
                </div>
                <div 
                    class="my-2 p-2 py-[9px] w-full border border-gray-400 rounded-md cursor-pointer" 
                    :class="this.favTV
                    ? 'bg-gradient-to-r from-yellow-200 to-red-400 text-red-900' 
                    : 'bg-gradient-to-r from-green-200 to-blue-400'" 
                    @click="getFavTV"
                >
                    Favorite TV
                </div>
            </div>
            
            
        </article>
        <article class="flex flex-wrap gap-2 py-2 w-4/5">
            <div v-if="loading" class="m-auto">
                <img class="h-20 m-auto" src="../assets/loadingGif.gif" alt="loading.." />
            </div>
            <div v-if="list.length === 0" class="font-semibold text-2xl text-blue-600 w-full text-center">
                Sorry, TV series is not available, check again after some times.
            </div>
            <div v-else v-for="item in list" :key="item.id" class="relative">
                <div v-if="item.poster_path" class="w-60">
                    <img :src="prefix + item.poster_path" alt="banner"
                        class="cursor-pointer shadow-2xl rounded-xl skeleton"
                        @click=clickMe(item.id) />
                </div>
                <div v-else>
                    <div
                        class="w-60 sm:h-[355px] bg-gradient-to-r from-[#a4a6a5] to-[#e0e0e0] shadow-2xl rounded-xl">
                    </div>
                </div>
                <p 
                    class="absolute top-3 right-2 p-1 w-fit rounded-full text-sm font-bold cursor-pointer"
                    :class="this.dataFromFirebase?.includes(item.id) ? 'text-red-500' : 'text-white'" 
                    @click="addToFav(item.id)">
                    <Favorite />
                </p>
                <h3 class="text-lg font-semibold w-60 truncate cursor-default">{{ item.title ? item.title : item.name }}</h3>
            </div>
        </article>
    </section>
    <Footer />
</template>

<script>
import axios from 'axios';
import Favorite from '../assets/heart.vue';
import Navbar from './global/header/navbar.vue';
import Footer from './global/footer/footer.vue';
import Search from '../assets/search.vue';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import db from "../firebaseConfig.js";

export default {
    name: "List",

    data() {
        return {
            prefix: "",
            list: [],
            genreList: [],
            dataFromFirebase: [],
            loading: true,
            page: 1,
            searchData: "",
            titleForSorting: "Asc / Desc",
            sorting: true,
            activeBtn: "",
            onTVTodayBtn: false,
            topRatedBtn: false,
            airingTodayBtn: false,
            favTV: false,
        }
    },

    methods: {
        // function for sorting data on btn click
        changeSorting() {
            if(this.sorting === false) {
                this.sorting = true;
                this.titleForSorting = "Ascending";
                this.getListInAsc();
            } else {
                this.sorting = false;
                this.titleForSorting = "Descending";
                this.getListInDesc();
            }
        },
        clickMe(id) {
            this.$router.push(`/TVDetails/${id}`);
        },
        // get init data of TV
        getInitialList() {
            axios.get(`${import.meta.env.VITE_API_URL}/tv/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`)
                .then(response => this.list = response.data.results)
                .catch(error => console.log(error))
                .finally(() => this.loading = false);
        },
        // get genre data
        getGenreList() {
            axios.get(`${import.meta.env.VITE_API_URL}/genre/tv/list?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`)
                .then(response => this.genreList = response.data.genres)
                .catch(error => console.log(error))
                .finally(() => this.loading = false);
        },
        // get data of TV in ASC
        getListInAsc() {
            axios.get(`${import.meta.env.VITE_API_URL}/tv/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`)
                .then(response => this.list = response.data.results.sort())
                .catch(error => console.log(error))
                .finally(() => this.loading = false);
        },
        // get data of TV in DESC
        getListInDesc() {
            axios.get(`${import.meta.env.VITE_API_URL}/tv/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`)
                .then(response => this.list = response.data.results.sort().reverse())
                .catch(error => console.log(error))
                .finally(() => this.loading = false);
        },
        // function for infinity scroll
        getNextList() {
            window.onscroll = () => {
                let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
                if ((bottomOfWindow || this.list.length < 20) && this.searchData === '' && !this.favTV) {
                    this.page += 1;
                    axios.get(`${import.meta.env.VITE_API_URL}/tv/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${this.page}`)
                        .then(response => {
                            if (this.activeBtn) {
                                const responseData = response.data.results;
                                this.list = this.list.concat(responseData.filter(finalData => finalData.genre_ids.includes(this.activeBtn)))
                            } else {
                                this.list = this.list.concat(response.data.results);
                            }
                        })
                        .catch(error => console.log(error))
                        .finally(() => this.loading = false);
                }
            }
        },
        // function fot searching
        getSearchTVList() {
            if (this.searchData) {
                axios.get(`${import.meta.env.VITE_API_URL}/search/tv?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&query=${this.searchData}&page=1&include_adult=false`)
                    .then(response => this.list = response.data.results)
                    .catch(error => console.log(error))
                    .finally(() => this.loading = false);
            }
            else {
                this.getInitialList();
            }
        },
        // function for filter data
        filterData(id) {
            this.activeBtn = id;
            let page = 1;
            if (id) {
                axios.get(`${import.meta.env.VITE_API_URL}/tv/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${page}`)
                    .then(response => {
                        const responseData = response.data.results;
                        this.list = responseData.filter(finalData => finalData.genre_ids.includes(id))
                    })
                    .catch(error => console.log(error))
                    .finally(() => this.loading = false);
            } else {
                this.getInitialList();
            }
        },
        // function for filter data on TV Today
        onTVToday() {
            this.onTVTodayBtn = true;
            this.topRatedBtn = false;
            this.airingTodayBtn = false;
            this.favTV = false;

            axios.get(`${import.meta.env.VITE_API_URL}/tv/on_the_air?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`)
                .then(response => this.list = response.data.results)
                .catch(error => console.log(error))
                .finally(() => this.loading = false);
        },
        // function for filter data on Top Rated
        topRated() {
            this.onTVTodayBtn = false;
            this.topRatedBtn = true;
            this.airingTodayBtn = false;
            this.favTV = false;
            
            axios.get(`${import.meta.env.VITE_API_URL}/tv/top_rated?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`)
                .then(response => this.list = response.data.results)
                .catch(error => console.log(error))
                .finally(() => this.loading = false);
        },
        // function for filter data on Airing Today
        airingToday() {
            this.onTVTodayBtn = false;
            this.topRatedBtn = false;
            this.airingTodayBtn = true;
            this.favTV = false;

            axios.get(`${import.meta.env.VITE_API_URL}/tv/airing_today?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`)
                .then(response => this.list = response.data.results)
                .catch(error => console.log(error))
                .finally(() => this.loading = false);
        },
        // function for add to favorite
        async addToFav(id) {
            if (localStorage.getItem('uid')) {
                let uid = localStorage.getItem('uid');
                this.newId = id;

                const docRef = doc(db.db, "favoriteTVId", uid);
                const docSnap = await getDoc(docRef);

                let lengthOfFavTV = docSnap.data()?.favTVId?.length;

                if (lengthOfFavTV === 0 || lengthOfFavTV === undefined) {
                    await setDoc(doc(db.db, "favoriteTVId", uid), {
                        favTVId: arrayUnion(this.newId)
                    });
                } else {
                    if (docSnap.data().favTVId.includes(this.newId)) {
                        await updateDoc(doc(db.db, "favoriteTVId", uid), {
                            favTVId: arrayRemove(this.newId)
                        });
                    }
                    else {
                        await updateDoc(doc(db.db, "favoriteTVId", uid), {
                            favTVId: arrayUnion(this.newId)
                        });
                    }
                }
            } else {
                this.$store.dispatch('toggleLoginModal');
            }
            if (this.favTV){
                this.getFavTV();
            }
        },
        // function for get favorite TV list
        async getFavTV() {
            this.onTVTodayBtn = false;
            this.topRatedBtn = false;
            this.airingTodayBtn = false;
            this.favTV = true;

            let uid = localStorage.getItem('uid');
            const docRef = doc(db.db, "favoriteTVId", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let lengthOfFavTV = docSnap.data().favTVId.length;

                for (let index = 0; index < lengthOfFavTV; index++) {
                    axios.get(`${import.meta.env.VITE_API_URL}/tv/${docSnap.data().favTVId[index]}?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`)
                        .then(response => {
                            if (index === 0) {
                                this.list = [];
                                this.list.push(response.data)
                            } else {
                                this.list.push(response.data)
                            }
                        })
                        .catch(error => console.log(error))
                        .finally(() => this.loading = false);
                }
            } else {
                console.log("No such document!");
            }
        },
    },

    beforeMount() {
        this.getInitialList();
        this.getGenreList();
    },

    mounted() {
        this.prefix = `${import.meta.env.VITE_API_IMAGE_PREFIX}`;
        this.getNextList();
    },

    async updated() {
        let uid = localStorage.getItem('uid');
        const docRef = doc(db.db, "favoriteTVId", uid);
        const docSnap = await getDoc(docRef);
        this.dataFromFirebase = docSnap.data()?.favTVId;
    },

    components: {
        Navbar,
        Favorite,
        Footer,
        Search
    }

};
</script>

<style>
.skeleton {
    width: 240px;
    height: 355px;
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
<template>
    <section class="fixed w-64">
        <div class="p-2 rounded-lg border shadow-xl my-2 border-gray-400 font-semibold bg-white">
            Sort:{{ $store.state.favBtnClick }}
            <span class="relative inset-0 ml-10 p-2 py-[9px] w-full border border-gray-400 rounded-md cursor-pointer" :class="this.titleForSorting === 'Ascending' || this.titleForSorting === 'Descending'
            ? 'bg-gradient-to-r from-yellow-200 to-red-400 text-red-900'
            : 'bg-gradient-to-r from-green-200 to-blue-400'" @click="changeSorting">
                {{ titleForSorting }}
            </span>
        </div>
        <!-- component for genre filtering -->
        <div class="p-2 rounded-lg border shadow-xl my-4 border-gray-400 font-semibold bg-white">
            Filters With Genre:
            <div v-if="this.activeBtn" class="p-[6px] mb-2 border border-gray-400 rounded-md cursor-pointer text-center
                                bg-gradient-to-r from-yellow-200 to-red-400 text-red-900" @click="filterData('')">
                Clear Filter
            </div>
            <div class="flex flex-wrap gap-2 max-w-md">
                <div v-for="item in genreList" class="p-1 px-2 border w-fit border-gray-400 rounded-md cursor-pointer"
                    :class="this.activeBtn === item.id ? 'bg-gradient-to-r from-yellow-200 to-red-400 text-red-900' : 'bg-gradient-to-r from-green-200 to-blue-400'"
                    @click="filterData(item.id)">
                    {{ item.name }}
                </div>
            </div>
        </div>
        <!-- component for filter with time -->
        <div class="p-2 rounded-lg border shadow-xl my-4 border-gray-400 font-semibold bg-white">
            Filters With Time:
            <article v-if="$route.path === '/movieList'">
                <div v-for="item in movieFilterArray" class="my-2 p-2 py-[9px] w-full border border-gray-400 rounded-md cursor-pointer"
                    :class="tempData === item.id
                    ? 'bg-gradient-to-r from-yellow-200 to-red-400 text-red-900'
                    : 'bg-gradient-to-r from-green-200 to-blue-400'" @click="filtersWithTime(item.url, item.id)">
                    {{item.name}}
                </div>
                <div class="my-2 p-2 py-[9px] w-full border border-gray-400 rounded-md cursor-pointer" :class="this.favMovie
                ? 'bg-gradient-to-r from-yellow-200 to-red-400 text-red-900'
                : 'bg-gradient-to-r from-green-200 to-blue-400'" @click="getFavMovie">
                    Favorite
                </div>
            </article>
            <article v-else>
                <div v-for="item in tvFilterArray" class="my-2 p-2 py-[9px] w-full border border-gray-400 rounded-md cursor-pointer"
                    :class="tempData === item.id
                    ? 'bg-gradient-to-r from-yellow-200 to-red-400 text-red-900'
                    : 'bg-gradient-to-r from-green-200 to-blue-400'" @click="filtersWithTime(item.url, item.id)">
                    {{item.name}}
                </div>
                <div class="my-2 p-2 py-[9px] w-full border border-gray-400 rounded-md cursor-pointer" :class="this.favTV
                ? 'bg-gradient-to-r from-yellow-200 to-red-400 text-red-900'
                : 'bg-gradient-to-r from-green-200 to-blue-400'" @click="getFavTV">
                    Favorite
                </div>
            </article>
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import { useRoute } from 'vue-router';
import { doc, getDoc } from "firebase/firestore";
import db from "../../firebaseConfig.js";

export default {
    name: "Filter",

    data() {
        const route = useRoute();
        return {
            route,
            tempData: '',
            list: [],
            genreList: [],
            movieFilterArray: [
                { id: 1, name: 'Now Playing', url: 'movie/now_playing' },
                { id: 2, name: 'Top Rated', url: 'movie/top_rated' },
                { id: 3, name: 'Upcoming', url: 'movie/upcoming' },
            ],
            tvFilterArray: [
                { id: 1, name: 'On TV Today', url: 'tv/on_the_air' },
                { id: 2, name: 'Top Rated', url: 'tv/top_rated' },
                { id: 3, name: 'Airing Today', url: 'tv/airing_today' },
            ],
            page: 1,
            newId: '',
            searchData: '',
            titleForSorting: "Asc / Desc",
            sorting: true,
            // activeBtn variable used for UI purpose
            activeBtn: '',
            favMovie: false,
            favTV: false,
        }
    },


    methods: {
        // filters With Time buttons
        filtersWithTime(name, id) {
            this.$store.dispatch('toggleTimeFilter', 'true');
            this.favMovie = false;

            if (this.tempData === id){
                this.tempData = '';
                this.getInitialList();
            } else {
                this.tempData = id;
                axios.get(`${import.meta.env.VITE_API_URL}/${name}?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`)
                    .then(response => {
                        this.list = response.data.results;
                        this.$store.dispatch('selectedMovieList', this.list);
                    })
                    .catch(error => console.log(error))
                    .finally(() => this.loading = false);
            }
        },
        // function for sorting data on btn click
        changeSorting() {
            if (this.sorting === false) {
                this.sorting = true;
                this.titleForSorting = "Ascending";
                this.getListInAsc();
            } else {
                this.sorting = false;
                this.titleForSorting = "Descending";
                this.getListInDesc();
            }
        },
        // get init data of Movie
        getInitialList() {
            if (this.route.path === '/movieList') {
                axios.get(`${import.meta.env.VITE_API_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`)
                    .then(response => {
                        this.list = response.data.results;
                        this.$store.dispatch('selectedMovieList', this.list);
                    })
                    .catch(error => console.log(error))
                    .finally(() => this.loading = false);
            } else {
                axios.get(`${import.meta.env.VITE_API_URL}/tv/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`)
                    .then(response => {
                        this.list = response.data.results;
                        this.$store.dispatch('selectedMovieList', this.list);
                    })
                    .catch(error => console.log(error))
                    .finally(() => this.loading = false);
            }
        },
        // get genre data
        getGenreList() {
            if (this.route.path === '/movieList') {
                axios.get(`${import.meta.env.VITE_API_URL}/genre/movie/list?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`)
                    .then(response => this.genreList = response.data.genres)
                    .catch(error => console.log(error))
                    .finally(() => this.loading = false);
            } else {
                axios.get(`${import.meta.env.VITE_API_URL}/genre/tv/list?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`)
                    .then(response => this.genreList = response.data.genres)
                    .catch(error => console.log(error))
                    .finally(() => this.loading = false);
            }
            
        },
        // get data of Movie in ASC
        getListInAsc() {
            if (this.route.path === '/movieList') {
                axios.get(`${import.meta.env.VITE_API_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`)
                    .then(response => {
                        this.list = response.data.results.sort();
                        this.$store.dispatch('selectedMovieList', this.list)
                    })
                    .catch(error => console.log(error))
                    .finally(() => this.loading = false);
            } else {
                axios.get(`${import.meta.env.VITE_API_URL}/tv/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`)
                    .then(response => {
                        this.list = response.data.results.sort();
                        this.$store.dispatch('selectedMovieList', this.list)
                    })
                    .catch(error => console.log(error))
                    .finally(() => this.loading = false);
            }
        },
        // get data of Movie in DESC
        getListInDesc() {
            if (this.route.path === '/movieList') {
                axios.get(`${import.meta.env.VITE_API_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`)
                    .then(response => {
                        this.list = response.data.results.sort().reverse();
                        this.$store.dispatch('selectedMovieList', this.list);
                    })
                    .catch(error => console.log(error))
                    .finally(() => this.loading = false);
            } else {
                axios.get(`${import.meta.env.VITE_API_URL}/tv/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`)
                    .then(response => {
                        this.list = response.data.results.sort().reverse();
                        this.$store.dispatch('selectedMovieList', this.list);
                    })
                    .catch(error => console.log(error))
                    .finally(() => this.loading = false);
            }
        },
        // function for filter data
        filterData(id) {
            this.$store.dispatch('selectedFilterId', id);
            this.activeBtn = id;
            let page = 1;
            if (this.route.path === '/movieList') {
                if (id) {
                    axios.get(`${import.meta.env.VITE_API_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${page}`)
                        .then(response => {
                            const responseData = response.data.results;
                            this.list = responseData.filter(finalData => finalData.genre_ids.includes(id))
                            this.$store.dispatch('selectedMovieList', this.list);
                        })
                        .catch(error => console.log(error))
                        .finally(() => this.loading = false);
                } else {
                    this.getInitialList();
                }
            } else {
                if (id) {
                    axios.get(`${import.meta.env.VITE_API_URL}/tv/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${page}`)
                        .then(response => {
                            const responseData = response.data.results;
                            this.list = responseData.filter(finalData => finalData.genre_ids.includes(id))
                            this.$store.dispatch('selectedMovieList', this.list);
                        })
                        .catch(error => console.log(error))
                        .finally(() => this.loading = false);
                } else {
                    this.getInitialList();
                }
            }
            
        },
        getNextList() {
            window.onscroll = () => {
                // alert("on scroll")
                let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
                // console.log(bottomOfWindow);
                if (bottomOfWindow && this.$store.state.filterId) {
                    this.page += 1;
                    axios.get(`${import.meta.env.VITE_API_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${this.page}`)
                        .then(response => {
                            if (this.$store.state.filterId) {
                                const responseData = response.data.results;
                                this.list = this.list.concat(responseData.filter(finalData => finalData.genre_ids.includes(this.$store.state.filterId)))
                                this.$store.dispatch('selectedMovieList', this.list);
                            } else {
                                this.list = this.list.concat(response.data.results);
                                this.$store.dispatch('selectedMovieList', this.list);
                            }
                        })
                        .catch(error => console.log(error))
                        .finally(() => this.loading = false);
                }
            }
        },
        // function for get favorite Movie list
        async getFavMovie() {
            this.tempData = '';
            this.favMovie = true;

            let uid = localStorage.getItem('uid');
            const docRef = doc(db.db, "favoriteMovieId", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let lengthOfFavMovie = docSnap.data().favMovieId.length;

                for (let index = 0; index < lengthOfFavMovie; index++) {
                    axios.get(`${import.meta.env.VITE_API_URL}/movie/${docSnap.data().favMovieId[index]}?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`)
                        .then(response => {
                            if (index === 0) {
                                this.list = [];
                                this.list.push(response.data);
                                this.$store.dispatch('selectedMovieList', this.list);
                            } else {
                                this.list.push(response.data);
                                this.$store.dispatch('selectedMovieList', this.list);
                            }
                        })
                        .catch(error => console.log(error))
                        .finally(() => this.loading = false);
                }
            } else {
                console.log("No such document!");
            }
        },
        // function for get favorite TV list
        async getFavTV() {
            this.tempData = '';
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
                                this.list.push(response.data);
                                this.$store.dispatch('selectedMovieList', this.list);
                            } else {
                                this.list.push(response.data);
                                this.$store.dispatch('selectedMovieList', this.list);
                            }
                        })
                        .catch(error => console.log(error))
                        .finally(() => this.loading = false);
                }
            } else {
                console.log("No such document!");
            }
        },
        // temp fun
        onFavMovieClick() {
            this.getFavMovie();
        },
        onFavTVClick() {
            this.getFavTV();
        },
    },

    beforeMount() {
        this.getGenreList();
    },

    mounted() {
        this.getNextList();
        // this.filtersWithTime;
    },
    
    updated() {
        // this.getFavMovie();
        // this.getFavTV();
        // this.onFavMovieClick();
        // this.onFavTVClick();
    }
    // async updated() {
        // let uid = localStorage.getItem('uid');
        // const docRef = doc(db.db, "favoriteMovieId", uid);
        // const docSnap = await getDoc(docRef);
        // this.dataFromFirebase = docSnap.data()?.favMovieId;
    // },
}
</script>

<style>

</style>
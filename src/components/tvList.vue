<template>
    <Navbar />
    <div class="pt-14 max-w-7xl m-auto text-2xl font-semibold">
        <input v-debounce:500ms="getSearchTVList" v-model="searchData" type="search" placeholder="Search for TV series"
            class="font-normal border-2 border-blue-500 rounded-lg w-full px-2 py-1 mt-2 outline-blue-700" />
    </div>
    <section class="flex justify-between gap-4 max-w-7xl m-auto">
        <article class="w-1/5">
            <Filter />            
        </article>
        <article class="flex flex-wrap gap-2 py-2 w-4/5">
            <div v-if="loading" class="m-auto">
                <img class="h-20 m-auto" src="../assets/loadingGif.gif" alt="loading.." />
            </div>
            <div v-if="list.length === 0" class="font-semibold text-2xl text-blue-600 w-full text-center">
                Sorry, TV series is not available, check again after some times.
            </div>
            <div v-else v-for="item in this.$store.state.listOfMovies" :key="item.id" class="relative">
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
    <ModalPage />
    <Login />
</template>

<script>
import axios from 'axios';
import Favorite from '../assets/heart.vue';
import Navbar from './global/header/navbar.vue';
import Footer from './global/footer/footer.vue';
import Search from '../assets/search.vue';
import ModalPage from "../components/global/modalPage.vue";
import Login from "../components/global/login.vue";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import db from "../firebaseConfig.js";
import Filter from "../components/global/filter.vue";

export default {
    name: "List",

    data() {
        return {
            prefix: '',
            list: [],
            dataFromFirebase: [],
            loading: true,
            page: 1,
            newId: '',
            searchData: '',
            activeBtn: '',
        }
    },

    methods: {
        clickMe(id) {
            // this.$router.push(`/TVDetails/${id}`);
            this.$store.dispatch('selectedMovieId', id);
        },
        // get init data of TV
        getInitialList() {
            axios.get(`${import.meta.env.VITE_API_URL}/tv/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`)
                .then(response => { 
                    this.list = response.data.results;
                    this.$store.dispatch('selectedMovieList', this.list);
                })
                .catch(error => console.log(error))
                .finally(() => this.loading = false);
        },
        // function for infinity scroll
        getNextList() {
            window.onscroll = () => {
                let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
                if (bottomOfWindow && this.searchData === '' && this.$store.state.filterId === "" && !this.$store.state.isFavFilter) {
                    this.page += 1;
                    axios.get(`${import.meta.env.VITE_API_URL}/tv/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${this.page}`)
                        .then(response => {
                            if (this.activeBtn) {
                                const responseData = response.data.results;
                                this.list = this.list.concat(responseData.filter(finalData => finalData.genre_ids.includes(this.activeBtn)))
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
        // function fot searching
        getSearchTVList() {
            if (this.searchData) {
                axios.get(`${import.meta.env.VITE_API_URL}/search/tv?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&query=${this.searchData}&page=1&include_adult=false`)
                    .then(response => {
                        this.list = response.data.results; 
                        this.$store.dispatch('selectedMovieList', this.list);
                    })
                    .catch(error => console.log(error))
                    .finally(() => this.loading = false);
            }
            else {
                this.getInitialList();
            }
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
                        this.getFavTV();
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
        },
        // function for get favorite TV list
        async getFavTV() {
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
    },

    beforeMount() {
        this.getInitialList();
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
        Search,
        ModalPage,
        Login, 
        Filter
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
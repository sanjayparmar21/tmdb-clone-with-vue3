<template>
    <Navbar />
    <section class="">
        <div class="pt-14 max-w-7xl m-auto text-2xl font-semibold">
            <input v-debounce:500ms="getSearchMovieList" v-model="searchData" type="search"
                placeholder="Search for Movie"
                class="font-normal border-2 border-blue-500 rounded-lg w-full px-2 py-1 mt-2 outline-blue-700" />
        </div>
        <section class="flex justify-between gap-4 max-w-7xl m-auto">
            <article class="w-1/5">
                <Filter />
            </article>
            <article class="flex flex-wrap gap-2 py-2 w-4/5 overflow-hidden">
                <div v-if="loading" class="m-auto">
                    <img class="h-20 m-auto" src="../assets/loadingGif.gif" alt="loading.." />
                </div>
                <!-- {{ this.$store.state.listOfMovies }} -->
                <div v-if="list.length === 0" class="font-semibold text-2xl text-blue-600 w-full text-center">
                    Sorry, Movie series is not available, check again after some times.
                </div>
                <!-- <div v-else v-for="item in list" :key="item.id" class="relative"> -->
                <div v-else v-for="item in this.$store.state.listOfMovies" :key="item.id" class="relative">
                    <div v-if="item.poster_path" class="w-60">
                        <img :src="prefix + item.poster_path" alt="banner"
                            class="cursor-pointer shadow-2xl rounded-xl skeleton" @click=clickMe(item.id) />
                    </div>
                    <div v-else>
                        <div class="w-60 sm:h-[355px] bg-gradient-to-r from-[#a4a6a5] to-[#e0e0e0] shadow-2xl rounded-xl">
                        </div>
                    </div>
                    <p class="absolute top-3 right-2 p-1 w-fit rounded-full text-sm font-bold cursor-pointer"
                        :class="this.dataFromFirebase?.includes(item.id) ? 'text-red-500' : 'text-white'"
                        @click="addToFav(item.id)">
                        <Favorite />
                    </p>
                    <h3 class="text-lg font-semibold w-60 truncate cursor-default">{{ item.title ? item.title : item.name }}
                    </h3>
                </div>
            </article>
        </section>
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
        }
    },

    methods: {
        clickMe(id) {
            // pass id in store
            this.$store.dispatch('selectedMovieId', id);
            // pass id as a props for details modal
            // this.newId = id;
            // pass id in a route and change route for details page
            // this.$router.push(`/movieDetails/${id}`);
        },
        // get init data of Movie
        getInitialList() {
            axios.get(`${import.meta.env.VITE_API_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`)
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
                if (bottomOfWindow && this.searchData === '' && this.$store.state.filterId === "" && this.$store.state.isTimeFilter === "") {
                    // alert("1");
                    this.page += 1;
                    axios.get(`${import.meta.env.VITE_API_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${this.page}`)
                        .then(response => {
                            this.list = this.list.concat(response.data.results);
                            this.$store.dispatch('selectedMovieList', this.list);
                        })
                        .catch(error => console.log(error))
                        .finally(() => this.loading = false);
                }
                // alert(this.list.length)
                // if (this.list.length < 20 && this.$store.state.filterId !== "") {
                //     // alert(this.$store.state.filterId);
                //     this.page += 1;
                //     axios.get(`${import.meta.env.VITE_API_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${this.page}`)
                //         .then(response => {
                //             // if (this.page === 2) {
                //             //     this.list = [];
                //             // }
                //             const responseData = response.data.results;
                //             this.list = this.list.concat(responseData.filter(finalData => finalData.genre_ids.includes(this.$store.state.filterId)))
                //             this.$store.dispatch('selectedMovieList', this.list);
                //         })
                //         .catch(error => console.log(error))
                //         .finally(() => this.loading = false);
                // }
                // if (bottomOfWindow && this.$store.state.filterId){
                //     // alert(this.$store.state.filterId);
                //     this.page += 1;
                //     axios.get(`${import.meta.env.VITE_API_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${this.page}`)
                //         .then(response => {
                //             // if (this.page === 2) {
                //             //     this.list = [];
                //             // }
                //             const responseData = response.data.results;
                //             this.list = this.list.concat(responseData.filter(finalData => finalData.genre_ids.includes(this.$store.state.filterId)))
                //             this.$store.dispatch('selectedMovieList', this.list);
                //         })
                //         .catch(error => console.log(error))
                //         .finally(() => this.loading = false);
                // }

                // else if ((bottomOfWindow || this.list.length < 20) && this.searchData === '' && this.$store.state.filterId !== "") {
                //     // alert("2");
                //     this.page += 1;
                //     axios.get(`${import.meta.env.VITE_API_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${this.page}`)
                //         .then(response => {
                //             if (this.activeBtn) {
                //                 const responseData = response.data.results;
                //                 this.list = this.list.concat(responseData.filter(finalData => finalData.genre_ids.includes(this.activeBtn)))
                //                 this.$store.dispatch('selectedMovieList', this.list);
                //             } else {
                //                 this.list = this.list.concat(response.data.results);
                //                 this.$store.dispatch('selectedMovieList', this.list);
                //             }
                //         })
                //         .catch(error => console.log(error))
                //         .finally(() => this.loading = false);
                // }

                // else if(bottomOfWindow && this.$store.state.filterId !== "") {
                //     // alert("3");
                //     this.page += 1;
                //     axios.get(`${import.meta.env.VITE_API_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${this.page}`)
                //         .then(response => {
                //             if (this.$store.state.filterId) {
                //                 const responseData = response.data.results;
                //                 if(this.page === 2){
                //                     this.list = [];
                //                 }
                //                 this.list = this.list.concat(responseData.filter(finalData => finalData.genre_ids.includes(this.$store.state.filterId)))
                //                 this.$store.dispatch('selectedMovieList', this.list);
                //             } else {
                //                 this.list = this.list.concat(response.data.results);
                //                 this.$store.dispatch('selectedMovieList', this.list);
                //             }
                //         })
                //         .catch(error => console.log(error))
                //         .finally(() => this.loading = false);
                // }

                // else if (bottomOfWindow){
                //     // alert("else");
                //     this.page += 1;
                //     axios.get(`${import.meta.env.VITE_API_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${this.page}`)
                //         .then(response => {
                //             if (this.activeBtn) {
                //                 const responseData = response.data.results;
                //                 this.list = this.list.concat(responseData.filter(finalData => finalData.genre_ids.includes(this.activeBtn)))
                //                 this.$store.dispatch('selectedMovieList', this.list);
                //             } else {
                //                 this.list = this.list.concat(response.data.results);
                //                 this.$store.dispatch('selectedMovieList', this.list);
                //             }
                //         })
                //         .catch(error => console.log(error))
                //         .finally(() => this.loading = false);
                // }
                
            }
        },
        // function fot searching
        getSearchMovieList() {
            if (this.searchData) {
                axios.get(`${import.meta.env.VITE_API_URL}/search/movie?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&query=${this.searchData}&page=1&include_adult=false`)
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

                const docRef = doc(db.db, "favoriteMovieId", uid);
                const docSnap = await getDoc(docRef);

                let lengthOfFavMovie = docSnap.data()?.favMovieId?.length;

                if (lengthOfFavMovie === 0 || lengthOfFavMovie === undefined) {
                    await setDoc(doc(db.db, "favoriteMovieId", uid), {
                        favMovieId: arrayUnion(this.newId)
                    });
                } else {
                    if (docSnap.data().favMovieId.includes(this.newId)) {
                        await updateDoc(doc(db.db, "favoriteMovieId", uid), {
                            favMovieId: arrayRemove(this.newId)
                        });
                    }
                    else {
                        await updateDoc(doc(db.db, "favoriteMovieId", uid), {
                            favMovieId: arrayUnion(this.newId)
                        });
                    }
                }
            } else {
                this.$store.dispatch('toggleLoginModal');
            }
        },
        // old and working
        // async addToFav(id) {
        //     if (localStorage.getItem('uid')) {
        //         let uid = localStorage.getItem('uid');
        //         this.newId = id;

        //         const docRef = doc(db.db, "favoriteMovieId", uid);
        //         const docSnap = await getDoc(docRef);

        //         let lengthOfFavMovie = docSnap.data()?.favMovieId?.length;

        //         if (lengthOfFavMovie === 0 || lengthOfFavMovie === undefined) {
        //             await setDoc(doc(db.db, "favoriteMovieId", uid), {
        //                 favMovieId: arrayUnion(this.newId)
        //             });
        //         } else {
        //             if (docSnap.data().favMovieId.includes(this.newId)) {
        //                 await updateDoc(doc(db.db, "favoriteMovieId", uid), {
        //                     favMovieId: arrayRemove(this.newId)
        //                 });
        //             }
        //             else {
        //                 await updateDoc(doc(db.db, "favoriteMovieId", uid), {
        //                     favMovieId: arrayUnion(this.newId)
        //                 });
        //             }
        //         }
        //     } else {
        //         this.$store.dispatch('toggleLoginModal');
        //     }
        // },
        // function for get favorite Movie list
        async getFavMovie() {
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
                                this.list.push(response.data)
                                this.$store.dispatch('selectedMovieList', this.list);
                            } else {
                                this.list.push(response.data)
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
        const docRef = doc(db.db, "favoriteMovieId", uid);
        const docSnap = await getDoc(docRef);
        this.dataFromFirebase = docSnap.data()?.favMovieId;
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
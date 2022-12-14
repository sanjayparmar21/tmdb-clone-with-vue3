<template>
    <Navbar />
    <div class="pt-14 max-w-7xl m-auto text-2xl font-semibold">
        <h3>List of movies: </h3>
        <input v-debounce:500ms="getSearchMovieList" v-model="searchData" type="search" placeholder="Search for movie" class="font-normal border-2 border-blue-500 rounded-lg w-full px-2 py-1 outline-blue-700" />
        <div 
            class="my-2 p-2 py-[9px] w-full border border-gray-400 rounded-md cursor-pointer text-center" 
            :class="this.favMovie
            ? 'bg-gradient-to-r from-yellow-200 to-red-400 text-red-900' 
            : 'bg-gradient-to-r from-green-200 to-blue-400'" 
            @click="getFavMovie">
            Favorite Movie
        </div>
    </div>
    <div class="max-w-7xl m-auto flex flex-wrap gap-5 py-2">
        <div v-if="loading" class="max-w-7xl m-auto">
            <img class="h-20 m-auto" src="../assets/loadingGif.gif" alt="loading.." />
        </div>

        <div v-if="list.length === 0" class="font-semibold text-2xl text-blue-400 w-full text-center">
            Sorry, "{{searchData}}" movie is not available, check again after some times.
        </div>

        <div v-else v-for="item in list" :key="item.id" class="relative">
            <div v-if="item.poster_path" class="w-60">
                <!--  transition ease-in-out delay-150 hover:translate-y-1 hover:translate-x-1 hover:scale-110 duration-200 -->
                <img :src="prefix + item.poster_path" alt="banner"
                    class="cursor-pointer bg-gradient-to-r skeleton rounded-xl"
                    @click=clickMe(item.id) />
            </div>
            <div v-else>
                <div class="h-64 sm:h-[355px] bg-gradient-to-r from-[#afe6d1] via-[#b3c9ed] to-[#cea9f1] border-4 border-blue-400 rounded-xl"></div>
            </div>
            <p 
                class="absolute top-2 right-2 p-1 w-fit rounded-full text-sm font-bold cursor-pointer" 
                :class="this.dataFromFirebase?.includes(item.id) ? 'text-red-500' : 'text-white'"
                @click="addToFav(item.id)">
                <Favorite />
            </p>
            <h3 class="text-lg font-semibold w-60 truncate cursor-default">{{ item.title ? item.title : item.name }}
            </h3>
        </div>
    </div>
    <Footer />
    <ModalPage />
    <Login />
</template>

<script>
import axios from 'axios';
import Favorite from "../assets/heart.vue";
import Navbar from './global/header/navbar.vue';
import Footer from './global/footer/footer.vue';
import Search from '../assets/search.vue';
import ModalPage from "../components/global/modalPage.vue";
import Login from "../components/global/login.vue";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import db from "../firebaseConfig.js";

export default {
    name: "List",
    data() {
        return {
            prefix: "",
            list: [],
            dataFromFirebase: [],
            loading: true,
            page: 1,
            searchData: "",
            newId: '',
            favMovie: false,
        }
    },
    methods: {
        // function for get id of item
        clickMe(id) {
            this.$store.dispatch('selectedMovieId', id);
            // pass id as a props for details modal
            // this.newId = id;
            // pass id in a route and change route for details page
            // this.$router.push(`/movieDetails/${id}`);
        },
        // function for get initial list
        getInitialList() {
            axios.get(`${import.meta.env.VITE_API_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`)
                .then(response => this.list = response.data.results)
                .catch(error => console.log(error))
                .finally(() => this.loading = false);
        },
        // function for get next list (for infinity scroll)
        getNextList() {
           window.onscroll = () => {
               let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
            
               //    if (bottomOfWindow && this.searchData === '' && !this.favMovie) {
               if (bottomOfWindow && this.searchData === '' && !this.favMovie) {
                     this.page +=  1;
                     axios.get(`${import.meta.env.VITE_API_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=${this.page}`)
                     .then(response => {
                         this.list = this.list.concat(response.data.results);
                     })
                     .catch(error => console.log(error))
                     .finally(() => this.loading = false);
                 }
            }
        },
        // function for get value based on search data
        getSearchMovieList() {
            if(this.searchData) {
            axios.get(`${import.meta.env.VITE_API_URL}/search/movie?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&query=${this.searchData}&page=1&include_adult=false`)
                .then(response => this.list = response.data.results)
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
            if (this.favMovie) {
                this.getFavMovie();
            }
        },
        //  function for get favorite movie list
        async getFavMovie() {
            // favMovie is use for update UI
            this.favMovie = true;

            let uid = localStorage.getItem('uid');
            const docRef = doc(db.db, "favoriteMovieId", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let lengthOfFavMovie = docSnap.data().favMovieId.length;

                for (let index = 0; index < lengthOfFavMovie; index++) {
                    axios.get(`${import.meta.env.VITE_API_URL}/movie/${docSnap.data().favMovieId[index]}?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`)
                        .then(response => {
                            if(index === 0){
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
    },
    
    async mounted() {
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
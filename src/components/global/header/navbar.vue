<template>
    <div class="fixed right-0 left-0 z-10 bg-slate-800">
        <div class="m-auto max-w-7xl flex justify-between items-center text-white py-2">
            <div class="flex items-center">
                <a href="/">
                    <img class="h-10" src="../../../assets/logo.png" />
                </a>
                <RouterLink 
                    class="px-4 py-1 cursor-pointer text-xl" 
                    :class="$route.path === '/movieList' ? 'font-bold bg-gradient-to-r from-green-300 to-blue-500 text-transparent bg-clip-text' : ''" 
                    to="/movieList"
                >
                    Movies
                </RouterLink>
                <RouterLink 
                    class="px-4 py-1 cursor-pointer text-xl" 
                    :class="$route.path === '/tvList' ? 'font-bold bg-gradient-to-r from-green-200 to-blue-400 text-transparent bg-clip-text' : ''" 
                    to="/tvList"
                >
                    TV Series
                </RouterLink>
                <!-- <Dropdown class="inline" name="Movie" options="Popular,Now Playing,Upcoming,Top Rated" /> -->
                <!-- <Dropdown class="inline" name="TV Shows" options="Popular,Airing Today,On TV,Top Rated" /> -->
                <!-- <Dropdown class="inline" name="People" options="Popular People" /> -->
                <!-- <Dropdown class="inline" name="More" options="Discussion,Leader board,Support,API" /> -->
            </div>
            <div class="flex items-center gap-2 sm:gap-6">
                <!-- <Plus /> -->
                <button class="border border-white px-1 hover:text-slate-800 hover:bg-white">En</button>
                <Bell />
                <button v-if="this.$store.state.user.loggedIn" @click="logout">
                    <Logout />
                </button>
                <!-- <button class="py-1 px-3 rounded-full bg-orange-400 text-white">H</button> -->
            </div>
        </div>
    </div>
    <RouterView />
</template>

<script>

import firebaseConfig from "../../../firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
firebaseConfig
const auth = getAuth();

import Plus from "../../../assets/plus.vue";
import Bell from "../../../assets/bell.vue";
import Logout from "../../../assets/logout.vue";
import Dropdown from '../../global/dropdown.vue';
import { RouterLink, RouterView } from 'vue-router';

export default {
    data() {
        return {
           name: "Navbar",
        };
    },

    methods: {
        logout() {
            signOut(auth).then(() => {
                this.$store.dispatch('setLoggedOut');
                localStorage.removeItem("uid");
                console.log("logged out successfully");
            }).catch((error) => {
                console.log(error);
            });
        }
    },

    mounted() {
        let uid = localStorage.getItem("uid");
        if (uid) {
            this.$store.dispatch('setLoggedIn');
        }
    },

    components: { Plus, Bell, Logout, Dropdown }
};
</script>

<style>

</style>
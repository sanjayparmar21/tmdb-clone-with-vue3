<template>
    <div class="fixed right-0 left-0 z-10 bg-slate-800">
        <div class="m-auto max-w-7xl flex justify-between items-center text-white py-2">
            <div class="flex items-center">
                <RouterLink to="/"> <Logo /> </RouterLink>
                <RouterLink class="font-bold px-4 py-2 text- cursor-pointer" to="/movieList">Movie List</RouterLink>
                <RouterLink class="font-bold px-4 py-2 text- cursor-pointer" to="/tvList">TV List</RouterLink>
                <!-- <Dropdown class="inline" name="Movie" options="Popular,Now Playing,Upcoming,Top Rated" /> -->
                <!-- <Dropdown class="inline" name="TV Shows" options="Popular,Airing Today,On TV,Top Rated" /> -->
                <!-- <Dropdown class="inline" name="People" options="Popular People" /> -->
                <!-- <Dropdown class="inline" name="More" options="Discussion,Leader board,Support,API" /> -->
            </div>
            <div class="flex items-center gap-2 sm:gap-6">
                <!-- <Plus /> -->
                <button class="border border-white px-1 hover:text-slate-800 hover:bg-white">En</button>
                <Bell />
                <!-- <button class="py-1 px-3 rounded-full bg-orange-400 text-white">H</button> -->
            </div>
        </div>
    </div><RouterView />
</template>

<script>
import Logo from "../../../assets/logo.vue";
import Plus from "../../../assets/plus.vue";
import Bell from "../../../assets/bell.vue";
import Dropdown from '../../global/dropdown.vue';
import { RouterLink, RouterView } from 'vue-router'

export default {
    data() {
        return {
           
        };
    },
    components: { Logo, Plus, Bell, Dropdown }
};
</script>

<style>

</style>
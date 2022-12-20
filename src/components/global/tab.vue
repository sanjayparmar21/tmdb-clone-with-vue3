<template>
    <div class="max-w-7xl m-auto flex flex-wrap py-5">
            <h3 class="text-2xl font-semibold mr-6">What's Popular: </h3>
            <ul class="flex w-fit border py-[1px] border-blue-700 rounded-[18px] cursor-pointer">
                <li>
                    <a v-for="item in typesOfTabs" class="font-semibold capitalize py-[2px] pb-[7px] px-4 rounded-2xl"
                        v-on:click="getDataByType(item.url, item.id)"
                        :class="openTab === item.id  ? 'text-green-400 bg-blue-900' : 'text-blue-900 bg-white'"
                    >
                        {{item.name}}
                    </a>
                </li>
            </ul>
            <div class="relative w-full shadow-lg rounded">
                <div class="px-4 py-5 flex-auto">
                    <div class="tab-content tab-space">
                        <Card :list="list" />
                    </div>
                </div>
            </div>
    </div>
</template>

<script>
import axios from 'axios';
import Card from './card.vue';

export default {
    name: "Tabs",
    data() {
        return {
            openTab: "",
            list: [],
            typesOfTabs: [
                { id: 1, name: "Now Playing", url: "movie/now_playing" },
                { id: 2, name: "Top Rated", url: "movie/top_rated" },
                { id: 3, name: "Upcoming", url: "movie/upcoming" },
            ],
        };
    },
    methods: {
        toggleTabs: function (tabNumber) {
            this.openTab = tabNumber;
        },
        getDataByType(name, id) {
            
            if (!this.openTab) {
                id = 1;
                name = "movie/now_playing";
            }
            this.openTab = id;

            axios.get(`${import.meta.env.VITE_API_URL}/${name}?api_key=${import.meta.env.VITE_API_KEY}&language=en-US&page=1`)
                .then(response => this.list = response.data.results)
                .catch(error => console.log(error))
                .finally(() => this.loading = false);
        },
    },

    beforeMount() {
        this.getDataByType();
    },

    components: { Card }
}
</script>

<style>

</style>
<template>
    <div class="flex justify-center items-center">
        <div class="mx-2">
            <div>
                <div class="relative">
                    <!-- Dropdown toggle button -->
                    <button v-on:mouseover="show=true" v-on:mouseleave="show=false" class="flex items-center p-2">
                        <span class="font-bold">{{name}}</span>
                    </button>
                    <!-- Dropdown menu -->
                    <div v-on:mouseover="show=true" v-on:mouseleave="show=false" v-show="show" class="z-10 absolute bg-white text-black rounded-md shadow-xl w-40">
                        <router-link v-for="option in options.split(',')" :key=option to={{option}} class="block px-4 py-2 text-sm hover:bg-indigo-100 hover:rounded-md">
                            {{option}}
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Dropdown",
    props: {
        name: {type: String, required: true},
        options: {type: String, required: true}
    },
    data() {
        return {
            show: false,
        };
    },
};
</script>

<style>

</style>
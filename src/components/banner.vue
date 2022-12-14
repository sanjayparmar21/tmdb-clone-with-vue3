<template>
    <div class="max-h-96 max-w-7xl m-auto">
        <img :src="prefix + list.backdrop_path" alt="banner" class="h-96 w-full dummy-img rounded-b-lg" />
        <div class="absolute top-44 pl-12 text-orange-500 font-semibold">
            <h1 class="text-3xl sm:text-5xl">{{list.title}}</h1>
            <h3 class="text-xl sm:text-3xl">Millions of movies, TV shows and people to discover. Explore now.</h3>
            <!-- <input type="text" placeholder="Search for a movie, tv show, person......" class="mt-10 pl-5 w-10/12 h-12 rounded-l-3xl outline-none text-black" />
            <button class="pt-[1px] px-0 sm:px-6 bg-gradient-to-r from-green-300 to-blue-300 h-12 rounded-r-3xl outline-none text-white hover:text-black">
                search
            </button> -->
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        data() {
            return{
                list: [],
                prefix: "",
                rNumber: 0,
                title: 'Banner',
            }
        },
    async mounted() {
        this.rNumber = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
        await axios.get(`${import.meta.env.VITE_API_URL}/movie/popular?api_key=${import.meta.env.VITE_API_KEY}&language=en-US`)
            .then(response => this.list = response.data.results[this.rNumber])
            .catch(error => console.log(error))

        this.prefix = `${import.meta.env.VITE_API_IMAGE_PREFIX}`;
    },
    }

</script>

<style>
.dummy-img {
    display: inline-block;
    font-family: Arial, sans-serif;
    font-weight: 300;
    line-height: 2;
    text-align: center;
    min-width: 300px;
    min-height: 50px;
    position: relative;
}

.dummy-img::before {
    content: '';
    width: 100%;
    height: calc(100%);
    background-color: #ccc;
    position: absolute;
    top: 50%;
    left: -2px;
    transform: translateY(-50%);
}

.dummy-img::after {
    content: "\2639" " " attr(alt);
    font-size: 18px;
    color: rgb(100, 100, 100);
    display: block;
    position: absolute;
    top: 5px;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
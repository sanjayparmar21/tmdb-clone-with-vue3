<template>
    <div class="flex flex-nowrap gap-4 py-2 overflow-auto maskImage">
        <div class="temp" v-for="item in list" :key="item.id">
            <div class="h-60 w-96">
                <img 
                    :src="(prefix + item.backdrop_path)" 
                    alt="banner" 
                    class="cursor-pointer rounded-xl object-fill h-60 w-96 skeleton
                           transition ease-in-out hover:translate-y-6 duration-300 hover:scale-125 hover:relative hover:z-20"
                    @click=clickMe(item.id) 
                />
            </div>
            <p
                class="-mt-4 ml-4 relative px-1 w-fit rounded-full font-semibold bg-gradient-to-r from-green-200 to-blue-200 border-2 border-green-700">
                {{ (item.vote_average * 10).toFixed() }}
            </p>
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold truncate w-2/3 cursor-default capitalize ">{{ item.title ? item.title : item.name }}</h3>
                <h3 class="text-lg font-semibold truncate w-1/3 cursor-default capitalize">Type: {{ item.media_type }}</h3>
            </div>
            <h3 class="text-lg font-semibold truncate w-2/3 cursor-default capitalize ">Date of Release: {{ item.release_date ? item.release_date : item.first_air_date }}</h3>
           
        </div>
    </div>
</template>

<script>
export default {
    name: "TrendingCard",

    props: {
        list: { type: Array },
    },
    data() {
        return {
            prefix: "",
        }
    },
    methods: {
        // clickMe(id) {
        //     this.$router.push(`/${id}`);
        // },
    },
    mounted() {
        this.prefix = `${import.meta.env.VITE_API_IMAGE_PREFIX}`
    }
};
</script>

<style>
.maskImage {
    -webkit-mask-image: linear-gradient(to right, rgb(46, 46, 49) 95%, transparent 100%);
}
.skeleton {
    width: 384px;
    animation: skeleton-loading 1s linear infinite alternate;
}

@keyframes skeleton-loading {
    0% {
        background-color: hsl(200, 20%, 70%);
    }

    100% {
        background-color: hsl(200, 20%, 95%);
    }
}
</style>
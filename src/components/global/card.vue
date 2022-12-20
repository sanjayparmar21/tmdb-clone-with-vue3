<template>
    <div class="flex flex-nowrap gap-4 py-2 overflow-auto maskImage scroll-smooth">
        <div class="temp" v-for="item in list" :key="item.id">
            <div class="w-40">                
                <img :src="prefix + item.poster_path" alt="banner" class="cursor-pointer rounded-xl skeleton" />
            </div>
            <h3 class="text-lg font-semibold w-40 truncate cursor-default">{{ item.title ? item.title : item.name }}</h3>
        </div>
    </div>
</template>

<script>
export default {
    name: "Card",

    data() {
        return {
            prefix: "",
        }
    },

    props: {
        list: { type: Array },
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
        width: 160px;
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
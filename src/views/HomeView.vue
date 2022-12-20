<template>
    <Navbar />
    <article class="pt-14">
        <Banner />
        <Tab />
        <PopularMovie />
        <PopularTV />
        <Trending />
        <Footer />
    </article>
</template>

<script>
    import Navbar from "../components/global/header/navbar.vue";
    import Banner from "../components/banner.vue";
    import Tab from "../components/global/tab.vue"
    import PopularMovie from "../components/popularMovie.vue";
    import PopularTV from "../components/popularTV.vue";
    import Trending from "../components/inTrending.vue";
    import Footer from "../components/global/footer/footer.vue";

    export default {
        data() {
            return{
                show: true,
                name: 'Home',
            }
        },
        components: {
            Navbar,
            Banner,
            Tab,
            PopularMovie,
            PopularTV,
            Trending,
            Footer,
        }
    }
</script>

<style>

</style>
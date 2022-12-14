<template>
    <div class="bg-slate-800">
        <div class="m-auto max-w-4xl py-16 flex justify-between items-center text-white">
            <div class="flex flex-col gap-10 items-end">
                <a href="/">
                    <FooterLogo /> 
                </a>
                <h2 class="p-2 rounded-md bg-white text-blue-400 text-xl font-bold">Hi hey@mailinator.com!</h2>
            </div>     
            <div class="flex flex-col md:flex-row gap-10">
                <ul>
                    <h5 class="text-lg font-bold">THE BASICS</h5>
                    <li>About TMDB</li>
                    <li>Contact Us</li>
                    <li>Support Forums</li>
                    <li>API</li>
                    <li>System Status</li>
                </ul>
                <ul>
                    <h5 class="text-lg font-bold">GET INVOLVED</h5>
                    <li>Contribution Bible</li>
                    <li>Add New Movie</li>
                    <li>Add New TV Show</li>
                </ul>
                <ul>
                    <h5 class="text-lg font-bold">COMMUNITY</h5>
                    <li>Guidelines</li>
                    <li>Discussions</li>
                    <li>Leader board</li>
                    <li>Twitter</li>
                </ul>
                <ul>
                    <h5 class="text-lg font-bold">LEGAL</h5>
                    <li>Terms of Use</li>
                    <li>API Terms of Use</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import FooterLogo from "../../../assets/footerLogo.vue";

export default {
    data() {
        return {
            show: false,
        };
    },
    components: { FooterLogo }
};
</script>

<style>

</style>
<template>
    <section v-if="$store.state.loginModal" class="z-10 bg-black bg-opacity-50 w-full fixed inset-0" @click="close">
        <section class="text-white bg-slate-200 p-20 max-w-xl fixed right-0 top-14 bottom-0 rounded-tl-xl rounded-bl-xl">
                <section class="flex flex-col items-center">
                    <img class="rounded-lg"
                        src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?w=2000" alt="login" />
                    <button
                        class="bg-blue-600 font-semibold text-xl text-white rounded-md h-16 w-52 mt-10" @click="loginWithGoogle"
                    >
                        Login With Google 
                    </button>
                    <!-- <button 
                        v-if="$store.state.user.loggedIn"
                        class="bg-blue-600 font-semibold text-xl text-white rounded-md h-16 w-52 mt-10" @click="logout"
                    > 
                        Logout
                    </button> -->
                </section>
        </section>
    </section>
</template>

<script>
import firebaseConfig from "../../firebaseConfig";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
firebaseConfig
const provider = new GoogleAuthProvider();
const auth = getAuth();

export default{
    name: "Login",
    data() {
        return{
            user: '',
        }
    },
    methods: {
        loginWithGoogle() {
            signInWithPopup(auth, provider)
                .then((result) => {
                    const user = result.user.displayName; // result.user.displayName return name which is used as display name
                    localStorage.setItem("uid", result.user.uid);
                    this.$store.dispatch('setLoggedIn');
                    this.$store.dispatch('toggleLoginModal');
                }).catch((error) => {
                    console.log(error);
                });
        },
        logout() {
            signOut(auth).then(() => {
                this.$store.dispatch('setLoggedOut');
                localStorage.removeItem("uid");
            }).catch((error) => {
                console.log(error);
            });
        }
    }
}
</script>

<style>

</style>
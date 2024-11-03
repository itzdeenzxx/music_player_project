import { createRouter,createWebHistory } from "vue-router"
import TheHome from "../components/TheHome.vue"
import TheLogin from "../components/TheLogin.vue"
import TheRegister from "../components/TheRegister.vue"
import PageMember from "../components/PageMember.vue"
import PageMusic from "../components/PageMusic.vue"
import CartShow from "@/components/CartShow.vue"
import FavoriteSongs from "../components/FavoriteSongs.vue"
// import Welcome from "@/components/WelcomeComponent.vue"
const routes = [
    {
        path:'/pagemember',
        name:'PageMember',
        component:PageMember
    },
    {path:'/',
        name:'Home',
        component:TheHome
    },
    {
        path:'/login',
        name:'Login',
        component:TheLogin
    },
    // {
    //     path:'/welcome',
    //     name:'Welcome',
    //     component:Welcome
    // },
    {
        path:'/register',
        name:'Register',
        component:TheRegister
    },
    // {
    //     path:'/pagemusic/:ms_name',
    //     name:'PageMusic',
    //     component:PageMusic
    // },
    {
        path: '/CartShow/:cartId', 
        name: 'CartShow',
        component:CartShow
    },
    {
        path:'/FavoriteSongs/',
        name:'FavoriteSongs',
        component:FavoriteSongs
    },
    {
        path: '/pagemusic',
        name: 'PageMusic',
        component: PageMusic
      },
      {
        path: '/pagemusic/:query',
        name: 'SearchMusic',
        component: PageMusic
      }

]
const router = createRouter({
    history:createWebHistory(process.env.BASE_URL),routes
})
export default router
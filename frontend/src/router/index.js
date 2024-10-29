import { createRouter,createWebHistory } from "vue-router"
import TheHome from "../components/TheHome.vue"
import TheLogin from "../components/TheLogin.vue"
import TheRegister from "../components/TheRegister.vue"
import PageMember from "../components/PageMember.vue"
import ProductShow from "../components/ProductShow.vue"
import CartShow from "@/components/CartShow.vue"
import CartList from "../components/CartList.vue"
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
    {
        path:'/register',
        name:'Register',
        component:TheRegister
    },
    {
        path:'/ProductShow/:pd_id',
        name:'ProductShow',
        component:ProductShow
    },
    {
        path: '/CartShow/:cartId', 
        name: 'CartShow',
        component:CartShow
    },
    {
        path:'/CartList/',
        name:'CartList',
        component:CartList
    },

]
const router = createRouter({
    history:createWebHistory(process.env.BASE_URL),routes
})
export default router
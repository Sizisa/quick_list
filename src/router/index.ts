import { createRouter, createWebHistory } from 'vue-router'
import ListManage from '@/views/ListManage.vue'
import ListView from '@/views/ListView.vue'

const routes = [
    { path: '/', component: ListManage },
    { path: '/manage', component: ListManage },
    { path: '/list/:index', component: ListView },
]


const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHistory(),
    routes, // `routes: routes` 的缩写
})

export default router
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/administrator',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/administrator.vue'),
                    meta: { title: '管理员列表' }
                },
                {
                    path: '/administratorRole',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/administratorRole.vue'),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/menuList',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/menuList.vue'),
                    meta: { title: '菜单管理' }
                },
                {
                    path: '/commerceList',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/commerceList.vue'),
                    meta: { title: '商会列表' }
                },
                {
                    path: '/commerceMenu',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/commerceMenu.vue'),
                    meta: { title: '商会菜单' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});

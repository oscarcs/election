import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Polling from '../views/Polling.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/polling',
        name: 'Polling',
        component: Polling
    }
];

const router = new VueRouter({
    routes
});

export default router;

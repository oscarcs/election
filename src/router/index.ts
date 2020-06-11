import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Polling from '../views/Polling.vue';
import Lists from '../views/Lists.vue';
import CoalitionBuilder from '../views/CoalitionBuilder.vue';
import Electorates from '../views/Electorates.vue';

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
    },
    {
        path: '/lists',
        name: 'Lists',
        component: Lists
    },
    {
        path: '/coalitions',
        name: 'CoalitionBuilder',
        component: CoalitionBuilder
    },
    {
        path: '/electorates',
        name: 'Electorates',
        component: Electorates
    }
];

const router = new VueRouter({
    routes
});

export default router;

<template>
    <div 
        id="app"
        :class="[{ 'collapsed' : collapsed }, { 'onmobile' : isOnMobile }]"
    >
        <b-navbar type="is-darker">
            <template slot="brand">
                <b-navbar-item>New Zealand Election 2020</b-navbar-item>
            </template>
        </b-navbar>
        
        <section class="section">
            <router-view />
        </section>

        <sidebar-menu
            :menu="menu"
            :collapsed="collapsed"
            @toggle-collapse="onToggleCollapse"
            :disableHover="false"
        >
            <template slot="toggle-icon">
                <ion-icon
                    :name="collapsed ? 'chevron-forward-outline' : 'chevron-back-outline'"
                ></ion-icon>
            </template>
        </sidebar-menu>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

const App = Vue.extend({
    data() {
        return {
            collapsed: true,
            isOnMobile: false,
            menu: [
                {
                    href: '/',
                    title: 'Dashboard',
                    icon: {
                        element: 'ion-icon',
                        attributes: {
                            name: 'home'
                        }
                    }
                },
                {
                    href: '/polling',
                    title: 'Polling',
                    icon: {
                        element: 'ion-icon',
                        attributes: {
                            name: 'stats-chart'
                        }
                    }
                },
                {
                    href: '/lists',
                    title: 'Party Lists',
                    icon: {
                        element: 'ion-icon',
                        attributes: {
                            name: 'list'
                        }
                    }
                },
                {
                    href: '/coalitions',
                    title: 'Coalition Builder',
                    icon: {
                        element: 'ion-icon',
                        attributes: {
                            name: 'trophy'
                        }
                    }   
                },
                {
                    href: '/electorates',
                    title: 'Electorates',
                    icon: {
                        element: 'ion-icon',
                        attributes: {
                            name: 'ribbon'
                        }
                    }
                }
            ]
        };
    },
    methods: {
        onToggleCollapse (collapsed: boolean) {
            this.collapsed = collapsed;
        }
    }
});
export default App;
</script>

<style lang="scss">
@import '@/styles/global.scss';
</style>

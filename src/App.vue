<template>
    <div 
        id="app"
        :class="[{ 'collapsed' : collapsed }, { 'onmobile' : isOnMobile }]"
    >
        <b-navbar type="is-sidebar-dark">
            <template slot="brand">
                <b-navbar-item>Election 2020</b-navbar-item>
            </template>
            <template slot="start">
                <b-navbar-item>Home</b-navbar-item>
            </template>
        </b-navbar>
        <router-view />
        <sidebar-menu
            :menu="menu"
            :collapsed="collapsed"
            @toggle-collapse="onToggleCollapse"
        />
    </div>
</template>

<script>
export default {
    data() {
        return {
            collapsed: true,
            menu: [
                {
                    header: false,
                    hiddenOnCollapse: true
                },
                {
                    href: '/',
                    title: 'Dashboard',
                    icon: 'fa fa-user'
                }
            ]
        };
    },
    methods: {
        onToggleCollapse (collapsed) {
            this.collapsed = collapsed;
        }
    }
};
</script>

<style lang="scss">
@use "sass:map";

@import "vue-sidebar-menu/src/scss/vue-sidebar-menu.scss";

// map.merge($colors, ());

@import "~bulma/bulma.sass";
@import "~buefy/src/scss/buefy";

#app {
  padding-left: 350px;
  transition: 0.3s ease;
}

#app.collapsed {
  padding-left: 50px;
}
</style>

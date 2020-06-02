<template>
    <div id="app" :class="[{ 'collapsed' : collapsed }, { 'onmobile' : isOnMobile }]">
        <div>
            <b-navbar>
                <b-nav-item>Election Tracker</b-nav-item>
            </b-navbar>
            <router-view />
        </div>
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
#app {
  padding-left: 350px;
  transition: 0.3s ease;
}

#app.collapsed {
  padding-left: 50px;
}
</style>

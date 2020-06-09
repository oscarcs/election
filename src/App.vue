<template>
    <div 
        id="app"
        :class="[{ 'collapsed' : collapsed }, { 'onmobile' : isOnMobile }]"
    >
        <b-navbar type="is-darker">
            <template slot="brand">
                <b-navbar-item>New Zealand Election 2020</b-navbar-item>
            </template>
            <!-- <template slot="start">
                <b-navbar-item>Home</b-navbar-item>
            </template> -->
        </b-navbar>
        
        <section class="section">
            <router-view />
        </section>

        <sidebar-menu
            :menu="menu"
            :collapsed="collapsed"
            @toggle-collapse="onToggleCollapse"
            :disableHover="true"
        >
            <template slot="toggle-icon">
                <ion-icon name="menu-outline"></ion-icon>
            </template>
        </sidebar-menu>
    </div>
</template>

<script>
export default {
    data() {
        return {
            collapsed: false,
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
$orange: #f89828;
$primary-color: $orange;

@import "vue-sidebar-menu/src/scss/_variables.scss";
@import "~bulma/sass/utilities/_all";

$colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": (lighten($dark, 5%), $dark-invert),
    "darker": ($base-bg, findColorInvert($base-bg)),
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert),
    "success": ($success, $success-invert),
    "warning": ($warning, $warning-invert),
    "danger": ($danger, $danger-invert),
    "orange": ($orange, #fff)
);

$section-padding: 1.5rem 1.5rem;

@import "~bulma/bulma.sass";
@import "~buefy/src/scss/buefy";
@import "vue-sidebar-menu/src/scss/vue-sidebar-menu.scss";

#app {
    padding-left: 350px;
    transition: 0.3s ease;
}

#app.collapsed {
    padding-left: 50px;
}

.v-sidebar-menu {
    .vsm--icon {
        padding: 4px !important;
        height: 22px !important;
        width: 22px !important;
        line-height: 30px !important;
    }

    .vsm--toggle-btn {
        ion-icon {
            font-size: 1.5rem;
        }
    }
}

</style>

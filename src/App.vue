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

<script>
export default {
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
        onToggleCollapse (collapsed) {
            this.collapsed = collapsed;
        }
    }
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;600&display=swap');

$family-sans-serif: Jost, BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;


$orange: #eb811a;
$orange2: #ec700a;
$orange3: #da5a05;
$red: #d82c20;
$darkred: #5c0006;
$blue: #2C8ACA;
$lightblue: #56D2FF;
$yellow: #FFD100;
$green: #2CC84D;
$charcoal: #1e1e21;
$slate: #2a2a2e;

$primary-color: $orange;
$base-bg: $slate;

@import "~bulma/sass/utilities/_all";

$mobile-item-bg: $charcoal;

@import "vue-sidebar-menu/src/scss/_variables.scss";

$colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": (lighten($dark, 5%), $dark-invert),
    "darker": ($base-bg, findColorInvert($base-bg)),
    "primary": ($orange,findColorInvert($orange)),
    "success": ($green, findColorInvert($green)),
    "warning": ($yellow, findColorInvert($yellow)),
    "danger": ($red, findColorInvert($red)),
    "info": ($blue, findColorInvert($blue)),
    
    "red": ($red, findColorInvert($red)),
    "darkred": ($darkred, findColorInvert($darkred)),
    "blue": ($blue, findColorInvert($blue)),
    "lightblue": ($lightblue, findColorInvert($lightblue)),
    "yellow": ($yellow, findColorInvert($yellow)),
    "green": ($green, findColorInvert($green)),
    "charcoal": ($charcoal, findColorInvert($charcoal)),
    "slate": ($slate, findColorInvert($slate)),

    "orange": ($orange,findColorInvert($orange)),
    "orange2": ($orange2,findColorInvert($orange2)),
    "orange3": ($orange3,findColorInvert($orange3)),
    "labour": ($red, findColorInvert($red)),
    "national": ($blue, findColorInvert($blue)),
    "act": ($yellow, findColorInvert($yellow)),
    "greens": ($green, findColorInvert($green)),
    "nzf": ($charcoal, findColorInvert($charcoal)),
    "nc": ($lightblue, findColorInvert($lightblue)),
    "maori": ($darkred, findColorInvert($darkred))
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

<template lang="pug">
    #app(:style="{ backgroundColor: background, color: foreground }")
        nav-bar
        router-view
</template>

<script lang="ts">
import NavBar from "@/components/NavBar.vue"
import { Component, Vue } from "vue-property-decorator"
import { ColorName } from "@/ts/colors"

@Component({
    components: {
        NavBar,
    },
})
export default class App extends Vue {
    get background(): string {
        return this.$store.getters.color(ColorName.background).darken(5).toHexString()
    }
    get foreground(): string {
        return this.$store.getters.color(ColorName.foreground).toHexString()
    }
}
</script>

<style lang="sass">
@import url("https://fonts.googleapis.com/css?family=Fira+Mono")
@import "~bulma/bulma.sass"

#app
    font-family: "Avenir", "Segoe UI", sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale

.title, .subtitle
    color: inherit
</style>

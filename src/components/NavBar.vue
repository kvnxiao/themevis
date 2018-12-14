<template lang="pug">
    nav.navbar.has-shadow.is-spaced(:style="{ color: foreground }")
        a.navbar-item
            // LOGO HERE
            img(src="https://via.placeholder.com/64")
        .navbar-item Theme Visualizer
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { ColorName } from "@/ts/colors"

@Component
export default class NavBar extends Vue {
    get background(): string {
        return this.$store.getters.color(ColorName.background).toHexString()
    }
    get foreground(): string {
        return this.$store.getters.color(ColorName.foreground).toHexString()
    }
}
</script>


<style lang="sass" scoped>
.navbar
    background-color: transparent

.navbar-item
    color: inherit
    font-weight: 700
</style>

<template lang="pug">
    section.section
        .container
            h1.title Theme Visualizer
            hr
            color-selections
            hr
            h2.subtitle Preview
</template>

<script lang="ts">
import ColorSelections from "@/components/ColorSelections.vue"
import { Component, Vue } from "vue-property-decorator"

@Component({
    components: {
        ColorSelections,
    },
})
export default class Home extends Vue {}
</script>

<style lang="sass" scoped>
</style>

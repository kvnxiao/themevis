<template lang="pug">
    section.section
        .container
            h1.title Theme Visualizer
            hr(:style="{ backgroundColor: background }")
            color-selections
            hr(:style="{ backgroundColor: background }")
            h2.subtitle Preview
            color-test
</template>

<script lang="ts">
import ColorSelections from "@/components/ColorSelections.vue"
import ColorTest from "@/components/ColorTest.vue"
import { ColorName } from "@/ts/colors"
import { Component, Vue } from "vue-property-decorator"

@Component({
    components: {
        ColorSelections,
        ColorTest,
    },
})
export default class Home extends Vue {
    get background(): string {
        return this.$store.getters.color(ColorName.background).toHexString()
    }
}
</script>

<style lang="sass" scoped>
</style>

<template lang="pug">
    section.section
        .container
            h1.title Theme Visualizer
            hr(:style="{ backgroundColor: background }")
            color-selections
            photoshop-color-picker
            hr(:style="{ backgroundColor: background }")
            h2.subtitle Preview
            color-test
</template>

<script lang="ts">
import ColorSelections from "@/components/ColorSelections.vue"
import ColorTest from "@/components/ColorTest.vue"
import { ColorName } from "@/ts/colors"
import { Component, Vue } from "vue-property-decorator"
import PhotoshopColorPicker from "@/components/PhotoshopColorPicker.vue"

@Component({
    components: {
        ColorSelections,
        ColorTest,
        PhotoshopColorPicker,
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

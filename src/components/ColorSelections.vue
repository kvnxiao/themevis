<template lang="pug">
    #color-selections
        p.control.options
            label.checkbox
                input(type="checkbox", id="checkbox", @click="toggle")
                |  Use generic names instead of color names

        p Primary

        color-selection(colorName="background", nameIsLong="true")
        color-selection(colorName="foreground", nameIsLong="true")

        .columns
            .column
                p Normal
                color-selection(colorName="color1")
                color-selection(colorName="color2")
                color-selection(colorName="color3")
                color-selection(colorName="color4")
                color-selection(colorName="color5")
                color-selection(colorName="color6")
                color-selection(colorName="color7")
                color-selection(colorName="color8")
            .column
                p Bright
                color-selection(colorName="color9")
                color-selection(colorName="color10")
                color-selection(colorName="color11")
                color-selection(colorName="color12")
                color-selection(colorName="color13")
                color-selection(colorName="color14")
                color-selection(colorName="color15")
                color-selection(colorName="color16")
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import ColorSelection from "@/components/ColorSelection.vue"

@Component({
    components: {
        ColorSelection,
    },
})
export default class ColorSelections extends Vue {
    public useGenericName: boolean = false

    public toggle() {
        this.$store.commit("toggleUseGenericNames")
    }
}
</script>

<style lang="sass" scoped>
#color-selections
    margin: 0 auto
    max-width: 600px

.options
    padding: 1rem
    user-select: none

.checkbox:hover
    color: inherit
</style>

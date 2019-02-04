<template lang="pug">
    .field.has-addons
        p.control
            a.button.is-static {{ name }}
        p.control.is-expanded
            input.input(type="text", :value="color", @input="set", @blur="refresh")
        p.control.color
            a.button(:style="{ background: color }")
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator"
import { ColorName, ColorsPayload, FORMAT_REGEX, FRIENDLY_NAMES } from "@/ts/colors"

@Component
export default class ColorSelection extends Vue {
    @Prop()
    public colorName!: string

    get name(): string {
        return (this.$store.getters.useGenericName())
            ? this.colorName.toString()
            : FRIENDLY_NAMES[this.colorName]
    }

    public color: string = this.$store.getters.color(this.colorName).toHexString()

    public set(event: any) {
        const newColor = event.target.value
        if (FORMAT_REGEX.test(newColor)) {
            this.$store.commit("setColor", {
                colorName: this.colorName,
                newColor,
            })
            this.color = this.$store.getters.color(this.colorName).toHexString()
        }
    }

    public refresh(event: any) {
        event.target.value = this.$store.getters.color(this.colorName).toHexString()
    }
}
</script>

<style lang="sass" scoped>
a.button
    min-width: 2.5rem
    &.is-static
        min-width: 5.6rem

input
    font-family: monospace
</style>

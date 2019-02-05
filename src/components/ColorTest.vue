<template lang="pug">
    -
        const columnHeaders = [
            "\u00A0\u00A0\u00A0\u00A0",
            "def",
            "40m",
            "41m",
            "42m",
            "43m",
            "44m",
            "45m",
            "46m",
            "47m",
        ].join("\u00A0\u00A0\u00A0\u00A0\u00A0") + "\u00A0\u00A0\u00A0"
        const rowHeaders = [
            "\u00A0\u00A0\u00A0\u00A0\u00A0m\u00A0",
            "\u00A0\u00A0\u00A0\u00A01m\u00A0",
            "\u00A0\u00A0\u00A030m\u00A0",
            "\u00A01;30m\u00A0",
            "\u00A0\u00A0\u00A031m\u00A0",
            "\u00A01;31m\u00A0",
            "\u00A0\u00A0\u00A032m\u00A0",
            "\u00A01;32m\u00A0",
            "\u00A0\u00A0\u00A033m\u00A0",
            "\u00A01;33m\u00A0",
            "\u00A0\u00A0\u00A034m\u00A0",
            "\u00A01;34m\u00A0",
            "\u00A0\u00A0\u00A035m\u00A0",
            "\u00A01;35m\u00A0",
            "\u00A0\u00A0\u00A036m\u00A0",
            "\u00A01;36m\u00A0",
            "\u00A0\u00A0\u00A037m\u00A0",
            "\u00A01;37m\u00A0",
        ]
        const columnColor = [
            "background",
            "color1",
            "color2",
            "color3",
            "color4",
            "color5",
            "color6",
            "color7",
            "color8",
        ]
        const rowColor = [
            "foreground",
            "foreground",
            "color1",
            "color9",
            "color2",
            "color10",
            "color3",
            "color11",
            "color4",
            "color12",
            "color5",
            "color13",
            "color6",
            "color14",
            "color7",
            "color15",
            "color8",
            "color16",
        ]
        const testText = "\u00A0\u00A0•••\u00A0\u00A0".substr(0, 7)
    #colortest(:style="{ background: background, color: foreground }")
        p.window Terminal
        .body
            p > 
                span(:style="{ color: color3 }") colortest
            br
            p #{columnHeaders}
            each rowName, index in rowHeaders
                p #{rowName}
                    span(:style=`{ color: ${rowColor[index]} }`)
                        each val in columnColor
                            span(:style=`{ background: ${val} }`) #{testText}
                            | &nbsp
            br
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
    get color1(): string {
        return this.$store.getters.color(ColorName.color1).toHexString()
    }
    get color2(): string {
        return this.$store.getters.color(ColorName.color2).toHexString()
    }
    get color3(): string {
        return this.$store.getters.color(ColorName.color3).toHexString()
    }
    get color4(): string {
        return this.$store.getters.color(ColorName.color4).toHexString()
    }
    get color5(): string {
        return this.$store.getters.color(ColorName.color5).toHexString()
    }
    get color6(): string {
        return this.$store.getters.color(ColorName.color6).toHexString()
    }
    get color7(): string {
        return this.$store.getters.color(ColorName.color7).toHexString()
    }
    get color8(): string {
        return this.$store.getters.color(ColorName.color8).toHexString()
    }
    get color9(): string {
        return this.$store.getters.color(ColorName.color9).toHexString()
    }
    get color10(): string {
        return this.$store.getters.color(ColorName.color10).toHexString()
    }
    get color11(): string {
        return this.$store.getters.color(ColorName.color11).toHexString()
    }
    get color12(): string {
        return this.$store.getters.color(ColorName.color12).toHexString()
    }
    get color13(): string {
        return this.$store.getters.color(ColorName.color13).toHexString()
    }
    get color14(): string {
        return this.$store.getters.color(ColorName.color14).toHexString()
    }
    get color15(): string {
        return this.$store.getters.color(ColorName.color15).toHexString()
    }
    get color16(): string {
        return this.$store.getters.color(ColorName.color16).toHexString()
    }
}
</script>

<style lang="sass" scoped>
#colortest
    padding: 2px
    margin: 0 auto
    max-width: 50em
    font-size: 16px
    font-weight: 500
    border-radius: 3px
    box-shadow: 0 5px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)
    .body
        white-space: nowrap
        overflow-x: auto
        font-family: "Fira Code", "Menlo", monospace
        letter-spacing: 0.25px
        line-height: 1.25
    span
        display: inline-block
        height: 1.25em
    .window
        padding: 2px
        text-align: center
        user-select: none
</style>

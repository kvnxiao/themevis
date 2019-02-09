<template lang="pug">
    .pscp
        .color-area
            .bg(:style="styleBackground")
            .fg(:style="styleForeground", @mousedown="mousePicker", @mousemove="mousePicker")
            .cursor(:style="styleCursor")
        .slider-area
            .slider(:style="styleSlider", @mousedown="mouseSlider", @mousemove="mouseSlider")
        .col
            .preview
                .color-block
                    div new
                    .new(:style="styleNewColor")
                    .current(:style="styleOldColor")
                    div current
            .fields
                .option
                    input(type="radio", name="color", value="H", @change="modeSelected($event, 0)", checked)
                    span.type H: 
                    input(type="number", :value="h", min="0", max="360")
                    span.post-type °
                .option
                    input(type="radio", name="color", value="S", @change="modeSelected($event, 1)")
                    span.type S: 
                    input(type="number", :value="s", min="0", max="100")
                    span.post-type %
                .option
                    input(type="radio", name="color", value="V", @change="modeSelected($event, 2)")
                    span.type B: 
                    input(type="number", :value="v", min="0", max="100")
                    span.post-type %
                .option
                    input(type="radio", name="color", value="R", @change="modeSelected($event, 3)")
                    span.type R: 
                    input(type="number", :value="r", min="0", max="255")
                .option
                    input(type="radio", name="color", value="G", @change="modeSelected($event, 4)")
                    span.type G: 
                    input(type="number", :value="g", min="0", max="255")
                .option
                    input(type="radio", name="color", value="B", @change="modeSelected($event, 5)")
                    span.type B: 
                    input(type="number", :value="b", min="0", max="255")
                .option
                    span.type # 
                    input(type="text", name="hex", :value="colorHex")
        .col
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { TinyColor } from "@ctrl/tinycolor"
import * as picker from "@/ts/picker"

const AREA_SIZE: number = 255

@Component
export default class PhotoshopColorPicker extends Vue {
    // mode selector
    private mode: picker.Mode = picker.Mode.HUE
    // color picker and slider positions
    private x: number = 0
    private y: number = 0
    private z: number = 0
    // color values
    private hue: number = 0
    get h() {
        return Math.round(this.hue)
    }
    private saturation: number = 0
    get s() {
        return Math.round(this.saturation)
    }
    private value: number = 0
    get v() {
        return Math.round(this.value)
    }
    private red: number = 0
    get r() {
        return Math.round(this.red)
    }
    private green: number = 0
    get g() {
        return Math.round(this.green)
    }
    private blue: number = 0
    get b() {
        return Math.round(this.blue)
    }
    // new and old ("photoshop current") color setting
    private newColor: TinyColor = new TinyColor()
    private oldColor: TinyColor = new TinyColor()
    get colorHex() {
        return this.newColor.toHex()
    }

    /////////////////////
    // event listeners //
    /////////////////////

    // TODO: make this listener global so that the cursor can still be dragged out of the picker area
    /**
     * Event listener for left-click and left-click-dragging over the color picking area
     * Saves local cursor position to calculate the new color
     */
    public mousePicker(event: MouseEvent) {
        event.preventDefault()

        if (event.buttons !== 1) {
            return
        }

        // update cursor position
        this.x = event.offsetX.clamp(0, AREA_SIZE)
        this.y = AREA_SIZE - event.offsetY.clamp(0, AREA_SIZE)

        // update color
        this.setColor()
    }

    /**
     * Event listener for left-click and left-click-dragging over the color slider
     * Saves local slider position to calculate the new color
     */
    public mouseSlider(event: MouseEvent) {
        event.preventDefault()
        if (event.buttons !== 1) {
            return
        }

        // update slider position
        this.z = AREA_SIZE - event.offsetY.clamp(0, AREA_SIZE)

        // update color
        this.setColor()
    }

    /**
     * Event listener for clicking the radio button modes, fired when the mode selection
     * is changed
     */
    public modeSelected(event: Event, mode: picker.Mode) {
        // update current mode
        this.mode = mode
        // update positions to reflect changes to current mode
        this.updatePositions()
    }

    ////////////////////
    // style bindings //
    ////////////////////

    get styleCursor() {
        return {
            transform: `translate(${this.x - 6}px, ${AREA_SIZE - this.y - 6}px)`,
            borderColor: this.newColor.isDark() ? "#FFFFFF" : "#000000",
        }
    }

    get styleForeground(): picker.BackgroundStyle {
        switch (this.mode) {
            case picker.Mode.HUE:
                return picker.hueForeground
            case picker.Mode.SATURATION:
                return picker.saturationForeground
            case picker.Mode.BRIGHTNESS:
                return picker.brightnessForeground(1 - this.z.asPercent(AREA_SIZE))
            default:
                return {}
        }
    }

    get styleBackground(): picker.BackgroundStyle {
        switch (this.mode) {
            case picker.Mode.HUE:
                return picker.hueBackground(this.z.asDegree(AREA_SIZE))
            case picker.Mode.SATURATION:
                return picker.saturationBackground(this.z.asPercent(AREA_SIZE))
            case picker.Mode.BRIGHTNESS:
                return picker.brightnessBackground
            default:
                return {}
        }
    }

    get styleSlider(): picker.BackgroundStyle {
        switch (this.mode) {
            case picker.Mode.HUE:
                return picker.hueSlider
            case picker.Mode.SATURATION:
                return picker.saturationSlider(this.x.asDegree(AREA_SIZE), this.y.asPercent(AREA_SIZE))
            case picker.Mode.BRIGHTNESS:
                return picker.brightnessSlider(this.x.asDegree(AREA_SIZE), this.y.asPercent(AREA_SIZE))
            default:
                return {}
        }
    }

    get styleNewColor(): picker.BackgroundStyle {
        return {
            background: this.newColor.toRgbString(),
        }
    }

    get styleOldColor(): picker.BackgroundStyle {
        return {
            background: this.oldColor.toRgbString(),
        }
    }

    /////////////////////
    // logical methods //
    /////////////////////

    /**
     * Sets the new color based on the current mode and x, y, z positions
     */
    private setColor() {
        const prevColor = this.newColor
        const colorBlock = picker.coordinatesToColorValues({ x: this.x, y: this.y, z: this.z }, this.mode, AREA_SIZE)

        this.hue = colorBlock.h
        this.saturation = colorBlock.s
        this.value = colorBlock.v
        this.red = colorBlock.r
        this.green = colorBlock.g
        this.blue = colorBlock.b
        this.newColor = colorBlock.color
    }

    /**
     * Updates x, y, z values based on the current selected mode
     */
    private updatePositions() {
        const colorBlock: picker.HSVRGBColor = {
            color: this.newColor,
            h: this.hue,
            s: this.saturation / 100,
            v: this.value / 100,
            r: this.red,
            g: this.green,
            b: this.blue,
        }
        const coordinates = picker.colorValuesToCoordinates(colorBlock, this.mode, AREA_SIZE)
        this.x = coordinates.x
        this.y = coordinates.y
        this.z = coordinates.z
    }
}
</script>

<style lang="sass" scoped>
.pscp
    user-select: none
    border: 1px solid black
    max-width: fit-content
    font-size: 12px
    padding: 1em
    display: flex
    flex-direction: row

.bg, .fg, .slider
        position: absolute
        width: 100%
        height: 100%

.color-area
    background: #FFFFFF
    position: relative
    width: 256px
    height: 256px
    overflow: hidden
    .cursor
        box-sizing: border-box
        border-radius: 50%
        border: 1px solid
        display: block
        width: 12px
        height: 12px
        position: absolute
        pointer-events: none

.slider-area
    background: #000000
    margin: 0 1em
    position: relative
    height: 256px
    width: 19px

.color-block
    width: 64px
    .new, .current
        height: 32px

input[type=radio]
    height: 14px
    width: 14px
    margin: 0 5px 0 0
    vertical-align: middle

.type
    vertical-align: middle
    display: inline-block
    width: 1.8em
.post-type
    margin-left: 5px

input[type=text], input[type=number]
    padding: 0 5px
    font-size: 12px
    box-sizing: border-box
    height: 22px
    color: #f0f0f0
    background-color: #454545
    border: 1px solid #666666

input[type=number]
    width: 3em
    &::-webkit-outer-spin-button, &::-webkit-inner-spin-button
        -webkit-appearance: none
        margin: 0

input[type=text]
    width: 6em

.option
    display: flex
    align-items: center
    margin-top: 0.4em
.option:nth-of-type(4)
    margin-top: 0.667em
</style>

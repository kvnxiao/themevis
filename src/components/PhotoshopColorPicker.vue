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
                    input(type="number", :value="hue", min="0", max="360")
                    |  °
                .option
                    input(type="radio", name="color", value="S", @change="modeSelected($event, 1)")
                    span.type S:
                    input(type="number", :value="saturation", min="0", max="100")
                    |  %
                .option
                    input(type="radio", name="color", value="V", @change="modeSelected($event, 2)")
                    span.type B:
                    input(type="number", :value="brightness", min="0", max="100")
                    |  %
                .option
                    input(type="radio", name="color", value="R", @change="modeSelected($event, 3)")
                    span.type R:
                    input(type="number", :value="red", min="0", max="255")
                .option
                    input(type="radio", name="color", value="G", @change="modeSelected($event, 4)")
                    span.type G:
                    input(type="number", :value="green", min="0", max="255")
                .option
                    input(type="radio", name="color", value="B", @change="modeSelected($event, 5)")
                    span.type B:
                    input(type="number", :value="blue", min="0", max="255")
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
    private saturation: number = 0
    private brightness: number = 0
    private red: number = 0
    private green: number = 0
    private blue: number = 0
    // new and old ("photoshop current") color setting
    private newColor: TinyColor = new TinyColor()
    private oldColor: TinyColor = new TinyColor()

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
        }
        return {}
    }

    get styleBackground(): picker.BackgroundStyle {
        switch (this.mode) {
            case picker.Mode.HUE:
                return picker.hueBackground(this.z.asDegree(AREA_SIZE))
            case picker.Mode.SATURATION:
                return picker.saturationBackground(this.z.asPercent(AREA_SIZE))
        }
        return {}
    }

    get styleSlider(): picker.BackgroundStyle {
        switch (this.mode) {
            case picker.Mode.HUE:
                return picker.hueSlider
            case picker.Mode.SATURATION:
                return picker.saturationSlider(this.x.asDegree(AREA_SIZE), this.y.asPercent(AREA_SIZE))
        }
        return {}
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
        switch (this.mode) {
            case picker.Mode.HUE: {
                const h = this.z.asDegree(AREA_SIZE)
                const s = this.x.asPercent(AREA_SIZE)
                const v = this.y.asPercent(AREA_SIZE)
                this.newColor = new TinyColor({ h, s, v })
                break
            }
            case picker.Mode.SATURATION: {
                const h = this.x.asDegree(AREA_SIZE)
                const s = this.z.asPercent(AREA_SIZE)
                const v = this.y.asPercent(AREA_SIZE)
                this.newColor = new TinyColor({ h, s, v})
                break
            }
            case picker.Mode.BRIGHTNESS: {
                break
            }
            case picker.Mode.RED: {
                break
            }
            case picker.Mode.GREEN: {
                break
            }
            case picker.Mode.BLUE: {
                break
            }
        }
        this.red = Math.round(this.newColor.r)
        this.green = Math.round(this.newColor.g)
        this.blue = Math.round(this.newColor.b)
        const hsv = this.newColor.toHsv()
        this.hue = Math.round(hsv.h)
        this.saturation = Math.round(hsv.s * 100)
        this.brightness = Math.round(hsv.v * 100)
    }

    /**
     * Updates x, y, z values based on the current selected mode
     */
    private updatePositions() {
        // TODO
        const hsvCoords: picker.HSVANumbers = picker.toCoordinates(this.newColor.toHsv(), AREA_SIZE)
        switch (this.mode) {
            case picker.Mode.HUE:
                this.x = hsvCoords.s
                this.y = hsvCoords.v
                this.z = hsvCoords.h
                break
            case picker.Mode.SATURATION:
                this.x = hsvCoords.h
                this.y = hsvCoords.v
                this.z = hsvCoords.s
                break
        }
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
</style>

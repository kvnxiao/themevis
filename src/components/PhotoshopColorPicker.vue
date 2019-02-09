<template lang="pug">
    .pscp
        .color-area
            .bg(:style="styleBackground")
            .fg(:style="styleForeground")
            .cursor(:style="styleCursor")
        .slider-area
            .slider(:style="styleSlider")
                .pointer(:style="styleSliderPos")
                    img(src="/svg/spl.svg").left
                    img(src="/svg/spr.svg").right
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

    private isColorArea: boolean = false
    private isSliderArea: boolean = false
    private top: number = 0
    private left: number = 0

    /**
     * mousedown event listener added to document on mounted lifecycle hook
     * to allow us to know that a user has clicked in the color area or slider area
     */
    public mousedown(event: MouseEvent) {
        if (event.buttons !== 1) {
            return
        }

        const element = event.target as HTMLElement
        switch (element.className) {
            case "color-area": {
                event.preventDefault()
                this.isColorArea = true
                const boundingRect = element.getBoundingClientRect()
                this.top = boundingRect.top
                this.left = boundingRect.left
                this.onmousePicker(event.offsetX, event.offsetY)
                break
            }
            case "slider-area": {
                event.preventDefault()
                this.isSliderArea = true
                const boundingRect = element.getBoundingClientRect()
                this.top = boundingRect.top
                this.left = boundingRect.left
                this.onmouseSlider(event.offsetY)
                break
            }
        }
    }

    /**
     * mousemove event listener added to document on mounted lifecycle hook
     * to allow the cursor within the color / slider area to move even if the
     * mouse cursor is outside the boundaries of the color / slider area element
     */
    public mousemove(event: MouseEvent) {
        if (event.buttons !== 1) {
            return
        }

        if (this.isColorArea) {
            event.preventDefault()
            this.onmousePicker(event.clientX - this.left, event.clientY - this.top)
        } else if (this.isSliderArea) {
            event.preventDefault()
            this.onmouseSlider(event.clientY - this.top)
        }
    }

    /**
     * mouseup event listener added to document on mounted lifecycle hook
     * to allow us to know that a user has let go from having clicked on
     * the color area or slider area
     */
    public mouseup(event: MouseEvent) {
        this.isColorArea = false
        this.isSliderArea = false
    }

    /**
     * Event handler for left-click and left-click-dragging over the color picking area
     * Saves local cursor position to calculate the new color
     */
    public onmousePicker(offsetX: number, offsetY: number) {
        if (this.isColorArea) {
            // update cursor position
            this.x = offsetX.clamp(0, AREA_SIZE)
            this.y = AREA_SIZE - offsetY.clamp(0, AREA_SIZE)

            // update color
            this.setColor()
        }
    }

    /**
     * Event handler for left-click and left-click-dragging over the color slider
     * Saves local slider position to calculate the new color
     */
    public onmouseSlider(offsetY: number) {
        if (this.isSliderArea) {
            // update slider position
            this.z = AREA_SIZE - offsetY.clamp(0, AREA_SIZE)

            // update color
            this.setColor()
        }
    }

    /**
     * Event handler for clicking the radio button modes, fired when the mode selection
     * is changed
     */
    public modeSelected(event: Event, mode: picker.Mode) {
        // update current mode
        this.mode = mode
        // update positions to reflect changes to current mode
        this.updatePositions()
    }

    public mounted() {
        document.addEventListener("mousedown", this.mousedown)
        document.addEventListener("mousemove", this.mousemove)
        document.addEventListener("mouseup", this.mouseup)
    }

    public beforeDestroy() {
        document.removeEventListener("mousedown", this.mousedown)
        document.removeEventListener("mousemove", this.mousemove)
        document.removeEventListener("mouseup", this.mouseup)
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
            case picker.Mode.RED:
                return picker.redForeground
            case picker.Mode.GREEN:
                return picker.greenForeground
            case picker.Mode.BLUE:
                return picker.blueForeground
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
            case picker.Mode.RED:
                return picker.redBackground(this.red)
            case picker.Mode.GREEN:
                return picker.greenBackground(this.green)
            case picker.Mode.BLUE:
                return picker.blueBackground(this.blue)
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
            case picker.Mode.RED:
                return picker.redSlider(this.green, this.blue)
            case picker.Mode.GREEN:
                return picker.greenSlider(this.red, this.blue)
            case picker.Mode.BLUE:
                return picker.blueSlider(this.red, this.green)
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

    get styleSliderPos() {
        return {
            top: `${AREA_SIZE - this.z - 5}px`,
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
    border: 1px solid #84807f
    background: #535353
    max-width: fit-content
    font-size: 12px
    padding: 1em
    display: flex
    flex-direction: row

.bg, .fg, .slider
        pointer-events: none
        position: absolute
        width: 100%
        height: 100%

.color-area
    cursor: crosshair
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
    position: relative
    height: 256px
    width: 43px

.slider
    margin: 0 1em
    width: 19px

.pointer
    pointer-events: none
    position: relative
    top: -6px

    .left, .right
        position: absolute
    
    .left
        left: -11px

    .right
        right: -11px

.color-block
    text-align: center
    width: 64px
    .new, .current
        height: 32px

input[type=radio]
    height: 14px
    width: 14px
    margin: 0 5px 0 1px
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

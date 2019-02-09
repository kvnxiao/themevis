/* tslint:disable:max-line-length */
import { TinyColor } from "@ctrl/tinycolor"

declare global {
    interface Number {
        clamp(min: number, max: number): number
        asDegree(size: number): number
        asPercent(max: number): number
        fromDegree(size: number): number
        fromPercent(max: number): number
    }
}

Number.prototype.clamp = function(min: number, max: number): number {
    return Math.min(Math.max(this as number, min), max)
}

Number.prototype.asDegree = function(size: number): number {
    return (this.clamp(0, size) * 360) / size
}

Number.prototype.asPercent = function(max: number): number {
    return (this as number) / max
}

Number.prototype.fromDegree = function(size: number): number {
    return ((this as number) / 360) * size
}

Number.prototype.fromPercent = function(max: number): number {
    return (this as number) * max
}

export enum Mode {
    HUE = 0,
    SATURATION = 1,
    BRIGHTNESS = 2,
    RED = 3,
    GREEN = 4,
    BLUE = 5,
}

export interface BackgroundStyle {
    background?: string
    backgroundColor?: string
    backgroundBlendMode?: string
    mixBlendMode?: string
    opacity?: number
}

export interface HSVNumbers {
    h: number
    s: number
    v: number
}

export interface RGBNumbers {
    r: number
    g: number
    b: number
}

export interface HSVRGBColor extends HSVNumbers, RGBNumbers {
    color: TinyColor
}

export interface Coordinates {
    x: number
    y: number
    z: number
}

export function coordinatesToColorValues(coordinates: Coordinates, mode: Mode, size: number): HSVRGBColor {
    switch (mode) {
        case Mode.HUE:
            return hueMode(coordinates, size)
        case Mode.SATURATION:
            return saturationMode(coordinates, size)
        case Mode.BRIGHTNESS:
            return valueMode(coordinates, size)
        case Mode.RED:
            return redMode(coordinates, size)
        case Mode.BLUE:
            return blueMode(coordinates, size)
        case Mode.GREEN:
            return greenMode(coordinates, size)
    }
}

export function colorValuesToCoordinates(colorBlock: HSVRGBColor, mode: Mode, size: number): Coordinates {
    switch (mode) {
        case Mode.HUE: {
            return {
                x: colorBlock.s.fromPercent(size),
                y: colorBlock.v.fromPercent(size),
                z: colorBlock.h.fromDegree(size),
            }
        }
        case Mode.SATURATION:
            return {
                x: colorBlock.h.fromDegree(size),
                y: colorBlock.v.fromPercent(size),
                z: colorBlock.s.fromPercent(size),
            }
        case Mode.BRIGHTNESS:
            return {
                x: colorBlock.h.fromDegree(size),
                y: colorBlock.s.fromPercent(size),
                z: colorBlock.v.fromPercent(size),
            }
        case Mode.RED:
            return {
                x: colorBlock.b,
                y: colorBlock.g,
                z: colorBlock.r,
            }
        case Mode.GREEN:
            return {
                x: colorBlock.b,
                y: colorBlock.r,
                z: colorBlock.g,
            }
        case Mode.BLUE:
            return {
                x: colorBlock.r,
                y: colorBlock.g,
                z: colorBlock.b,
            }
    }
}

/**
 * Hue mode conversion for coordinates
 * x -> saturation
 * y -> value / brightness
 * z -> hue
 */
function hueMode(coordinates: Coordinates, size: number): HSVRGBColor {
    const s = coordinates.x.asPercent(size)
    const v = coordinates.y.asPercent(size)
    const h = coordinates.z.asDegree(size)
    const color = new TinyColor({ h, s, v })
    return {
        h,
        s: s * 100,
        v: v * 100,
        color,
        r: color.r,
        g: color.g,
        b: color.b,
    }
}

/**
 * Saturation mode conversion for coordinates
 * x -> hue
 * y -> value / brightness
 * z -> saturation
 */
function saturationMode(coordinates: Coordinates, size: number): HSVRGBColor {
    const h = coordinates.x.asDegree(size)
    const v = coordinates.y.asPercent(size)
    const s = coordinates.z.asPercent(size)
    const color = new TinyColor({ h, s, v })
    return {
        h,
        s: s * 100,
        v: v * 100,
        color,
        r: color.r,
        g: color.g,
        b: color.b,
    }
}

/**
 * Value / Brightness mode conversion for coordinates
 * x -> hue
 * y -> saturation
 * z -> value / brightness
 */
function valueMode(coordinates: Coordinates, size: number): HSVRGBColor {
    const h = coordinates.x.asDegree(size)
    const s = coordinates.y.asPercent(size)
    const v = coordinates.z.asPercent(size)
    const color = new TinyColor({ h, s, v })
    return {
        h,
        s: s * 100,
        v: v * 100,
        color,
        r: color.r,
        g: color.g,
        b: color.b,
    }
}

/**
 * Red mode conversion for coordinates
 * x -> blue
 * y -> green
 * z -> red
 */
function redMode(coordinates: Coordinates, size: number): HSVRGBColor {
    const b = coordinates.x
    const g = coordinates.y
    const r = coordinates.z
    const color = new TinyColor({ r, g, b })
    const hsv = color.toHsv()
    return {
        r,
        g,
        b,
        color,
        h: hsv.h,
        s: hsv.s * 100,
        v: hsv.v * 100,
    }
}

/**
 * Green mode conversion for coordinates
 * x -> blue
 * y -> red
 * z -> green
 */
function greenMode(coordinates: Coordinates, size: number): HSVRGBColor {
    const b = coordinates.x
    const r = coordinates.y
    const g = coordinates.z
    const color = new TinyColor({ r, g, b })
    const hsv = color.toHsv()
    return {
        r,
        g,
        b,
        color,
        h: hsv.h,
        s: hsv.s * 100,
        v: hsv.v * 100,
    }
}

/**
 * Blue mode conversion for coordinates
 * x -> red
 * y -> green
 * z -> blue
 */
function blueMode(coordinates: Coordinates, size: number): HSVRGBColor {
    const r = coordinates.x
    const g = coordinates.y
    const b = coordinates.z
    const color = new TinyColor({ r, g, b })
    const hsv = color.toHsv()
    return {
        r,
        g,
        b,
        color,
        h: hsv.h,
        s: hsv.s * 100,
        v: hsv.v * 100,
    }
}

// Hue
export const hueForeground: BackgroundStyle = {
    background:
        "linear-gradient(to top, #000000, rgba(0, 0, 0, 0)), linear-gradient(to right, #ffffff, rgba(0, 0, 0, 0))",
}

export function hueBackground(hue: number): BackgroundStyle {
    return {
        background: new TinyColor({
            h: hue,
            s: 1,
            v: 1,
        }).toRgbString(),
    }
}

export const hueSlider: BackgroundStyle = {
    background:
        "linear-gradient(to top, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 16.66666%, rgb(0, 255, 0) 33.33333%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 66.66666%, rgb(255, 0, 255) 83.33333%, rgb(255, 0, 0) 100%)",
}

// Saturation
export const saturationForeground: BackgroundStyle = {
    background: "linear-gradient(to top, #000000 0%, rgba(255, 255, 255, 0) 100%)",
}

export function saturationBackground(opacity: number): BackgroundStyle {
    return {
        opacity,
        background:
            "linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 16.66666%, rgb(0, 255, 0) 33.33333%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 66.66666%, rgb(255, 0, 255) 83.33333%, rgb(255, 0, 0) 100%)",
    }
}

export function saturationSlider(hue: number, brightness: number): BackgroundStyle {
    const topColor = new TinyColor({ h: hue, s: 1, v: brightness }).toRgbString()
    const bottomColor = new TinyColor({ h: hue, s: 0, v: brightness }).toRgbString()
    return {
        background: `linear-gradient(to top, ${bottomColor}, ${topColor})`,
    }
}

// Brightness
export const brightnessBackground: BackgroundStyle = {
    background: "linear-gradient(to top, #ffffff, rgba(255, 255, 255, 0)), linear-gradient(to right, rgba(255, 0, 0, 1) 0%, rgba(255, 255, 0, 1) 16.66666%, rgba(0, 255, 0, 1) 33.33333%, rgba(0, 255, 255, 1) 50%, rgba(0, 0, 255, 1) 66.66666%, rgba(255, 0, 255, 1) 83.33333%, rgba(255, 0, 0, 1) 100%)",
}

export function brightnessForeground(opacity: number): BackgroundStyle {
    return {
        background: "black",
        opacity,
    }
}

export function brightnessSlider(hue: number, saturation: number): BackgroundStyle {
    const topColor = new TinyColor({ h: hue, s: saturation, v: 1}).toRgbString()
    return {
        background: `linear-gradient(to top, #000000, ${topColor})`,
    }
}

// Red
export function redBackground(red: number): BackgroundStyle {
    return {
        background: `rgb(${red}, 0, 0)`,
    }
}

export const redForeground: BackgroundStyle = {
    background: "linear-gradient(to right, transparent, rgb(0, 0, 255)), linear-gradient(to top, transparent, rgb(0, 255, 0))",
    backgroundBlendMode: "screen",
    mixBlendMode: "screen",
}

export function redSlider(green: number, blue: number): BackgroundStyle {
    return {
        background: `linear-gradient(to top, rgb(0, ${green}, ${blue}), rgb(255, ${green}, ${blue}))`,
    }
}

// Green
export function greenBackground(green: number): BackgroundStyle {
    return {
        background: `rgb(0, ${green}, 0)`,
    }
}

export const greenForeground: BackgroundStyle = {
    background: "linear-gradient(to right, transparent, rgb(0, 0, 255)), linear-gradient(to top, transparent, rgb(255, 0, 0))",
    backgroundBlendMode: "screen",
    mixBlendMode: "screen",
}

export function greenSlider(red: number, blue: number): BackgroundStyle {
    return {
        background: `linear-gradient(to top, rgb(${red}, 0, ${blue}), rgb(${red}, 255, ${blue}))`,
    }
}

// Blue
export function blueBackground(blue: number): BackgroundStyle {
    return {
        background: `rgb(0, 0, ${blue})`,
    }
}

export const blueForeground: BackgroundStyle = {
    background: "linear-gradient(to right, transparent, rgb(255, 0, 0)), linear-gradient(to top, transparent, rgb(0, 255, 0))",
    backgroundBlendMode: "screen",
    mixBlendMode: "screen",
}

export function blueSlider(red: number, green: number): BackgroundStyle {
    return {
        background: `linear-gradient(to top, rgb(${red}, ${green}, 0), rgb(${red}, ${green}, 255))`,
    }
}

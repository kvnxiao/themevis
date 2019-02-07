/* tslint:disable:max-line-length */
import { TinyColor } from "@ctrl/tinycolor"
import { HSVA } from "@ctrl/tinycolor/interfaces"

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
    return (this as number) / 360 * size
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

export interface HSVANumbers {
    h: number
    s: number
    v: number
    a: number
}

export function toCoordinates(hsva: HSVANumbers, size: number): HSVANumbers {
    return {
        h: hsva.h.fromDegree(size),
        s: hsva.s.fromPercent(size),
        v: hsva.v.fromPercent(size),
        a: hsva.a,
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
    background: "linear-gradient(to top, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 16.66666%, rgb(0, 255, 0) 33.33333%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 66.66666%, rgb(255, 0, 255) 83.33333%, rgb(255, 0, 0) 100%)",
}

// Saturation
export const saturationForeground: BackgroundStyle = {
    background: "linear-gradient(to top, #000000 0%, rgba(255, 255, 255, 0) 100%)",
}

export function saturationBackground(opacity: number): BackgroundStyle {
    return {
        opacity,
        background: "linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 16.66666%, rgb(0, 255, 0) 33.33333%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 66.66666%, rgb(255, 0, 255) 83.33333%, rgb(255, 0, 0) 100%)",
    }
}

export function saturationSlider(hue: number, brightness: number): BackgroundStyle {
    const topColor = new TinyColor({ h: hue, s: 1, v: brightness })
    const bottomColor = new TinyColor({ h: hue, s: 0, v: brightness })
    return {
        background: `linear-gradient(to top, ${bottomColor.toRgbString()}, ${topColor.toRgbString()})`,
    }
}

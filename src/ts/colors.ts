import { TinyColor } from "@ctrl/tinycolor"

// tslint:disable-next-line:max-line-length
/**
 * Regex to match acceptable color format types for text input.
 * Currently set as:
 * - 6-char HEX with or without '#' prefix
 * - rgb(x,y,z) values where x, y, z are integers (spaces are acceptable after each comma)
 */
export const FORMAT_REGEX = new RegExp(/^#?[A-Fa-f0-9]{6}$|^rgb\([0-9]{1,3},\s*[0-9]{1,3},\s*[0-9]{1,3}\)$/)

/**
 * Enum-string mapping to represent color names
 */
export enum ColorName {
    color1 = "color1",
    color2 = "color2",
    color3 = "color3",
    color4 = "color4",
    color5 = "color5",
    color6 = "color6",
    color7 = "color7",
    color8 = "color8",
    color9 = "color9",
    color10 = "color10",
    color11 = "color11",
    color12 = "color12",
    color13 = "color13",
    color14 = "color14",
    color15 = "color15",
    color16 = "color16",
    background = "background",
    foreground = "foreground",
}

/**
 * Mapping of color number to friendly color name
 */
export const FRIENDLY_NAMES: { [key: string]: string } = {
    color1: "Black",
    color2: "Red",
    color3: "Green",
    color4: "Yellow",
    color5: "Blue",
    color6: "Magenta",
    color7: "Cyan",
    color8: "White",
    color9: "Black",
    color10: "Red",
    color11: "Green",
    color12: "Yellow",
    color13: "Blue",
    color14: "Magenta",
    color15: "Cyan",
    color16: "White",
    background: "Background",
    foreground: "Foreground",
}

/**
 * Class to encapsulate all the color selections that can be made
 */
export default class ColorSelections {
    private name: string
    private background: TinyColor
    private foreground: TinyColor
    private color1: TinyColor
    private color2: TinyColor
    private color3: TinyColor
    private color4: TinyColor
    private color5: TinyColor
    private color6: TinyColor
    private color7: TinyColor
    private color8: TinyColor
    private color9: TinyColor
    private color10: TinyColor
    private color11: TinyColor
    private color12: TinyColor
    private color13: TinyColor
    private color14: TinyColor
    private color15: TinyColor
    private color16: TinyColor

    constructor() {
        // TODO: add functionality to save / load color selections with names
        this.name = ""
        this.background = new TinyColor("#2E3440")
        this.foreground = new TinyColor("#D8DEE9")
        this.color1 = new TinyColor("#3B4252")
        this.color2 = new TinyColor("#BF616A")
        this.color3 = new TinyColor("#A3BE8C")
        this.color4 = new TinyColor("#EBCB8B")
        this.color5 = new TinyColor("#81A1C1")
        this.color6 = new TinyColor("#B48EAD")
        this.color7 = new TinyColor("#88C0D0")
        this.color8 = new TinyColor("#E5E9F0")
        this.color9 = new TinyColor("#4C566A")
        this.color10 = new TinyColor("#BF616A")
        this.color11 = new TinyColor("#A3BE8C")
        this.color12 = new TinyColor("#EBCB8B")
        this.color13 = new TinyColor("#81A1C1")
        this.color14 = new TinyColor("#B48EAD")
        this.color15 = new TinyColor("#8FBCBB")
        this.color16 = new TinyColor("#ECEFF4")
    }

    /**
     * Sets a new color for the given color name
     * @param payload payload containing color number enum-string and the new color as a string to be parsed
     */
    public set(payload: ColorsPayload) {
        this[payload.colorName] = new TinyColor(payload.newColor)
    }

    /**
     * Gets the color instance for the given color name
     * @param colorName color number enum-string
     */
    public get(colorName: ColorName): TinyColor {
        return this[colorName]
    }

    /**
     * Returns a simplified object representation of the currently selected colors
     */
    public toJSON(): any {
        return Object.assign({}, ...Object.entries(this).map((pair: [string, TinyColor]) => {
            return { [pair[0]]: pair[1].toHexString() }
        }))
    }
}

/**
 * Payload to be used by setters and state management externally (e.g. Vuex)
 */
export interface ColorsPayload {
    colorName: ColorName
    newColor: string
}

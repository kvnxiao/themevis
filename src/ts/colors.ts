import tinycolor, { Instance as TCInstance } from "tinycolor2"

// tslint:disable-next-line:max-line-length
export const HEX_REGEX = new RegExp(/^#?[A-Fa-f0-9]{6}$|^rgb\([0-9]{1,3},\s*[0-9]{1,3},\s*[0-9]{1,3}\)$/)

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

export const FRIENDLY_NAMES: { [key: string]: string } = {
    color1: "Black",
    color2: "Red",
    color3: "Green",
    color4: "Yellow",
    color5: "Blue",
    color6: "Magenta",
    color7: "Cyan",
    color8: "White",
    color9:  "Black",
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

export default class ColorSelections {
    public background: TCInstance
    public foreground: TCInstance
    public color1: TCInstance
    public color2: TCInstance
    public color3: TCInstance
    public color4: TCInstance
    public color5: TCInstance
    public color6: TCInstance
    public color7: TCInstance
    public color8: TCInstance
    public color9: TCInstance
    public color10: TCInstance
    public color11: TCInstance
    public color12: TCInstance
    public color13: TCInstance
    public color14: TCInstance
    public color15: TCInstance
    public color16: TCInstance

    constructor() {
        this.background = tinycolor("#2E3440")
        this.foreground = tinycolor("#D8DEE9")
        this.color1 = tinycolor("#3B4252")
        this.color2 = tinycolor("#BF616A")
        this.color3 = tinycolor("#A3BE8C")
        this.color4 = tinycolor("#EBCB8B")
        this.color5 = tinycolor("#81A1C1")
        this.color6 = tinycolor("#B48EAD")
        this.color7 = tinycolor("#88C0D0")
        this.color8 = tinycolor("#E5E9F0")
        this.color9 = tinycolor("#4C566A")
        this.color10 = tinycolor("#BF616A")
        this.color11 = tinycolor("#A3BE8C")
        this.color12 = tinycolor("#EBCB8B")
        this.color13 = tinycolor("#81A1C1")
        this.color14 = tinycolor("#B48EAD")
        this.color15 = tinycolor("#8FBCBB")
        this.color16 = tinycolor("#ECEFF4")
    }

    public set(payload: ColorsPayload) {
        this[payload.colorName] = tinycolor(payload.newColor)
    }

    public get(colorName: ColorName): TCInstance {
        return this[colorName]
    }
}

export interface ColorsPayload {
    colorName: ColorName
    newColor: string
}

import Vue from "vue"
import Vuex, { StoreOptions } from "vuex"
import ColorSelections, { ColorName, ColorsPayload } from "@/ts/colors"

Vue.use(Vuex)

const colors = new ColorSelections()

export default new Vuex.Store({
    state: {
        colors,
    },
    mutations: {
        setColor(state: any, payload: ColorsPayload) {
            state.colors.set(payload)
        },
    },
    actions: {
        setColor(context: any, payload: ColorsPayload) {
            context.commit("setColor", payload)
        },
    },
    getters: {
        color: (state: any) => (colorName: ColorName) => {
            return state.colors[colorName]
        },
    },
})

import Vue from "vue"
import Vuex, { StoreOptions } from "vuex"
import ColorSelections, { ColorName, ColorsPayload } from "@/ts/colors"

Vue.use(Vuex)

interface State {
    useGenericNames: boolean
    colors: ColorSelections
}

const stateInstance: State = {
    colors: new ColorSelections(),
    useGenericNames: false,
}

export default new Vuex.Store({
    state: stateInstance,
    mutations: {
        setColor(state: State, payload: ColorsPayload) {
            state.colors.set(payload)
        },
        toggleUseGenericNames(state: State) {
            state.useGenericNames = !state.useGenericNames
        },
    },
    actions: {
        setColor(context: any, payload: ColorsPayload) {
            context.commit("setColor", payload)
        },
        toggleUseGenericNames(context: any) {
            context.commit("toggleUseGenericNames")
        },
    },
    getters: {
        color: (state: State) => (colorName: ColorName) => {
            return state.colors.get(colorName)
        },
        useGenericName: (state: State) => () => {
            return state.useGenericNames
        },
        colors: (state: State) => () => {
            return state.colors
        },
    },
})

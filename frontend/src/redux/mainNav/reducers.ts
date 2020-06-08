import { MainNavActions } from "./actions"

export interface MainNavState{
    isOpen: boolean
    isSideDrawerOpen:boolean
}

const initialState: MainNavState = {
    isOpen: false,
    isSideDrawerOpen: false
}

export const mainNavReducer = (state:MainNavState = initialState, actions: MainNavActions) => {
    switch(actions.type){
        case '@@MAINNAV/OPEN_NAV':
            console.log(123)
            return {
                ...state,
                isOpen: true
            }
        case '@@MAINNAV/CLOSE_NAV':
            return {
                ...state,
                isOpen: false
            }
        case '@@MAINNAV/OPEN_SIDE_DRAWER':
            return {
                ...state,
                isSideDrawerOpen: true
            }
        case '@@MAINNAV/CLOSE_SIDE_DRAWER':
            return {
                ...state,
                isSideDrawerOpen: false
            }
        default:
            return state
    }
    
}
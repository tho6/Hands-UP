export function openNav(){
    return {
        type: '@@MAINNAV/OPEN_NAV' as '@@MAINNAV/OPEN_NAV'
    }
}
export function closeNav(){
    return {
        type: '@@MAINNAV/CLOSE_NAV' as '@@MAINNAV/CLOSE_NAV'
    }
}
export function openSideDrawer(){
    return {
        type: '@@MAINNAV/OPEN_SIDE_DRAWER' as '@@MAINNAV/OPEN_SIDE_DRAWER'
    }
}
export function closeSideDrawer(){
    return {
        type: '@@MAINNAV/CLOSE_SIDE_DRAWER' as '@@MAINNAV/CLOSE_SIDE_DRAWER'
    }
}
export type MainNavActions = ReturnType<typeof openNav> | 
                            ReturnType<typeof closeNav> |
                            ReturnType<typeof closeSideDrawer> | 
                            ReturnType<typeof openSideDrawer>
export const isPermissionExist = (module: string, menu: string, subMenu: string, scope: string) => {
    let logInUserData = JSON.parse(localStorage.getItem('currentUser'));
    const accessFlag = logInUserData?.menuAccessObject?.find((item: any) => item.title == menu)?.subMenuData?.find((submenuItem: any) => submenuItem?.title == subMenu).scopes;
    const scopeCheck = accessFlag.includes(scope);
    return scopeCheck;
}

export const isPermissionExistMenuLevel = (menu: string, subParentMenu: string, subMenu: string, scope: string) => {
    let logInUserData = JSON.parse(localStorage.getItem('currentUser'));
    const accessFlag = logInUserData.menuAccessObject.find((item: any) => item.title == menu).scopes;
    const scopeCheck = accessFlag.includes(scope);
    return scopeCheck
}

export const isPermissionExistThirdLayer = (menu: string, subParentMenu: string, subMenu: string, scope: string) => {
    let logInUserData = JSON.parse(localStorage.getItem('currentUser'));
    const accessFlag = logInUserData.menuAccessObject.find((item: any) => item.title == menu).subMenuData.find((submenuItem: any) => submenuItem.title == subMenu).scopes;
    const scopeCheck = accessFlag.includes(scope);
    return scopeCheck
}

export const isRoleExist = (role: string) => {

}

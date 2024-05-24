export const showLogin = (state) => state.login.showLogin;
export const loginAction = (state) => state.login.action;
export const userInfo = (state) => state.login.userinfo;
export const scrollTop = (state) => state.scroll.scrollTop;
export const token = (state) => state.login.token;

// 新增 getter 用于获取用户角色
export const userRole = (state) => {
    return state.login.userinfo ? state.login.userinfo.role : null;
};

// 新增 getter 判断用户是否为管理员
export const isAdmin = (state) => {
    console.log(state.login.userinfo);
    console.log("Here");
    return state.login.userinfo && state.login.userinfo.roleId === 2;
};

'use strict';

// We have to have this sillyness because the library
// that we're using doesn't properly send error messages back
// if the login fails, or the user's e-mail is unverified.  Instead,
// it lets us customize what the messages are, so we need to basically make
// our own messages so we can tell what error has occured.

function UserLoginService() {

}

UserLoginService.emailUnverifiedErrorString = "__EMA_I_L_UN_VE_R_IF_IED";
UserLoginService.incorrectUsernameErrorString = "_____INCO__RR_E_C___T____USE_R___NAM__E";
UserLoginService.incorrectPasswordErrorString = "__INCORR__ECT____PASS__W_O_R_D__";

module.exports = UserLoginService;
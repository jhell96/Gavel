Parse.initialize("tnT3xM2pzKzrLhqzSxtBMEV5z8LOk93qgtqvwubw", "RgzXe2VjCM2U77y36Ua6vaBBulghCrlBHeYEJIto");

var currentUser = Parse.User.current();
if (currentUser) {
    window.location = "home.html";
}

function redir_to_home(){
    window.location = "home.html";
}

function redir_to_acc(){
    window.location = "createacc.html";
}

function redir_to_login(){
    window.location = "login.html";
}
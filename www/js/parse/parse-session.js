Parse.initialize("tnT3xM2pzKzrLhqzSxtBMEV5z8LOk93qgtqvwubw", "fuZTNH963qimEXgzCFXjt8S1o24UpcOUZFJeA5V5");

//var currentUser = Parse.User.current();
//if (currentUser) {
//    // do stuff with the user
//} else {
//    window.location = ("index.html");
//}

function logout(){
    Parse.User.logOut();
    window.location = ("index.html");
}
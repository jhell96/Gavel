Parse.initialize("tnT3xM2pzKzrLhqzSxtBMEV5z8LOk93qgtqvwubw", "fuZTNH963qimEXgzCFXjt8S1o24UpcOUZFJeA5V5");

function redir(){window.location.replace("home.html");}

function signup() {
    //var bd = $('#birthdate').val();
    var em = $('#email').val();
    var pw = $('#password').val();
    var age = $('#age').val();
    var ge = $('#gender').val();
    var his = $('#history').val();
    var tr = $('#tropical').val();

    if (!(em && pw && age && ge && his && tr)) {
        alert('Please fill out all fields.');
        return;
    }

    var user = new Parse.User();
    user.set("username", em);
    user.set("password", pw);
    user.set("email", em);
     user.set("age", parseInt(age));
    user.set("sex", parseInt(ge));
    user.set("family_history", (his === 'on') ? 2 : 1);
     user.set("tropical_climate", (tr === 'on') ? 2 : 1);

    user.signUp(null, {
        success: function (user) {
            redir();
        },
        error: function (user, error) {
            // Show the error message somewhere and let the user try again.
            alert(error.message.replace("username","email"));
        }
    });


}

function login() {
    var em = $('#email').val();
    var pw = $('#password').val();
    Parse.User.logIn(em, pw, {
        success: function (user) {
            redir();
        },
        error: function (user, error) {
            alert(error.message.replace("username","email"));
        }
    });
}

function entercheck(e,x){
if (e.keyCode == 13)
    if(x==0)
        signup();
    else if(x==1)
        signup1();
    else
        login();
}

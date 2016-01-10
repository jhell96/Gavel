function check() {
    console.log('here');
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        correctOrientation: true
    });

    function onSuccess(imageData) {
        var b64 = "data:image/jpeg;base64," + imageData;
        console.log('start');
        $.post('https://api.cloudinary.com/v1_1/mole/image/upload', {
            file: b64,
            api_key: '838912264992939',
            timestamp: (Date.now() / 1000 | 0) + '',
            upload_preset: 'atdlnige'
        }, function (data) {
            if (data.hasOwnProperty('error')) {
                alert('Upload failed.');
                console.log("e");
            } else {
                var s = data['url'];
                var x = s.indexOf("upload");
                s = "http://res.cloudinary.com/mole/image/upload/a_90/" + s.substring(x + 8);
                console.log(data['url']);
                $.get('http://seblopezcot.pythonanywhere.com/?url=' + data['url'], function (data) {
                    if (data == "")
                        console.log("get 2");
                        $.get('http://seblopezcot.pythonanywhere.com/?url=' + s, function (data) {
                            
                            json = JSON.parse(data);
                            console.log(json);
                            localStorage.setItem('isbn', json.isbn + "");
                            localStorage.setItem('title', json.title + "");
                            localStorage.setItem('author', json.contributors[0] + "");
                            localStorage.setItem('rating', json.rating + "");
                            localStorage.setItem('imgurl', json.image_url + "");
                            window.location = 'results.html';
                        });
                    console.log("get 1");
                    json = JSON.parse(data);
                    console.log(json);
                    localStorage.setItem('isbn', json.isbn + "");
                    localStorage.setItem('title', json.title + "");
                    localStorage.setItem('author', json.contributors[0] + "");
                    localStorage.setItem('rating', json.rating + "");
                    localStorage.setItem('imgurl', json.image_url + "");
                    console.log("transition");
                    window.location = 'results.html';
                });


            }
        });
        console.log("camera success");
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}
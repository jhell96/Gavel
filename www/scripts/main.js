function check() {
    console.log('here');
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
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
                console.log('http://seblopezcot.pythonanywhere.com/?url=' + data['url']);
                $.get('http://seblopezcot.pythonanywhere.com/?url=' + data['url'], function (data) {
                    json = JSON.parse(data);
                    console.log(json.isbn + "");
                    localStorage.setItem('isbn', json.isbn + "");
                    localStorage.setItem('title', json.title + "");
                    localStorage.setItem('author', json.contributors[0] + "");
                    localStorage.setItem('rating', json.rating + "");
                    localStorage.setItem('imgurl', json.image_url + "");
                    console.log("transition attempt");
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
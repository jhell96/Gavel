Dropzone.autoDiscover = false;
var dzone1 = new Dropzone("#dropzone-feed1", {
    acceptedFiles: "image/jpeg",
    maxFiles: 1, // Number of files at a time
    maxFilesize: 7.5, //in MB
    maxfilesexceeded: function (file) {
        alert('You have uploaded more than 1 Image. Only the first file will be uploaded!');
    },
    autoProcessQueue: false,

    init: function () {
        var submitButton = document.querySelector("#post-prompo-btn1")
        myDropzone = this; // closure

        submitButton.addEventListener("click", function () {
            //myDropzone.processQueue(); // Tell Dropzone to process all queued files.
            if (!window.FileReader)
                alert("Sorry, your browser is unsupported at this time.");
            else {
                var fr = new FileReader();
                fr.onloadend =
                    function () {
                        var Post = Parse.Object.extend("Post");
                        var newPost = new Post();
                        newPost.set("creator", Parse.User.current());
                        var base64 = fr.result;
                        console.log("beginning upload");
                        newPost.set("content_text", $("#upload-title1").val());
                        newPost.save(null, {
                            success: function (x) {
				$.post('http://promly.elasticbeanstalk.com/upload-photo', {
                          	  img: base64,
			  	  id: newPost.id
                     	    }, function (data) {
                            if (data === 'err') {
                                console.log("upload failure");
                            }
                        });

                            },
                            error: function (x, error) {
                                // Execute any logic that should take place if the save fails.
                                // error is a Parse.Error with an error code and message.
                                alert('Failed to create new object, with error code: ' + error.message);
                            }
                        });
                    };
                fr.readAsDataURL(dzone1.getQueuedFiles()[0]);
                //newPost.set("parent", null);
            }
        });

        // You might want to show the submit button only when 
        // files are dropped here:
        this.on("addedfile", function () {
            $("#post-prompo-btn1").removeClass("disabled");
        });
    }
});


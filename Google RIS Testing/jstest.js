var success = function (data){
  console.log("response recieved");
  $("main").html(data);
}
$.get({
  url: "https://www.googleapis.com/customsearch/v1?key=AIzaSyAlmwkIlES-eC1J5M7EXnNln9YSJkAG5qw&cx=015086766151602267019:nwjehdn1jq8&q=book",
  success: success
});

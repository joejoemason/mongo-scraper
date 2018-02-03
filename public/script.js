
$(document).on("click", ".scrape", function(){
    $.get("/scrape", function (req, res) {
        console.log(res);
    }).then(function(data) {
        window.location.href = "/";
    });
  });


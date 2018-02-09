
//Click to scrape
$(document).on("click", ".scrape", function(){
    $(".load").html("<img id='wait' src='./img/loading.gif'>");
    $.get( "/scrape", function (req, res) {
        console.log(res);
    }).then(function(data) {
        window.location.href = "/";
    });
});

$(document).on("click", ".home", function(){
    $.get( "/", function (req, res) {
        console.log(res);
    }).then(function(data) {
        window.location.href = "/";
    });
});

//Click to save article
$(document).on("click", ".save", function(e){
    $(this).parent().remove();
    var articleId = $(this).attr("data-id");
    $.ajax({
        url: '/save/' + articleId,
        type: "POST"
    }).done(function(data) {
        $(".article").filter("[data-id='" + articleId + "']").remove();
    });
});

//Click to view saved article
$(document).on("click", ".saved", function() {
    $.get( "/saved", function (req, res) {
        console.log(res);
    }).then(function(data) {
        window.location.href = "/saved";
    });
  });

//Click to delete article after being saved
$(document).on("click", ".unsave", function(e){
    $(this).parent().remove();
    var articleId = $(this).attr("data-id");
    $.ajax({
        url: '/unsave/' + articleId,
        type: "POST"
    }).done(function(data) {
        $(".article").filter("[data-id='" + articleId + "']").remove();
    });
})

//click event to open note modal and populate with notes
$(document).on('click', '.addNote', function (e){
  // $("#notes").empty();
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/getNotes/" + thisId
    }).then(function(data){
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // Add area to display the notes
        $("#notes").append("<p id='notes'>" + data.note.title + "</p>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<input id='bodyinput' name='body'></input>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

          //Empty input areas
          $("#titleinput").val("");
          $("#bodyinput").val("");
      });
      $('#noteModal').modal('show');
  });//end of .addNote click event

  //click event to create a note
  $(document).on('click', '#savenote', function (e) {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/createNote/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });//end of #submitNote click event

  //keypress event to allow user to submit note with enter key
  $(document).on('keypress', '#noteBodyEntry', function (e) {
    if(e.keyCode == 13){
      sendNote($(this));
    }
  });//end of #noteBodyEntry keypress(enter) event

//click event to delete a note from a saved article
$(document).on('click', '.deleteNote', function (e){
    e.stopPropagation();
    let thisItem = $(this);
    let ids= {
      noteId: $(this).parent().data('note-id'),
      articleId: $(this).parent().data('article-id')
    }

    $.ajax({
      url: '/deleteNote',
      type: 'POST',
      data: ids,
      success: function (response) {
        thisItem.parent().remove();
      },
      error: function (error) {
        console.log(error);
      }
    });
  });//end of .deleteNote click event

  //click event to retrieve the title and body of a single note
  //and populate the note modal inputs with it
  $(document).on('click', '.note', function (e){
    e.stopPropagation();
    let id = $(this).data('note-id');
    $.ajax({
      url: '/getSingleNote/'+id,
      type: 'GET',
      success: function (note) {
        $('#noteTitleEntry').val(note.title);
        $('#noteBodyEntry').val(note.body);
      },
      error: function (error) {
        console.log(error)
      }
    })
  })//end of .note click event


//Click to scrape
$(document).on("click", ".scrape", function(){
    $(".articles").html("<img id='wait' src='./img/loading.gif'>");
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


//function to post a note to server
function sendNote(element) {
    let note = {};
    note.articleId = $(element).attr('data-id'),
    note.title = $('#noteTitleEntry').val().trim();
    note.body = $('#noteBodyEntry').val().trim();
    if (note.title && note.body){
      $.ajax({
        url: '/createNote',
        type: 'POST',
        data: note,
        success: function (response){
          showNote(response, note.articleId);
          $('#noteBodyEntry, #noteTitleEntry').val('');
        },
        error: function (error) {
          console.log(error);
        }
      });
    }
  }//end of sendNote function

//function to display notes in notemodal
function showNote(element, articleId){
    let $title = $('<p>')
      .text(element.title)
      .addClass('noteTitle')
    let $deleteButton = $('<button>')
      .text('X')
      .addClass('deleteNote');
    let $note = $('<div>')
      .append($deleteButton, $title)
      .attr('data-note-id', element._id)
      .attr('data-article-id', articleId)
      .addClass('note')
      .appendTo('#noteArea')
  }//end of showNote function

//click event to open note modal and populate with notes
$(document).on('click', '.addNote', function (e){
    $('#noteArea').empty();
    $('#noteTitleEntry, #noteBodyEntry').val('');
    var id = $(this).attr("data-id");
    $('#submitNote, #noteBodyEntry').attr('data-id', id)
    $.ajax({
      url: '/getNotes/' + id,
      type: 'GET',
      success: function (data){
        $.each(data.notes, function (i, item){
          showNote(item, id)
        });
        $('#noteModal').modal('show');
      },
      error: function (error) {
        console.log(error);
      }
    });
  });//end of .addNote click event

  //click event to create a note
  $(document).on('click', '#submitNote', function (e) {
    e.preventDefault();
    sendNote($(this));
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

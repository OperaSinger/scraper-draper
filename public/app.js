// Function that Loads notes onto the page
function getNotes() {
  // Grab all of the current notes
  $.get("/notes", function (data) {
    console.log(data);
    $(".note").empty();
    for (var i = 0; i < data.length; i++) {
      $(".note").append(`<h4>${data[i].title}</h4>`)
      $(".note").append(`<p>${data[i].body} </p>`)
    }
    $(".title").val("");
    $(".body").val("");

  });
}

// When the #make-new button is clicked
$(document).on("click", "#make-new", function () {
  // AJAX POST call to the submit route on the server
  // This will take the data from the form and send it to the server
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/submit",
    data: {
      title: $("#title").val(),
      body: $("#body").val(),
      created: Date.now()
    }
  })
    .then(function (data) {
     
      // Run the getNotes function to refresh the Notes posted

      getNotes();

      console.log(data);
    });
});

getNotes();



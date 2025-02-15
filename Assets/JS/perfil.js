//Like Interactions
$(document).ready(function () {
  $(".like-button").on("click", function () {
    let likeCount = $(this).find(".like-count");
    let likes = parseInt(likeCount.text());
    if ($(this).hasClass("liked")) {
      likes--;
      $(this).removeClass("liked btn-danger").addClass("btn-outline-danger");
    } else {
      likes++;
      $(this).addClass("liked btn-danger").removeClass("btn-outline-danger");
    }
    likeCount.text(likes);
  });
});

// Fondo Dinámico
$(document).ready(function () {
  var randomNumber = Math.floor(Math.random() * 1000);
  var imageUrl = "https://picsum.photos/1920/1080?random=" + randomNumber;
  $("body").css("background-image", "url(" + imageUrl + ")");
});

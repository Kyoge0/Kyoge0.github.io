$(document).ready(function () {
  // Verificar si el usuario está logeado
  var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    alert("Debes iniciar sesión para ver el timeline.");
    window.location.href = "login.html";
  }

  // Mostrar foto de perfil fija
  $("#profileIcon").attr("src", "https://i.pravatar.cc/150?img=7");
  $("#profileIcon").on("click", function () {
    window.location.href = "perfil.html";
  });

  // Recuperar posts que han recibido like desde LocalStorage
  var likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];

  $(".like-btn").each(function () {
    var $btn = $(this);
    var postId = $btn.closest(".card").index(); // Obtener índice del post
    var likeCount = $btn.find(".like-count");
    var likes = parseInt($btn.attr("data-likes")); // Obtener cantidad inicial de likes

    // Si el post ya tiene like, actualizar estilo
    if (likedPosts.includes(postId)) {
      $btn.addClass("liked btn-danger").removeClass("btn-outline-danger");
    }

    // Evento de click en el botón de like
    $btn.on("click", function () {
      if ($btn.hasClass("liked")) {
        likes--; // Quitar like
        $btn.removeClass("liked btn-danger").addClass("btn-outline-danger");
        likedPosts = likedPosts.filter((id) => id !== postId);
      } else {
        likes++; // Dar like
        $btn.addClass("liked btn-danger").removeClass("btn-outline-danger");
        likedPosts.push(postId);
      }

      // Guardar en LocalStorage
      localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
      likeCount.text(likes); // Actualizar número de likes
      $btn.attr("data-likes", likes); // Actualizar atributo de datos
    });
  });
});

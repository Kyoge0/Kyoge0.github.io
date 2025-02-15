$(document).ready(function () {
  $("#loginForm").on("submit", function (event) {
    event.preventDefault();
    var username = $("#username").val().trim();
    var password = $("#password").val().trim();
    
    if (username === "" || password === "") {
      alert("Por favor, completa todos los campos.");
    } else if (username === "demoUser" && password === "demoPass") {
      alert("Login exitoso. Redirigiendo al timeline...");
      // Guardar sesión en Local Storage
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          username: "demoUser",
          fullName: "Demo User",
          profilePic: "https://i.pravatar.cc/150?img=3",
        })
      );
      window.location.href = "timeline.html";
    } else {
      alert("Usuario o contraseña incorrectos.");
    }
  });

  // Genera un número aleatorio para obtener una imagen diferente cada vez
  var randomNumber = Math.floor(Math.random() * 1000);
  var imageUrl = "https://picsum.photos/1920/1080?random=" + randomNumber;
  $("body").css("background-image", "url(" + imageUrl + ")");
});

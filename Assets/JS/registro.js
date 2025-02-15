$(document).ready(function () {
  // Mostrar input si selecciona "Otro"
  $("#genero").on("change", function () {
    if ($(this).val() === "Otro") {
      $("#genero-especifico").show().attr("required", true);
    } else {
      $("#genero-especifico").hide().val("").removeAttr("required");
    }
  });

  // Validación del formulario
  $("#registroForm").on("submit", function (event) {
    event.preventDefault();

    let password = $("#password").val();
    let confirmPassword = $("#confirm-password").val();
    let email = $("#email").val().trim();
    let fechaNacimiento = $("#fecha-nacimiento").val();

    // Verificar coincidencia de passwords
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Validación de Email
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Por favor ingresa un email válido.");
      return;
    }

    // Validación de fecha de nacimiento (mínimo 18 años)
    let dob = new Date(fechaNacimiento);
    let hoy = new Date();
    let edad = hoy.getFullYear() - dob.getFullYear();
    let mes = hoy.getMonth() - dob.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < dob.getDate())) {
      edad--;
    }
    if (edad < 18) {
      alert("Debes tener al menos 18 años para registrarte.");
      return;
    }

    alert("Registro exitoso. ¡Bienvenido a Socialify!");
    window.location.href = "index.html";
  });
});

$(document).ready(function () {
  var randomNumber = Math.floor(Math.random() * 1000);
  var imageUrl = "https://picsum.photos/1920/1080?random=" + randomNumber;
  $("body").css("background-image", "url(" + imageUrl + ")");
});

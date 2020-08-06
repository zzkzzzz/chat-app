const socket = io();

// elements
const $messageForm = document.querySelector("#message-from");
const $messageFormInput = document.querySelector("#message-form-input");
const $messgaeFromButton = document.querySelector("#message-form-button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// template
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message,
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (url) => {
  console.log(url);
  const html = Mustache.render(locationTemplate, { url });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $messgaeFromButton.setAttribute("disabled", "disabled");
  $messageFormInput.focus();

  const message = $messageFormInput.value;

  socket.emit("sendMessage", message, (error) => {
    $messgaeFromButton.removeAttribute("disabled");
    if (error) {
      console.log(error);
    }
    console.log("message delivered");
  });

  $messageFormInput.value = "";
});

$sendLocationButton.addEventListener("click", (e) => {
  $sendLocationButton.setAttribute("disabled", "disabled");
  if (!navigator.geolocation) {
    return alert("geolocation is not supported by your browser");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const location = {
      longitude: position.coords.longitude,
      latitude: position.coords.latitude,
    };
    socket.emit("sendLocation", location, () => {
      $sendLocationButton.removeAttribute("disabled");
      console.log("Location shared");
    });
  });
});

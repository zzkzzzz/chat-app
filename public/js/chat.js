const socket = io();

// elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = document.querySelector("#message-form-input");
const $messgaeFromButton = document.querySelector("#message-form-button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// template
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-message-template")
  .innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  // new message element
  const $newMessage = $messages.lastElementChild;

  // height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // visible height
  const visibleHeight = $messages.offsetHeight;

  // height of the container
  const containerHeight = $messages.scrollHeight;

  // how far have i scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });

  document.querySelector("#sidebar").innerHTML = html;
});

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (message) => {
  console.log(message);
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
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

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

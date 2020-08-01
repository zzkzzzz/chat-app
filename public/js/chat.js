const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

const messageInput = document.querySelector("#message");

document.querySelector("#send").addEventListener("click", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  socket.emit("sendMessage", message);
  messageInput.value = "";
});

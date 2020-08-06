# Notes

- HTML link `<a>`
  - target attribute specifies where to open the linked document.
  - `target="_blank"` Opens the document in a new window or tab
  - `target="_self"`  Default. Opens the document in the same window/tab as it was clicked
- [socket](https://socket.io/)
- [moment.js](https://momentjs.com/)
  - `moment().format("h:mm a"),`
- auto-scroll
  ``` javascript 
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
```

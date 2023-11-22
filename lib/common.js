function showMessage(element, timeout) {
  element.classList.remove("hidden");
  setTimeout((timeout) => {
    element.classList.add("hidden");
  }, timeout * 1000);
}

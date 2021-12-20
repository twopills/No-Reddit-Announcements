// Pure JS:
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("shadowBox").addEventListener("click", handler);
});

// The handler also must go in a .js file
function handler() {
  console.log("clicked");
}

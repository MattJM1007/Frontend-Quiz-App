// "use strict";

// On page load - check localStorage or system preference
const themeToggle = document.querySelector(".toggle-switch input");
const savedTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const theme = savedTheme || systemTheme;
themeToggle.checked = theme === "dark";
document.documentElement.setAttribute("data-theme", theme);

// On toggle
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const newTheme = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

themeToggle.addEventListener("change", toggleTheme);

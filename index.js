"use strict";

// On page load - check localStorage or system preference
const savedTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const theme = savedTheme || systemTheme;

document.body.setAttribute("data-theme", theme);

// On toggle
function toggleTheme() {
  const current = document.body.getAttribute("data-theme");
  const newTheme = current === "light" ? "dark" : "light";
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

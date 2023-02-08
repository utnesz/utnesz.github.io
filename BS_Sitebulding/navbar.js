'use strict'

const navbar = document.querySelector(".navbar");
const navBrand = document.querySelector(".navbar .navbar-brand");
const navItem = document.querySelectorAll(".navbar-nav .nav-item");
const navbarToggler = document.querySelector(".navbar-toggler");
const fixNavBar = document.querySelector(".fixNavBar");
const navLink1 = document.querySelector(".nav-link1");
const navLink2 = document.querySelector(".nav-link2");
const navLink3 = document.querySelector(".nav-link3");


window.addEventListener("scroll", () => {
    if (window.scrollY !== 0) {
        navbar.style.backgroundColor = "white";
        fixNavBar.style.backgroundColor = "white";
        navBrand.classList.add("buzz");
        navbarToggler.classList.add("buzz");
        navbarToggler.style.borderColor = "black";
        navLink1.classList.add("buzz");
        navLink2.classList.add("buzz");
        navLink3.classList.add("buzz");



    } else {
        navbar.style.backgroundColor = "rgba(0,0,0,0)";
        fixNavBar.style.backgroundColor = "rgba(0,0,0,0)";
        navBrand.classList.remove("buzz");
        navbarToggler.classList.remove("buzz");
        navbarToggler.style.borderColor = "rgba(209, 197, 207)";
        navLink1.classList.remove("buzz");
        navLink2.classList.remove("buzz");
        navLink3.classList.remove("buzz");
    }
});



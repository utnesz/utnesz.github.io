import pictures from "./pix1.js";

const counter = document.querySelector(".counter");
const arrow_left = document.querySelector(".arrow_left");
const imgCont = document.querySelector(".imgCont");
const arrow_right = document.querySelector(".arrow_right");
const tag = document.querySelector(".tag")
const hops = Array.from(document.querySelectorAll(".hop"));

let img_main;

let picId = 0;

hops.forEach((hop, i) => hop.addEventListener("click", () => {
    steps(i);
})
);

const imgTemplate = `<img class="inner_image" src="" alt="beer" />`;

imgCont.innerHTML += imgTemplate;
img_main = document.querySelector(".inner_image");

img_main.setAttribute("src", pictures[0].src);


console.log(counter)

arrow_right.addEventListener("click", () => {
    picId === pictures.length - 1 ? picId = 0 : picId++;
    steps(picId);

});

arrow_left.addEventListener("click", () => {
    picId === 0 ? picId = pictures.length - 1 : picId--;
    steps(picId);
});

//Steps logic

const steps = (picId) => {
    hops.forEach((hop) =>
    hop.setAttribute("style", "opacity: 1"));

    imgCont.classList.add("fade");

    img_main.setAttribute("src", pictures[picId].src);

    counter.innerHTML = `${picId + 1}/${pictures.length}`;

    tag.innerHTML = (pictures[picId].tag);

    hops[picId].setAttribute("style", "opacity: 0.2");

    setTimeout(() => {
        imgCont.classList.remove("fade");
    }, 1000);
}

// Timer

setInterval(() => {
    picId === pictures.length - 1 ? picId = 0 : picId++;
    steps(picId);
}, 4500);


'use strict'

// Modal

const modal = document.getElementById("delModal");
const btn = document.getElementById("mbutton");
const span = document.getElementsByClassName("close")[0];
const btnok = document.getElementsByClassName("button-ok")[0];

let editBtn;
let delBtn;
let btnGroup;
let banBtn;
let ban2Btn

let keys = ["id", "name", "email", "rating", "address"];

// GET method

function getServerData(url) {
    let fetchOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache"
    };

    return fetch(url, fetchOptions).then(
        response => response.json(),
        err => console.error(err)
    )
}

function startGetUsers() {
    getServerData("https://nettuts.hu/jms/utnes/customers").then(
        data => fillDataTable(data, "usersTable")
    );
}

startGetUsers();

//Fill table with users

function fillDataTable(data, tableID) {
    let table = document.querySelector(`#${tableID}`);
    if (!table) {
        console.error(`Table "${tableID}" is not exist.`)
        return;
    }

    // Add new user row

    let tBody = table.querySelector("tbody");
    tBody.innerHTML = '';
    let newRow = addUserRow();
    tBody.appendChild(newRow);

    for (let row of data) {
        let tr = createAnyElement("tr", {
            class: "table"
        });
        for (let k of keys) {
            let td = createAnyElement("td");
            let input = createAnyElement("input", {
                class: "input border border-secondary rounded form-control border-1",
                value: row[k],
                name: k,
                readOnly: true,
            });
            tr.appendChild(td);
            td.appendChild(input);
        }
        let btnGroup = createBtnGroup();
        tr.appendChild(btnGroup);
        tBody.appendChild(tr);
    }
    editBtn = document.querySelectorAll(".btn-edit");
    delBtn = document.querySelectorAll(".btn-del");
    btnGroup = document.querySelectorAll(".btn-group")
    banBtn = document.querySelectorAll(".btn-ban")
    ban2Btn = document.querySelectorAll(".btn-ban2")

}


function createAnyElement(name, attributes) {
    let element = document.createElement(name);
    for (let k in attributes) {
        element.setAttribute(k, attributes[k]);
    }
    return element;
}



function createBtnGroup() {

    let group = createAnyElement("div", {
        class: "btn-group"
    });

    let editBtn = createAnyElement("button", {
        class: "btn-edit btn text-light",
        onclick: "editUser(this)",
    });
    editBtn.innerHTML = `<i class="fa fa-pencil" aria-hidden="true"></i>`;

    let deleteBtn = createAnyElement("button", {
        class: "btn-del btn text-light",
        onclick: "delUser(this)"
    });
    deleteBtn.innerHTML = `<i class="fa fa-trash-o" aria-hidden="true"></i>`;

    let saveBtn = createAnyElement("button", {
        class: "btn-save btn text-light",
        onclick: "saveUser(this)",
        style: "visibility: hidden"
    });
    saveBtn.innerHTML = `<i class="fa fa-save" aria-hidden="true"></i>`;

    let undoBtn = createAnyElement("button", {
        class: "btn-undo btn text-light",
        onclick: "undoUser(this)",
        style: "visibility: hidden"
    });
    undoBtn.innerHTML = `<i class="fa fa-undo" aria-hidden="true"></i>`;

    let banBtn = createAnyElement("button", {
        class: "btn-ban btn text-light",
        onclick: "alertModal()",
        style: "display: none"
    });
    banBtn.innerHTML = `<i class="fa fa-pencil" aria-hidden="true"></i>`;

    let ban2Btn = createAnyElement("button", {
        class: "btn-ban2 btn text-light",
        onclick: "alertModal()",
        style: "display: none"
    });
    ban2Btn.innerHTML = `<i class="fa fa-trash-o" aria-hidden="true"></i>`;

    group.appendChild(editBtn)
    group.appendChild(deleteBtn)
    group.appendChild(saveBtn)
    group.appendChild(undoBtn)
    group.appendChild(banBtn)
    group.appendChild(ban2Btn)


    let td = createAnyElement("td");
    td.appendChild(group);
    return td;
};


//Button functions


//Edit user

const editUser = (btn) => {
    let tr = btn.parentElement.parentElement.parentElement;
    Array.from(tr.children).forEach(td => td.children[0].readOnly = false)

    const name = tr.children[1].children[0].value
    const email = tr.children[2].children[0].value
    const ratings = tr.children[3].children[0].value
    const address = tr.children[4].children[0].value

    btn.style.visibility = "hidden";
    btn.parentElement.children[1].style.visibility = "hidden";
    btn.parentElement.children[2].style.visibility = "visible";
    btn.parentElement.children[3].style.visibility = "visible";
    btn.parentElement.children[4].style.visibility = "hidden";
    btn.parentElement.children[5].style.visibility = "hidden";

    editBtn.forEach(btn => (btn.parentElement.children[0].style.visibility = "hidden"));
    delBtn.forEach(btn => (btn.parentElement.children[1].style.visibility = "hidden"));
}


//Save user

function saveUser(btn) {

    let tr = btn.parentElement.parentElement.parentElement;
    Array.from(tr.children).forEach(td => td.children[0].readOnly = true);
    const name = tr.children[1].children[0].value
    const email = tr.children[2].children[0].value
    const ratings = tr.children[3].children[0].value
    const address = tr.children[4].children[0].value

    btn.style.visibility = "hidden";
    btn.parentElement.children[3].style.visibility = "hidden";
    btn.parentElement.children[0].style.visibility = "visible";
    btn.parentElement.children[1].style.visibility = "visible";

    const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isValidName = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
    const isValidRatings = /^[1-5]$/;
    const isVAlidAddress = /[\w',-\\/.\s]/;

    const nameMatch = name.match(isValidName);
    const emailMatch = email.match(isValidEmail);
    const ratingsMatch = ratings.match(isValidRatings);
    const addressMatch = address.match(isVAlidAddress);


    if (nameMatch && emailMatch && ratingsMatch && addressMatch) {
        okModal();
        let data = getRowData(tr);
        let id = tr.children[0].children[0].value;
        let fetchOptions = {
            method: "PUT",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        fetch(`https://nettuts.hu/jms/utnes/customers/${id}`, fetchOptions).then(
            resp => resp.json(),
            err => console.error(err)
        ).then(
            data => startGetUsers(data)
        );

    } else if (!nameMatch && emailMatch && addressMatch && ratingsMatch) {
        nameModal();
        undoUser();
    } else if (nameMatch && !emailMatch && addressMatch && ratingsMatch) {
        emailModal();
        undoUser();
    } else if (nameMatch && emailMatch && !addressMatch && ratingsMatch) {
        addressModal();
        undoUser();
    } else if (nameMatch && emailMatch && addressMatch && !ratingsMatch) {
        ratingsModal();
        undoUser();
    } else {
        validModal();
        undoUser();
    }
};



//Undo user

function undoUser(btn) {
    let tr = btn.parentElement.parentElement.parentElement;
    Array.from(tr.children).forEach(td => td.children[0].readOnly = true);
    const name = tr.children[1].children[0].value
    const email = tr.children[2].children[0].value
    const ratings = tr.children[3].children[0].value
    const address = tr.children[4].children[0].value

    btn.style.visibility = "hidden";
    btn.parentElement.children[2].style.visibility = "hidden";
    btn.parentElement.children[0].style.visibility = "visible";
    btn.parentElement.children[1].style.visibility = "visible";
    startGetUsers();
}



//Delete user

function delUser(btn) {
    let tr = btn.parentElement.parentElement.parentElement;
    let id = tr.children[0].children[0].value;
    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache"
    };

    fetch(`https://nettuts.hu/jms/utnes/customers/${id}`, fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    ).then(
        data => {
            startGetUsers();
        }
    );
    delModal();
}


// New User

function addUserRow(row) {

    let tr = createAnyElement("tr");

    for (let k of keys) {
        let td = createAnyElement("td");

        let input = createAnyElement("input", {
            class: "input rounded border-secondary border-2",
            name: k,
            placeholder: "Add new data..."

        });
        td.appendChild(input);
        tr.appendChild(td);
    }

    let newBtn = createAnyElement("button", {
        class: "newUser btn text-light text-center",
        onclick: "createUser(this)"
    });

    newBtn.innerHTML = `<i class="fa fa-plus-square" aria-hidden="true"></i>`;

    let td = createAnyElement("td");

    td.appendChild(newBtn);
    tr.appendChild(td);

    return tr;
}

function createUser(btn) {
    let tr = btn.parentElement.parentElement;
    let data = getRowData(tr);
    delete data.id;



    Array.from(tr.children).forEach(td => td.children[0].readOnly = true);
    const name = tr.children[1].children[0].value
    const email = tr.children[2].children[0].value
    const ratings = tr.children[3].children[0].value
    const address = tr.children[4].children[0].value

    const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const isValidName = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
    const isValidRatings = /^[1-5]$/;
    const isVAlidAddress = /[\w',-\\/.\s]/;


    const nameMatch = name.match(isValidName);
    const emailMatch = email.match(isValidEmail);
    const ratingsMatch = ratings.match(isValidRatings);
    const addressMatch = address.match(isVAlidAddress);

    if (nameMatch && emailMatch && ratingsMatch && addressMatch) {
        newUserModal();

        let fetchOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        fetch(`https://nettuts.hu/jms/utnes/customers`, fetchOptions).then(
            resp => resp.json(),
            err => console.error(err)
        ).then(
            (data) => { startGetUsers() }
        );

    } else if (!nameMatch && emailMatch && addressMatch && ratingsMatch) {
        nameModal();
    } else if (nameMatch && !emailMatch && addressMatch && ratingsMatch) {
        emailModal();
    } else if (nameMatch && emailMatch && !addressMatch && ratingsMatch) {
        addressModal();
    } else if (nameMatch && emailMatch && addressMatch && !ratingsMatch) {
        ratingsModal();
    } else {
        validModal();
    }
}

function getRowData(tr) {
    let inputs = tr.querySelectorAll("input");
    let data = {};
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].name !== 'id') {
            data[inputs[i].name] = inputs[i].value;
        }
    }

    return data;
}


const modalId = document.getElementById("modalText");


// - Modal main

const modals = () => {
    modal.style.display = "block";
    setInterval(function () {
        modal.style.display = "none";
    }, 5000);
};
span.onclick = function () {
    modal.style.display = "none";
    window.location.reload();
};
btnok.onclick = function () {
    modal.style.display = "none";
    window.location.reload();
};

window.onclick = function (event) {
    if (event.target == modal) {
        (modal.style.display = "none");
        window.location.reload();
    }
};


const delModal = () => {
    modalId.innerHTML = `<p id="modalText" class="Modal__text text-success"> User deleted!</p>`;
    modals();
}

const validModal = () => {
    modalId.innerHTML = `<p id="modalText" class="Modal__text red">Please add valid data!</p>`;
    modals();
};

const nameModal = () => {
    modalId.innerHTML = `<p id="modalText" class="Modal__text red">Please add valid username!</p>`;
    modals();
};

const emailModal = () => {
    modalId.innerHTML = `<p id="modalText" class="Modal__text red">Please add valid email address!</p>`;
    modals();
};

const addressModal = () => {
    modalId.innerHTML = `<p id="modalText" class="Modal__text red">Please add valid address</p>`;
    modals();
};
const ratingsModal = () => {
    modalId.innerHTML = `<p id="modalText" class="Modal__text red">Ratings canb only numbers between 1-4!</p>`;
    modals();
};

const okModal = () => {
    modalId.innerHTML = `<p id="modalText" class="Modal__text green">User saved successfully!</p>`;
    modals();
};

const newUserModal = () => {
    modalId.innerHTML = `<p id="modalText green" class="Modal__text green">New user added successfully!</p>`;
    modals();
};

const alertModal = () => {
    modalId.innerHTML = `<p id="modalText green" class="Modal__text red">Please finish the editing first!</p>`;
    modals();
};
const apiUrl = 'https://api.github.com/users/';

const main = document.querySelector('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

//Get users from GitHub API

async function getUser(username) {
    try {
        const { data } = await axios(apiUrl + username)
        createUserCard(data)
        getRepos(username)
    } catch (err) {
        if (err.response.status == 404) {
            createErrorCard('Eeee... profile not found with this username')
        }
    }
}

//Get repos of user from GitHub API

async function getRepos(username) {
    try {
        const { data } = await axios(apiUrl + username + '/repos?sort=created')

        addReposToCard(data);
    } catch (err) {
        createErrorCard('Problem fething repos')
    }
}

//Search logic

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value
    if (user) {
        getUser(user)
        search.value = '';
    }

})


//Create User card into the DOM

//Data of users

function createUserCard(user) {
    const cardHTML = `<div class="card">
        <div>
          <img
            src="${user.avatar_url}"
            alt="${user.name}"
            class="avatar"
          />
        </div>
        <div class="user-info">
          <h2>${user.name  }<h4>/ as ${user.login}</h4></h2>
          <p>
            ${user.bio}
          </p>

          <ul>
            <li>${user.followers}<strong>Followers</strong></li>
            <li>${user.following}<strong>Following</strong></li>
            <li>${user.public_repos}<strong>Repos</strong></li>
          </ul>

          <div id="repos"></div>
        </div>
      </div>`

    main.innerHTML = cardHTML
}

//Data of repos

function addReposToCard(repos) {
    const reposLmnt = document.getElementById('repos')

    repos
        .slice(0, 7)
        .forEach(repo => {
            const repoLmnt = document.createElement('a')
            repoLmnt.classList.add('repo')
            repoLmnt.href = repo.html_url
            repoLmnt.target = '_blank'
            repoLmnt.innerText = repo.name

            reposLmnt.appendChild(repoLmnt)
        })
}


//Create error message card into the DOM

function createErrorCard(msg) {
    const cardHTML = `
    <div class="card">
    <h1>${msg}
    </h1>
    </div>
    `
    main.innerHTML = cardHTML
}
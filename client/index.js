const API_URL = window.location.hostname == 'localhost' || window.location.hostname == '127.0.0.1' ? 'http://localhost:3100/' : 'https://45.88.109.32:1771/';

window.addEventListener('load', () => {
    window.cookieconsent.initialise({
        palette: {
            popup: {
                background: '#252e39',
            },
            button: {
                background: '#14a7d0',
            },
        },
        theme: 'classic',
        position: 'bottom-right',
        // revokable: true,
        content: {
            message: `This website uses cookies, to deliver you the best possible experience! /
            <br/> 
            Diese Website verwendet Cookies, um Ihnen das bestmögliche Erlebnis zu bieten!`,
            dismiss: 'Einverstanden / Agree',
            link: 'Mehr über Cookies / More about Cookies',
        },
    });
});

let html = `<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
<div class="container-fluid">
    <a class="navbar-brand" href="index.html">HosterList</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
<span class="navbar-toggler-icon"></span>
</button>

    <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav me-auto">
            <li class="nav-item">
                <a class="nav-link active" href="list.html">Hosters</a>
            </li>
        </ul>
`;

if (getCookie('auth-token')) {
    let username = getCookie('username');
    html += `   <div class="d-flex">
                    <a href="#" class="btn my-2 my-sm-0 text-white" style="margin-right: 25px;">${username}</a>
                    <button class="btn btn-danger my-2 my-sm-0" onclick="logout()">Logout</button>
                </div>
            </div>
        </div>
    </nav>`;
} else {
    html += `</div>
    </div>
    </nav>`;
}
document.getElementById('nav').innerHTML = html;

function checkLogged() {
    if (!getCookie('auth-token')) {
        sendto('index.html');
    }
}

function logout() {
    deleteCookie('auth-token');
    sendto('index.html');
}
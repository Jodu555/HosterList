const API_URL = 'http://localhost:3100/';

document.getElementById(
	'nav'
).innerHTML = `<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
<div class="container-fluid">
    <a class="navbar-brand" href="#">HosterList</a>
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
	document.getElementById('nav').innerHTML += `<form class="d-flex">
    <a href="profile.html" class="btn my-2 my-sm-0 text-white" style="margin-right: 25px;">{{username}}</a>
    <button class="btn btn-danger my-2 my-sm-0">Logout</button>
</form>`;
}

document.getElementById('nav').innerHTML += `</div>
</div>
</nav>`;

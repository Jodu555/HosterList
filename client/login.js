const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const alert_login = document.getElementById('alert-login');
const alert_register = document.getElementById('alert-register');

alert_login.style.display = 'none';
alert_register.style.display = 'none';

// alert('login', 'Error', 'Test')

if(getCookie('auth-token')) {
    sendto('list.html');
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
	const obj = formDataToObject(data);

    const response = await fetch(API_URL + 'auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(obj),
	});
    const json = await response.json();

    if(json.success) {
        setCookie('auth-token', json.token, 30);
        setCookie('username', obj.username, 30);
        sendto('list.html');
        loginForm.reset();
    } else {
        alert('login', 'Error', json.message)
    }

    loginForm.reset();
});

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(registerForm);
	const obj = formDataToObject(data);

    console.log(obj);

    const response = await fetch(API_URL + 'auth/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(obj),
	});
    const json = await response.json();

    console.log(json);

    if(json.success) {
        alert('register', 'Success', json.message)
        registerForm.reset();
    } else {
        alert('register', 'Error', json.message)
    }
});

function alert(form, type, message) {
    let alert;
    let alert_type;
    let alert_message;
    if(form.toLowerCase() == 'register') {
        alert = alert_register;
        alert_type = document.getElementById('alert-type-register')
        alert_message = document.getElementById('alert-message-register');
    } else {
        alert = alert_login;
        alert_type = document.getElementById('alert-type-login')
        alert_message = document.getElementById('alert-message-login');
    }

    alert.className = "";
    alert.classList.add('alert');
    alert.classList.add('alert-dismissible');

    if(type.toLowerCase() == 'error') {
        alert.classList.add('alert-danger');
    } else {
        alert.classList.add('alert-success');
    }

    alert_type.innerText = type + ':';
    alert_message.innerText = message;

    alert.style.display = '';
}
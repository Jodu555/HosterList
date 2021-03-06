let currentHoster = {};
const uuid = getURLParam('uuid');
const addServiceForm = document.getElementById('addServiceForm');
const alertElem = document.getElementById('alert');
alertElem.style.display = 'none';

checkLogged();

function alert(message) {
	alertElem.style.display = '';
	document.getElementById('alert-message').innerHTML = message;

	setTimeout(() => {
		alertElem.style.display = 'none';
	}, 10000);
}

addServiceForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	var data = new FormData(addServiceForm);

	const obj = formDataToObject(data);
	obj.hoster_UUID = uuid;
	obj.upgrade_possibillity = obj.upgrade_possibillity ? obj.upgrade_possibillity : 'no';
	obj.uptime_percentage = obj.uptime_percentage + '%';
	obj.testPeriod = obj.start + '  -  ' + obj.end;
	removeKeyFromObject(obj, 'start');
	removeKeyFromObject(obj, 'end');

	const response = await fetch(API_URL + 'service/create', {
		method: 'POST',
		headers: {
			'auth-token': getCookie('auth-token'),
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(obj),
	});
	const json = await response.json();
	if (json.success) {
		loadServices();
	} else {
		if (json.message.includes('auth-token')) {
			deleteCookie('auth-token');
			checkLogged();
		} else {
			alert('Error: ' + json.message);
		}
	}
	$('#createModal').modal('hide');
	var myModal = new bootstrap.Modal(document.getElementById('createModal'), {
		keyboard: false,
	});
	myModal.hide();
	addServiceForm.reset();
});

load();
async function load() {
	await getCurrentHoster();
	document.getElementById('hosterName').innerText = currentHoster.name;
	loadServices();
}
let services = null;
async function loadServices() {
	services = await getServices();
	loadServicesTable(services);
}

async function deleteService(uuid) {
	const { isConfirmed: confirmed } = await Swal.fire({
		title: 'Error!',
		text: 'Do you really want to delete the Hoster?',
		icon: 'warning',
		showCancelButton: true,
		cancelButtonText: 'No im stupid!',
		confirmButtonText: 'Yes im sure!'
	});
	if (confirmed) {
		console.log('Delete: ' + uuid);
		const response = await fetch(API_URL + 'service/delete/' + uuid, {
			method: 'GET',
			headers: {
				'auth-token': getCookie('auth-token'),
			},
		});
		const json = await response.json();
		if (json.success) {
			loadServices();
		} else {
			if (json.message.includes('auth-token')) {
				deleteCookie('auth-token');
				checkLogged();
			} else {
				alert('Error: ' + json.message);
			}
		}
	}
}

function viewService(uuid) {
	const neofetch_container = document.getElementById('view_service_neofetch_container');
	let service;
	services.forEach((ser) => {
		if (ser.UUID == uuid) {
			service = ser;
		}
	});
	document.getElementById('view_service_name_title').innerText = service.name;
	document.getElementById('view_service_type').innerText = service.type;
	document.getElementById('view_service_name').innerText = service.name;
	document.getElementById('view_service_virtualisierung').innerText = service.virtualisierung;
	document.getElementById('view_service_swap').innerText = service.swap_RAM;
	document.getElementById('view_service_upgrade').innerText = service.upgrade_possibillity;
	document.getElementById('view_service_uptime').innerText = service.uptime_percentage;
	document.getElementById('view_service_period').innerText = service.testPeriod;

	neofetch_container.innerHTML = '';

	service.neofetch_data.forEach((data) => {
		const neoElem = document.createElement('p');
		neoElem.style.marginBottom = '0rem';
		neoElem.textContent = data;
		neofetch_container.appendChild(neoElem);
	});
	$('#viewModal').modal('show');
}

async function getCurrentHoster() {
	const response = await fetch(API_URL + 'hoster/get/' + uuid, {
		method: 'GET',
		headers: {
			'auth-token': getCookie('auth-token'),
		},
	});
	const json = await response.json();
	if (json.success) {
		currentHoster = json.hoster;
	} else {
		if (json.message.includes('auth-token')) {
			deleteCookie('auth-token');
			checkLogged();
		} else {
			alert('Error: ' + json.message);
		}
	}
}

async function getServices() {
	const services = [];
	const response = await fetch(API_URL + 'service/list', {
		method: 'GET',
		headers: {
			'auth-token': getCookie('auth-token'),
		},
	});
	const json = await response.json();
	if (json.success) {
		json.services.forEach((service) => {
			if (service.hoster_UUID == currentHoster.UUID) {
				services.push(service);
			}
		});
	} else {
		if (json.message.includes('auth-token')) {
			deleteCookie('auth-token');
			checkLogged();
		} else {
			alert('Error: ' + json.message);
		}
	}
	return services;
}

function loadServicesTable(data) {
	let i = 0;
	data.forEach((service) => {
		service.id = ++i;
		service.neofetch_data = JSON.parse(service.neofetch_data);
		service.view = `<button class="btn btn-primary" onclick="viewService('${service.UUID}')">View</button>`;
		service.delete = `<button class="btn btn-danger" onclick="deleteService('${service.UUID}')">Delete</button>`;
	});

	$table = $('#table');

	$table.bootstrapTable('destroy');

	$table.bootstrapTable({
		search: true,
		columns: [
			{
				sortable: true,
				field: 'id',
				title: 'ID',
			},
			{
				sortable: true,
				field: 'type',
				title: 'Type',
			},
			{
				field: 'name',
				title: 'Name',
			},
			{
				sortable: true,
				field: 'virtualisierung',
				title: 'Virtualisierung',
			},
			{
				sortable: true,
				field: 'upgrade_possibillity',
				title: 'Upgrade',
			},
			{
				sortable: true,
				field: 'uptime_percentage',
				title: 'Uptime',
			},
			{
				field: 'testPeriod',
				title: 'Test Period',
			},
			{
				field: 'view',
				title: 'View',
			},
			{
				field: 'delete',
				title: 'Delete',
			},
		],
		data,
	});
}

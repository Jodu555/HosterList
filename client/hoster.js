let currentHoster = {};
const uuid = getURLParam('uuid');
const addServiceForm = document.getElementById('addServiceForm');

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

	await fetch(API_URL + 'service/create', {
		method: 'POST',
		headers: {
			'auth-token': 'DEV-TOKEN-SECRET',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(obj),
	});
	loadServices();

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

function viewService(uuid) {
	const neofetch_container = document.getElementById('view_service_neofetch_container');
	let service;
	services.forEach((ser) => {
		if (ser.UUID == uuid) {
			service = ser;
		}
	});
	console.log(service);
	console.log(document.getElementById('view_service_name'));
	document.getElementById('view_service_name_title').innerText = service.name;
	document.getElementById('view_service_type').innerText = service.type;
	document.getElementById('view_service_name').innerText = service.name;
	document.getElementById('view_service_virtualisierung').innerText = service.virtualisierung;
	document.getElementById('view_service_swap').innerText = service.swap_RAM;
	document.getElementById('view_service_upgrade').innerText = service.upgrade_possibillity;
	document.getElementById('view_service_uptime').innerText = service.uptime_percentage;
	document.getElementById('view_service_period').innerText = service.testPeriod;

	service.neofetch_data.forEach((data) => {
		const neoElem = document.createElement('p');
		neoElem.style.marginBottom = '0rem';
		neoElem.textContent = data;
		neofetch_container.appendChild(neoElem);
	});

	console.log();
	$('#viewModal').modal('show');
}

async function getCurrentHoster() {
	const response = await fetch(API_URL + 'hoster/get/' + uuid, {
		method: 'GET',
		headers: {
			'auth-token': 'DEV-TOKEN-SECRET',
		},
	});
	const json = await response.json();
	if (json.success) {
		currentHoster = json.hoster;
	} else {
		console.log('Error: ' + json.message);
	}
}

async function getServices() {
	const services = [];
	const response = await fetch(API_URL + 'service/list', {
		method: 'GET',
		headers: {
			'auth-token': 'DEV-TOKEN-SECRET',
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
		console.log('Error: ' + json.message);
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

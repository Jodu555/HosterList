let currentHoster = {};
const uuid = getURLParam('uuid');
const addServiceForm = document.getElementById('addServiceForm');

addServiceForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	var data = new FormData(addServiceForm);
	const obj = formDataToObject(data)

	obj.hoster_UUID = uuid;
	obj.upgrade_possibillity = obj.upgrade_possibillity ? obj.upgrade_possibillity : 'no';
	obj.uptime_percentage = obj.uptime_percentage + '%';
	obj.testPeriod = obj.start + '  -  ' + obj.end;
	removeKeyFromObject(obj, "start");
	removeKeyFromObject(obj, "end");

	console.log(obj);

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
        keyboard: false
    })
    myModal.hide()
	
})

load();
async function load() {
	await getCurrentHoster();
    document.getElementById('hosterName').innerText = currentHoster.name;
	loadServices();
}

async function loadServices() {
	const services = await getServices();
	loadServicesTable(services);
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

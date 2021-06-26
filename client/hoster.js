let currentHoster = {};
const uuid = getURLParam('uuid');

load();
async function load() {
	await getCurrentHoster();
    document.getElementById('hosterName').innerText = currentHoster.name;
	const services = await getServices();
	loadServicesTable(services);
}

function getURLParam(param) {
	const url = new URL(window.location.href);
	const value = url.searchParams.get(param);
	return value;
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
	console.log(data);

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

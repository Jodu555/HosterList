let currentHoster = {};
const uuid = getURLParam('uuid');


load();
async function load() {
    await getCurrentHoster();
    const services = await getServices();
    loadServicesTables(services);
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
    if(json.success) {
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
    if(json.success) {
        json.services.forEach(service => {
            if(service.hoster_UUID == currentHoster.UUID) {
                services.push(service);
            }
        });
    } else {
        console.log('Error: ' + json.message);
    }
    return services;
}

function loadServicesTables(data) {
    console.log(data);
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
				field: 'virtualisierung',
				title: 'Virtualisierung',
			},
		],
		data,
	});
}

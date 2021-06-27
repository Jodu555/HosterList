const addHosterForm = document.getElementById('addHosterForm');

checkLogged();

loadHosters();

addHosterForm.addEventListener('submit', async (event) => {
	event.preventDefault();

	var data = new FormData(addHosterForm);
	await fetch(API_URL + 'hoster/create', {
		method: 'POST',
		headers: {
			'auth-token': 'DEV-TOKEN-SECRET',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(formDataToObject(data)),
	});
	$('#editModal').modal('hide');
	var myModal = new bootstrap.Modal(document.getElementById('editModal'), {
		keyboard: false,
	});
	myModal.hide();
	loadHosters();
	addHosterForm.reset();
});

async function deleteHoster(uuid) {
	await fetch(API_URL + 'hoster/delete/' + uuid, {
		method: 'GET',
		headers: {
			'auth-token': 'DEV-TOKEN-SECRET',
		},
	});
	loadHosters();
}

async function loadHosters() {
	const response = await fetch(API_URL + 'hoster/list', {
		method: 'GET',
		headers: {
			'auth-token': 'DEV-TOKEN-SECRET',
		},
	});
	let json = await response.json();
	json = json.hosters;
	let i = 0;

	for (const hoster of json) {
		i++;
		hoster.id = i;
		hoster.name = `<a href="hoster.html?uuid=${hoster.UUID}">${hoster.name}</a>`;
		hoster.services = await getServices(hoster.UUID);
		hoster.delete = `<button class="btn btn-danger" onclick="deleteHoster('${hoster.UUID}')">Delete</button>`;
	}
	await loadTable(json);
}

async function getServices(hosterUUID) {
	const response = await fetch(API_URL + 'service/list/' + hosterUUID, {
		method: 'GET',
		headers: {
			'auth-token': 'DEV-TOKEN-SECRET',
		},
	});
	let json = await response.json();
	return json.services.length;
}

let initial = true;
function loadTable(data) {
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
				field: 'name',
				title: 'Name',
			},
			{
				sortable: true,
				field: 'services',
				title: 'Services',
			},
			{
				field: 'delete',
				title: 'Delete',
			},
		],
		data,
	});
}

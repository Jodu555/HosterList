const addHosterForm = document.getElementById('addHosterForm');

addHosterForm.addEventListener('submit', (event) => {
	event.preventDefault();
	var data = new FormData(addHosterForm);
	fetch(API_URL + 'hoster/create', {
		method: 'POST',
		headers: {
			'auth-token': 'DEV-TOKEN-SECRET',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(formDataToObject(data)),
	});
});

function formDataToObject(formData) {
    const obj = {};
    for (var key of formData.keys()) {
        obj[key] = formData.get(key);
	}
    return obj;
}

loadHosters();

function deleteHoster(uuid) {
    fetch(API_URL + 'hoster/delete/' + uuid, {
		method: 'GET',
		headers: {
			'auth-token': 'DEV-TOKEN-SECRET',
		},
	});
}

async function loadHosters() {
    const response = await fetch(API_URL + 'hoster/list', {
		method: 'GET',
		headers: {
			'auth-token': 'DEV-TOKEN-SECRET',
		},
	});
    const json = await response.json();
    let i = 0;
    json.forEach(hoster => {
        i++;
        hoster.id = i;
        hoster.name = `<a href="hoster.html?uuid=${hoster.UUID}">${hoster.name}</a>`
        hoster.services = -1;
        hoster.delete = `<button class="btn btn-danger" onclick="deleteHoster('${hoster.UUID}')">Delete</button>`
    });
    loadTable(json)
}

function loadTable(data) {
    $('#table').bootstrapTable({
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



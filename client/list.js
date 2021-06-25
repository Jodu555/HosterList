const addHosterForm = document.getElementById('addHosterForm');

addHosterForm.addEventListener('submit', (event) => {
	event.preventDefault();
	var data = new FormData(addHosterForm);
	fetch(API_URL + 'hoster/create', {
		method: 'POST', // or 'PUT'
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
			field: 'tested_services',
			title: 'Tested Services',
		},
	],
	data: [
		{
			id: '1738',
			name: '<a href="hoster.html?id=934">Living-Bots</a>',
			tested_services: '7',
		},
		{
			id: '1738',
			name: '<a href="hoster.html?id=934">Living-Bots</a>',
			tested_services: '7',
		},
	],
});

const keys = [
    'OS',
    'Host',
    'Kernel',
    'Uptime',
    'Packages',
    'Shell',
    'Resolution',
    'Terminal',
    'CPU',
    'GPU',
    'Memory',
];

function parse(data) {
	console.log('Started parsing');
	const cleanedLines = [];
	const output = [];
	const lines = data.split('   ');
	lines.forEach((line) => {
		if (line.trim() !== '') {
			cleanedLines.push(line.split('\r\n')[0].trim());
		}
	});
	cleanedLines.forEach((line) => {
		keys.forEach((key) => {
			if (line.includes(key)) {
				output.push(line);
			}
		});
	});
    return output;
}

module.exports = {
    parse,
}

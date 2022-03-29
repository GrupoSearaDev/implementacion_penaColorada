const papa	 = require('papaparse');
const fs	 = require('fs');

// let allFileNames, data, date;
let allJSON = {};

fs.readdirSync("/home/pi/Documents/node-scripts/JSONs").forEach( doc =>{
	if(doc !=='.txt' && doc.split('_') && doc.split(".") ){
		const jsonDate = doc.split('_')[1].split('.')[0];  // separa bps_2022-03-28.json a solo "2022-03-28"

		if((new Date()).getTime() - jsonDate.getTime() < 518400000){   //compara la fecha de hoy con la de jsonDate, si la diferencia es menor a 6 dias entra al if
			allJSON[doc.fileName].push(doc);
		}
	}
});

const config = {
	quotes: false, //or array of booleans
	quoteChar: '"',
	escapeChar: '"',
	delimiter: ",",
	header: true,
	newline: "\r\n",
	skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
	columns: null //or array of strings
};


Object.keys(allJSON).forEach( file => {
	const CSV = papa.unparse(allJSON[file], config);
	const path = '/home/pi/Documents/node-script/CSVs/' + file;
	fs.writeFileSync(path, CSV);
});


fs.readdirSync("/home/pi/Documents/node-scripts/CSVs").forEach( doc =>{
	if(doc !=='.txt' && doc.split('_') && doc.split(".") ){
		const csvDate = doc.split('_')[1].split('.')[0];  // separa bps_2022-03-28.json a solo "2022-03-28"

		if((new Date()).getTime() - csvDate.getTime() > 864000000){   //compara la fecha de hoy con la de jsonDate, si la diferencia es mayor a 10 dias entra al if
			fs.unlinkSync("/home/pi/Documents/node-script/CSV/"+doc);
		}
	}
});
		
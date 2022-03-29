const papa	 = require('papaparse');
const fs	 = require('fs');

// let allFileNames, data, date;
let allJSON = {};

fs.readdirSync( __dirname + "/JSONs" ).forEach( doc =>{
	if(doc !=='.txt' && doc.split('_') && doc.split(".") ){
		const jsonDate = new Date( doc.split('_')[1].split('.')[0]);
		const custom_json = require(__dirname + '/JSONs/' + doc);
		// separa bps_2022-03-28.json a solo "2022-03-28"

		if((new Date()).getTime() - jsonDate.getTime() < 518400000){  
		//compara la fecha de hoy con la de jsonDate, si la diferencia es menor a 6 dias entra al if
			custom_json.forEach( single_doc => {			
				if(!allJSON[single_doc["fileName"]]){ 
					allJSON[single_doc["fileName"]] = [];
				};
				allJSON[single_doc["fileName"]].push(single_doc);
			});
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
	const path = __dirname + "/CSVs/" + file;
	console.log({path});
	fs.writeFileSync(path, CSV);
});


fs.readdirSync(__dirname + "/CSVs").forEach( doc =>{
	if(doc !=='.txt' && doc.split('_') && doc.split(".") ){
		const csvDate = new Date( doc.split('_')[1].split('.')[0]);  // separa bps_2022-03-28.json a solo "2022-03-28"

		if((new Date()).getTime() - csvDate.getTime() > 864000000){   
			//compara la fecha de hoy con la de csvDate, si la diferencia es mayor a 10 dias entra al if
			fs.unlinkSync(__dirname + "/CSVs/" + doc);
		}
	}
});
		
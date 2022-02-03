const mysql	 = require('mysql2');
const papa	 = require('papaparse');
const fs	 = require('fs');
const connection = mysql.createPool({
	connectionLimit	 : 10,
	host	 : 'localhost',
	user	 : 'my_user',
	password : 'my_password',
	database : 'bps' 
});
let allFileNames, data, date;

	date = '[' + (new Date()).toISOString() + ']: ';
	data =  date + ' ';

	connection.query('SELECT * from bloodpressure;', function (error, results, fields){
		if(error) fs.appendFileSync('error.txt', data);

		allFileNames = new Set( results.map( I => I.fileName ) );
		allFileNames = [...allFileNames];

	for ( let file of allFileNames ){
		const A = `SELECT * FROM bloodpressure WHERE fileName='${file}';`;

		connection.query(A, function (err, res, field){
		if(err) {
			data += err + ' WHERE fileName=' + file + ', ';
			fs.appendFileSync('error.txt', data);
		};
		//console.table(res);
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

		const CSV = papa.unparse(res, config);
		const path = '/home/pi/Documents/node-script/CSVs/' + file;
		fs.writeFileSync(path, CSV);

		const aFewDaysFile = file.split('_')[1].split('.')[0];
		const subs = (new Date()).getTime() - (new Date(date)).getTime();
		const days = subs/ (1000 * 3600 * 24);
			if(subs > 9){
				fs.unlinkSync(path);
			};


		if (allFileNames[allFileNames.length-1] === file){
			connection.end( function (er){
				if(er) {
					data += er +' ENDING CONN, ';
					fs.appendFileSync('error.txt', data)
				};
			});
			console.log('end');
		};

		})
	}
	});

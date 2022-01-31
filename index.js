const mysql	 = require('mysql');
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

	connection.query('SELECT * from bloodpressure;', function (error, results, fields){
		if(error) {
			date = '[' + (new Date()).toISOString() + ']: ';
			data =  date +  + JSON.stringify(error.msg);
			fs.appendFileSync('error.txt', data);
		};

		allFileNames = new Set( results.map( I => I.fileName ) );
		allFileNames = [...allFileNames];

	for ( let file of allFileNames ){
		const A = `SELECT * FROM bloodpressure WHERE fileName='${file}';`;

		connection.query(A, function (err, res, field){
		if(err) {
			date = '[' + (new Date()).toISOString() + ']: WHERE fileName=' + file + ', ';
			data =  date +  + JSON.stringify(err.msg);
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
		fs.writeFileSync('/home/pi/Documents/node-script/CSVs'+file, CSV);

		if (allFileNames[allFileNames.length-1] === file){
			connection.end( function (err1){
		   		console.log({err1});
			});
			console.log('end');
		};

		})
	}
	});

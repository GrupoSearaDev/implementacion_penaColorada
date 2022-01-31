const mysql	 = require('mysql');
const papa	 = require('papaparse');
const fs	 = require('fs');
const connection = mysql.createConnection({
	host	 : 'localhost',
	user	 : 'my_user',
	password : 'my_password',
	database : 'bps' 
});
let allFileNames, data, date;

	connection.connect();
	connection.query('SELECT * from bloodpressure;', function (error, results, fields){
		if(error) {
			date = '[' + (new Date()).toISOString() + ']: ';
			data =  date +  + JSON.stringify(error.msg);
			
			fs.appendFileSync('error.txt', data);
		};

		allFileNames = new Set( results.map( I => I.fileName ) );
		allFileNames = [...allFileNames];
		
	for ( let file of allFileNames ){
		const A = `SELECT * from bloodpressure;`;

		connection.query(A, function (err, res, field){
		if(err) {
			date = '[' + (new Date()).toISOString() + ']: WHERE fileName=' + file + ', ';
			data =  date +  + JSON.stringify(err.msg);
			fs.appendFileSync('error.txt', data);
		};		
		console.table({file: res, A });	
	})
	}	

	});
	connection.end();

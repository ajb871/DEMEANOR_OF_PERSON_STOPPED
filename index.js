//Parse & Manipulate CSV by converting to JSON

//Node packages
const CSVToJSON = require('CSVToJSON');
const fs = require('fs');

//Some officers aren't sure of demeanor vs misdemeanor, so those are filtered out here:
const misDemeanors = ['MAKING GRAFFITI', 'NA', 'CPSP','MURDER','RAPE','ROBBERY','ASSAULT','GRAND LARCENY', 'PETIT LARCENY', 'CRIMINAL SALE OF CONTROLLED SUBSTANCE', 'CRIMINAL TRESSPASS', 'CRIMINAL TRESPASS', 'CPW', 'WALKING AWAY FROM THE LOCATION', 'FORCIBLE TOUCHING', 'BURGLARY', 'CRIMINAL POSSESSION OF MARIHUANA', 'CRIMINAL POSSESSION OF CONTROLLED SUBSTANCE', 'CRIMINAL POSSESSION OF FORGED INSTRUMENT', 'INTOX', 'CRIMINAL MISCHIEF', 'OTHER', 'CRIMINAL SALE OF MARIHUANA', 'N/A', 'THEFT OF SERVICES', 'GRAND LARCENY AUTO', 'AUTO STRIPPIG', 'PROSTITUTION'];

CSVToJSON().fromFile('./sqf-2017-full.csv').then((jsonObj) =>{
	console.log('CSVJSON conversion complete \n');
	//Functions for json data:
	logValRestrict(jsonObj, 'DEMEANOR_OF_PERSON_STOPPED', ['SUSPECT_RACE_DESCRIPTION','BLACK'],()=>{
		logValRestrict(jsonObj, 'DEMEANOR_OF_PERSON_STOPPED', ['SUSPECT_RACE_DESCRIPTION','BLACK HISPANIC'],()=>{
			logValRestrict(jsonObj, 'DEMEANOR_OF_PERSON_STOPPED', ['SUSPECT_RACE_DESCRIPTION','WHITE HISPANIC'],()=>{
				logValRestrict(jsonObj, 'DEMEANOR_OF_PERSON_STOPPED', ['SUSPECT_RACE_DESCRIPTION','ASIAN/PAC.ISL'],()=>{
					logValRestrict(jsonObj, 'DEMEANOR_OF_PERSON_STOPPED', ['SUSPECT_RACE_DESCRIPTION','WHITE'],()=>{
						console.log('all files written');
					})
				});
			});
		});
	});
})
.catch((err)=>{
	console.log(`JSON conversion fail- ${err}`);
});

//Log the specificed value into JSON file - only if restriction is met
var logValRestrict = (json, logVal, restrict, callback)=>{
	console.log(`logging ${logVal} with ${restrict}`);
	let jsonVal = [];
	for (var i = 0; i < json.length; i++) {
		if( (json[i][restrict[0]] == restrict[1]) && (!misDemeanors.includes(json[i][logVal])) ){
			jsonVal.push(json[i][logVal]);
		}
	}
	let filename = logVal.substring(0,6) + '_' + restrict[1].replace(' ', '_').replace('/','-').replace('.','-') + '.json';
	fs.writeFile('./json/'+filename, JSON.stringify(jsonVal), (err)=>{
		if(err){
			console.log(`JSON write fail: ${err}`);
			return;
		};
		console.log(`JSON file ${filename} write success \n`);
		callback();
	});
}


//Count instances of specific value
var countValue = (json, obj_name, value)=>{
	let valueNum = 0;
	console.log(`searching for ${obj_name} ${value}...`);
	for (var i = 0; i < json.length; i++) {
		if(json[i][obj_name] == value){
			valueNum += 1;
		}
	}
	console.log(`${valueNum} instances of ${obj_name} ${value} \n`);
}
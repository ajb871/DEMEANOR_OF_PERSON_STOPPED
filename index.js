//Node packages
const CSVToJSON = require('CSVToJSON');
const fs = require('fs');
const ejs = require('ejs');
const body_parser = require('body-parser');


//Some officers aren't too sure of demeanor vs misdemeanor, so those are filtered out here:
const misDemeanors = ['RECKLESS ENDANGERMENT','UNAUTHORIZED USE OF A VEHICLE','MAKING GRAFFITI', 'NA', 'CPSP','MURDER','RAPE','ROBBERY','ASSAULT','GRAND LARCENY', 'PETIT LARCENY', 'CRIMINAL SALE OF CONTROLLED SUBSTANCE', 'CRIMINAL TRESSPASS', 'CRIMINAL TRESPASS', 'CPW', 'WALKING AWAY FROM THE LOCATION', 'FORCIBLE TOUCHING', 'BURGLARY', 'CRIMINAL POSSESSION OF MARIHUANA', 'CRIMINAL POSSESSION OF CONTROLLED SUBSTANCE', 'CRIMINAL POSSESSION OF FORGED INSTRUMENT', 'INTOX', 'CRIMINAL MISCHIEF', 'OTHER', 'CRIMINAL SALE OF MARIHUANA', 'N/A', 'THEFT OF SERVICES', 'GRAND LARCENY AUTO', 'AUTO STRIPPIG', 'PROSTITUTION'];

var writeJSON = () =>{
CSVToJSON().fromFile('./sqf-2017-full.csv').then((jsonObj) =>{
	console.log('CSVJSON conversion complete \n');
	//Functions for json data:
	/*logValRestrict(jsonObj, 'DEMEANOR_OF_PERSON_STOPPED', ['SUSPECT_RACE_DESCRIPTION','BLACK'],()=>{
		logValRestrict(jsonObj, 'DEMEANOR_OF_PERSON_STOPPED', ['SUSPECT_RACE_DESCRIPTION','BLACK HISPANIC'],()=>{
			logValRestrict(jsonObj, 'DEMEANOR_OF_PERSON_STOPPED', ['SUSPECT_RACE_DESCRIPTION','WHITE HISPANIC'],()=>{
				logValRestrict(jsonObj, 'DEMEANOR_OF_PERSON_STOPPED', ['SUSPECT_RACE_DESCRIPTION','ASIAN/PAC.ISL'],()=>{
					logValRestrict(jsonObj, 'DEMEANOR_OF_PERSON_STOPPED', ['SUSPECT_RACE_DESCRIPTION','WHITE'],()=>{
						console.log('all files written');
					})
				});
			});
		});
	});*/
	countValue(jsonObj, 'SUSPECT_ARRESTED_FLAG', 'Y');
	countValue(jsonObj, 'SUSPECT_ARRESTED_FLAG', 'N');


})
.catch((err)=>{
	console.log(`JSON conversion fail- ${err}`);
});
}

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

var countValues = (filename) =>{
	//Count repeated values in JSON file
	let file = JSON.parse(fs.readFileSync('./json/'+filename+'.json', 'utf8'));
	//Isolate individual words
	let fileStr = file.join(' ');
	fileStr = fileStr.replace(/[\W_]+/g,' ');
	fileStr = fileStr.split(' ');

	let counted = {};
	for (let value of fileStr) {
		if(counted[value]){
			counted[value] += 1;
		} else {
			counted[value] = 1;
		}
	}
	console.log(counted);
	let filenameSave = 'counted' + filename;
	fs.writeFile('./json/counted/' + filenameSave, JSON.stringify(counted),(err)=>{
		if(err){
			console.log(`JSON write fail- ${err}`)
			return;
		};
		console.log(`JSON file ${filenameSave} write success`);
	});
	//Write variable from data

}

//countValues('DEMEAN_WHITE');
writeJSON();


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
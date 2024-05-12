import {appendFile, readFile} from 'node:fs/promises';
import promptSync from 'prompt-sync';
const prompt = promptSync();
let linea = prompt('Append a text line to the file: ');
try{
  await appendFile('./data.txt', '\n'+linea, {encoding: 'utf8'});
  console.clear();
  console.log('Start reading the file...\n')
  const data = await readFile('./data.txt', {encoding: 'utf8'});
  console.log(data);
  //console.log(await readFile('./data.txt', {encoding: 'utf8'})); Se puede asi tambien
}
catch(error){
  console.log(error);
}
finally{
  console.log('\nEnd of file');
}
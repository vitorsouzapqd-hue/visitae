import test from 'node:test';
import assert from 'node:assert/strict';
import {createPreviewServer} from '../scripts/serve.mjs';
test('standalone preview uses the deployed /360 asset base without exposing project source',async()=>{
 const server=createPreviewServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base='http://127.0.0.1:'+server.address().port;
 try{
  const response=await fetch(base+'/',{redirect:'manual'});assert.equal(response.status,302);assert.equal(response.headers.get('location'),'/360');
  assert.match(await (await fetch(base+'/360')).text(),/<base href="\/360\/">/);
  for(const file of ['styles.css','app.js','assets/tour-cover.webp'])assert.equal((await fetch(base+'/360/'+file)).status,200,file);
  for(const file of ['/scripts/serve.mjs','/360/.git/config','/360/src/config.js'])assert.equal((await fetch(base+file)).status,404,file);
 }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});

import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'};
export function createPreviewServer(){return http.createServer(async(req,res)=>{
 const send=(status,body='',headers={})=>{res.writeHead(status,{'Cache-Control':'no-store',...headers});res.end(req.method==='HEAD'?undefined:body);};
 if(!['GET','HEAD'].includes(req.method)){send(405);return;}
 try{
  const url=new URL(req.url,'http://localhost'),pathname=decodeURIComponent(url.pathname);
  if(pathname==='/'||pathname==='/360/'){send(302,'',{Location:'/360'+url.search});return;}
  if(pathname!=='/360'&&!pathname.startsWith('/360/')){send(404);return;}
  const relative=pathname==='/360'?'index.html':pathname.slice(5);
  if(relative.includes('\\')||relative.split('/').some(part=>part.startsWith('.'))){send(404);return;}
  const file=path.resolve(root,relative),type=types[path.extname(file)];
  if(!type||!file.startsWith(path.resolve(root)+path.sep)){send(404);return;}
  try{send(200,await readFile(file),{'Content-Type':type});}catch{send(404);}
 }catch{send(400);}
});}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))createPreviewServer().listen(5173,'127.0.0.1',()=>console.log('Serviços: http://127.0.0.1:5173/360'));

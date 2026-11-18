// Jobbing Book network server. Run: node server.js   (no installs needed)
const http=require('http'),fs=require('fs'),path=require('path'),os=require('os');
const PORT=process.env.PORT||3000, DB=path.join(__dirname,'jobbing-data.json');
let db=fs.existsSync(DB)?JSON.parse(fs.readFileSync(DB,'utf8')):{P:[],S:[],custom:[],extraCols:[],clients:'',v:0};
const persist=()=>fs.writeFileSync(DB,JSON.stringify(db));
http.createServer((req,res)=>{
 if(req.url.startsWith('/api/data')){
  if(req.method==='GET'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(db))}
  if(req.method==='PUT'){let b='';req.on('data',c=>b+=c);req.on('end',()=>{try{const n=JSON.parse(b);db={P:n.P||[],S:n.S||[],custom:n.custom||[],extraCols:n.extraCols||[],clients:n.clients||'',v:db.v+1};persist();res.end(JSON.stringify({v:db.v}))}catch(e){res.statusCode=400;res.end()}});return}
 }
 if(req.url==='/regency-logo.png'){
  return fs.readFile(path.join(__dirname,'regency-logo.png'),(e,d)=>{
   if(e){res.statusCode=404;return res.end()}
   res.setHeader('Content-Type','image/png');res.end(d);
  });
 }
 fs.readFile(path.join(__dirname,'index.html'),(e,d)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(d)});
}).listen(PORT,'0.0.0.0',()=>{
 console.log('Jobbing Book running. Open on any computer in the office:');
 for(const l of Object.values(os.networkInterfaces()).flat())if(l.family==='IPv4'&&!l.internal)console.log('  http://'+l.address+':'+PORT);
 console.log('  (this PC)  http://localhost:'+PORT);
});

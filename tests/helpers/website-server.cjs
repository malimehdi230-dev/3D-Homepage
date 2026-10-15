// Serve the static build with the subset of Vercel routing used by this site.
// Production checks exercise Vercel itself after deployment.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
function createWebsiteServer(root,config,handlers={}){
  const matches=(source,pathname)=>source==='/(.*)'||source==='/:path*'||(source.endsWith('/(.*)')?pathname.startsWith(source.slice(0,-4)):source===pathname);
  return http.createServer(async(req,res)=>{
    const url=new URL(req.url,'http://localhost'),host=req.headers.host?.split(':')[0];
    for(const rule of config.headers)if(matches(rule.source,url.pathname))for(const header of rule.headers)res.setHeader(header.key,header.value);
    const redirect=destination=>{res.writeHead(308,{Location:destination+url.search});res.end();};
    if(config.trailingSlash===false&&url.pathname.length>1&&url.pathname.endsWith('/'))return redirect(url.pathname.replace(/\/+$/,''));
    for(const rule of config.redirects){
      if(!matches(rule.source,url.pathname)||rule.has?.some(condition=>condition.type!=='host'||condition.value!==host))continue;
      return redirect(rule.destination.replace(':path*',url.pathname.slice(1)));
    }
    if(handlers[url.pathname]){
      let raw='';for await(const chunk of req)raw+=chunk;req.body=raw||undefined;req.query=Object.fromEntries(url.searchParams);
      return handlers[url.pathname](req,{setHeader:(k,v)=>res.setHeader(k,v),status(code){res.statusCode=code;return this;},json(value){res.setHeader('Content-Type','application/json');res.end(JSON.stringify(value));},end(){res.end();}});
    }
    const rewrite=config.rewrites.find(rule=>rule.source===url.pathname&&!rule.destination.startsWith('https:'));
    const relative=url.pathname==='/'?'index.html':(rewrite?.destination||decodeURIComponent(url.pathname)).slice(1);
    const file=path.resolve(root,relative);let chosen=file;
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){chosen=path.join(root,'404.html');res.statusCode=404;}
    const type={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.xml':'application/xml'};
    res.setHeader('Content-Type',type[path.extname(chosen)]||'text/plain');res.end(fs.readFileSync(chosen));
  });
}
module.exports={createWebsiteServer};

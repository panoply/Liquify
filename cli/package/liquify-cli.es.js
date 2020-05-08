import{basename as t,resolve as e}from"path";import a from"inquirer";import i from"execa";import{readdir as n,writeFile as r,readFile as o,statSync as s}from"fs-extra";import c from"chalk";import l from"crypto";import m from"@liquify/specs";import p from"strip-json-comments";import d from"jsonminify";import h from"chokidar";import u from"boxen";import f from"json-to-pretty-yaml";import g from"figlet";import y from"console-clear";var w=class{static normalizeInput(t){if(null==t)throw new Error("required origin");return"object"==typeof t&&(t=JSON.stringify(t)),"string"!=typeof t&&(t=t.toString()),t}static normalizeOutput(t){try{return JSON.parse(t)}catch(e){return t}}};const b=[],v=(t,e)=>void 0!==t&&(e=e||t,b.includes(e)||b.push(e),console.warn("["+v.title+"]",e),!0);v.title="DeprecationWarning";var $=v,j=b;$.once=(...t)=>!b.includes(t[1]||t[0])&&v.apply(void 0,t),$._list=j;const{ALGORITHM:S}={ALGORITHM:["aes-256-cbc","aes-256-cbc-hmac-sha1","aes-256-cbc-hmac-sha256","aes-256-cfb","aes-256-cfb1","aes-256-cfb8","aes-256-ctr","aes-256-ofb","aes256","camellia-256-cbc","camellia-256-cfb","camellia-256-cfb1","camellia-256-cfb8","camellia-256-ofb","camellia256"]};class k{constructor(t,e="aes-256-ctr"){if("string"!=typeof t)throw new Error("required an string key");if(""===t)throw new Error("key cannot be empty");if(!S.includes(e))throw new Error(`algorithm ${e} not supported, use those available: ${S.join(", ")}`);t=this.constructor.hash(t,"md5"),Object.defineProperties(this,{algorithm:{value:e},key:{value:t},iv:{value:t.substr(16)},options:{value:{}}})}encode(t){t=w.normalizeInput(t);const e=l.createCipheriv(this.algorithm,this.key,this.iv,this.options);return e.update(t,"utf8","hex")+e.final("hex")}decode(t){t=w.normalizeInput(t);const e=l.createDecipheriv(this.algorithm,this.key,this.iv,this.options),a=e.update(t,"hex","utf8")+e.final("utf8");return w.normalizeOutput(a)}static getCiphers(){return l.getCiphers()}static getHashes(){return l.getHashes()}static md5(t){return $('md5 is deprecated, use hash method instead. e.g. hash("your string", "md5")'),l.createHash("md5").update(t).digest("hex")}static sha1(t){return $('sha1 is deprecated, use hash method instead. e.g. hash("your string", "sha1")'),l.createHash("sha1").update(t).digest("hex")}static hash(t,e){if(k.hasHash(e))return l.createHash(e).update(t).digest("hex");throw new Error("hash "+e+" not found in your platform")}static hasHash(t){return-1!==k.getHashes().indexOf(t)}}var x=k;const O=new x("sissel siv"),{log:C}=console;const I=require("../../package.json"),{log:P}=console,L=t=>e=>P(c`{redBright Error} in {red ${t}}\n${e}\n`),E=async(t,e,a,i)=>{const n=new x("sissel siv"),o=n.encode(i),s=n.encode(t);return await r(`${e}/${s}.js`,`module.exports="${o}";`),global.watch||P(c`encrypted {magenta ${t}} to {green ${s}}`),a.encrypt[s]=`${s}=require("./${s}")`,a},N=async(t,e)=>{await E("specs",t,e,e.specs),await E("grammar",t,e,e.grammar);const{parsing:a}=(t=>{const{parsing:e,cache:a,cache:{standard:i}}=t;for(const n in a){"object"!=typeof e[n]&&(e[n]={});const{filter:r=[],object:o=[]}=a[n];t.parsing[n].objects=[...o].sort(),t.parsing[n].filters="standard"!==n?[...r,...i.filter].sort():i.filter.sort()}return t})(e),{encrypt:i}=await E("parsing",t,e,a),n=`${"const "+Object.values(i).join(",")};module.exports={${Object.keys(i).join(",")}};`;await r(t+"/index.js",n)},B=(e,a)=>async i=>{const n=i?`${e}/${i}`:e,r=t(n).replace(/\.[^/.]+$/,""),s=await o(n),c=p(s.toString()),l=JSON.parse(d(c)),{cache:m}=((t,e,a)=>{e.cache[t]={deprecated:[]};for(const[i,{type:n,deprecated:r}]of Object.entries(a))e.cache[t][n]||(e.cache[t][n]=[]),r?e.cache[t].deprecated.push(i):e.cache[t][n].push(i);return e})(r,a,l);a.specs[r]=l,a.grammar[r]=((t,e={})=>{for(const a in t)t[a].length&&(e[a]=`(${t[a].join("|")})`);return e})(m[r])},q=async(t,e,a)=>{const i=await n(t),r=B(t,a),o=L(t);for(const t of i)await r(t).catch(o);return await N(e,a).catch(o),a};const H=async t=>{const e=await o(t),a=p(e.toString()),i=JSON.parse(a);return i.$schema&&delete i.$schema,i};var R=[{command:"grammar",filters:[{command:"create"}]},{command:"peek"},{command:"package"},{command:"publish"},{command:"schema"},{command:"server"},{command:"specs"},{command:"client",filters:[{command:"vscode"},{command:"sublime"},{command:"atom"}]}],z=[{name:"config",short:"c",description:"Use configuration file (defaults to `.liquifyrc.json`"},{name:"watch",short:"w",description:"Watch and bundle file/s"},{name:"main",short:"m",description:"Define a main (entry) configuration file"},{name:"input",short:"i",description:"Input path to directory of file/s"},{name:"output",short:"o",description:"Output path destination of bundled file/s"},{name:"prod",short:"p",description:"Production bundle build"},{name:"dev",short:"d",description:"Develop bundle build (default)"},{name:"postinstall",short:"pi",description:"Post install"},{name:"help",short:"h",description:"Shows the CLI help and commands list"}],D={banner:({name:e,main:a,version:i,author:n})=>`\n/**\n * @license\n *\n * THIS IS PROPRIETARY CODE\n *\n * Copyright of Vellocet, Inc - All Rights Reserved.\n * Unauthorized copying or modification of this file, via any medium is strictly prohibited.\n * Please refer to the LICENSE.txt and/or ThirdPartyNotices.txt files included in bundle.\n *\n * ${t(a)}\n *\n * Package:  ${e}\n * Version:  ${i}\n * Updated:  ${new Date(s(a).mtimeMs).toISOString().replace(/T/," ").substr(0,19)}\n * Website:  https://www.liquify.dev\n * License:  See LICENSE\n *\n * Written by ${n}\n *\n */`};const J=async o=>{const s=process.cwd(),l=(({_:[t,e=null]})=>{for(const{command:a,filters:i}of R){if(console.log(a===t),a===t)return{command:a,filter:e};if(a===t&&e&&i.length>0)for(const t of i)if(t.command===e)return{command:a,filter:e}}})(o);if(console.log(o),!l)return L("Command\n")(JSON.stringify(l));const p=((t,a)=>async([i,n])=>{for(const{name:r,short:o}of z)r!==i&&o!==i||await Object.assign(a,{[r]:["config","main","input","output","peek"].includes(r)?e(t,n):n})})(s,l);switch(Object.entries(o).forEach(await p),l.command){case"specs":await(async(e,a={specs:{},cache:{},grammar:{},parsing:{},encrypt:{}})=>{const{input:i,output:n}=e,r=L(i);if(e.watch){P(c`{bold.cyan Liquid Specifications}\n`),await q(i,n,a).catch(r);const e=h.watch(i+"/**",{persistent:!0}),o=((e,a)=>async i=>{const n=t(i),r=L(n);P(c`{cyan changed} '{yellow ${n}}'`);const o=B(i,a);await o().catch(r),await N(e,a).catch(r)})(n,a);global.watch=!0,e.on("change",o).on("error",r)}else P(c`{bold.cyan Liquid Specifications}\n`),await q(i,n,a).catch(r)})(l);break;case"peek":await(async r=>{const{input:o}=r,s=await n(o),l=(a=>i=>"index"!==(i=t(i).replace(/\.[^/.]+$/,""))&&(c`${O.decode(i)}    {dim.magenta ${i} }`,e(a,i)))(o),m=s.map(l).filter(Boolean),{file:p}=await a.prompt([{type:"list",name:"bundle",message:"Select Bundle",choices:m}]),d=await i("pnpx",["fx",p+".js"],{stdio:"inherit"});try{await d}catch(t){C(""+t.shortMessage)}})(l);break;case"grammar":await(async(t,a={specs:{},cache:{},grammar:{},parsing:{},encrypt:{}})=>{const{output:i}=t,n=process.cwd(),o=await H(t.main),s=await H(e(n,o.input)),l=await(async t=>O.decode(m.bb7485c5a2338a))(),p=(h=i,async({input:t,output:e})=>{const a=await H(t),i=d(JSON.stringify(a)),n=f.stringify(a);await r(`${h}/${e}.json`,i),P(c`{cyan JSON Injection} {green ${e}.json}`),await r(`${h}/${e}.yaml`,n),P(c`{yellow YAML Injection} {green ${e}.yaml}`)});var h;const u=(async(t,e,a)=>a=>{if(!t[a.variant])return;const{repository:i}=e,{object:n}=t[a.variant];i.objects.patterns})(l,s);o.injections.forEach(await p),o.variations.forEach(await u)})(l);break;default:await(async(t=[{type:"list",name:"run",message:"Select operation:",choices:[c`Bundle    {gray.italic Build and compile bundles}`,c`Package   {gray.italic Packaging execution, eg: npm pack}`,c`Git       {gray.italic Common git related operations for the project}`,c`Publish   {gray.italic Publish to CDN, Netlify, Marketplace etc}`,c`Test      {gray.italic Run various tests}`,c`Config    {gray.italic Project configuration and settings}`]}])=>{y(!0),P(c`{cyan ${g.textSync("Liquify CLI",{font:"Slant",horizontalLayout:"controlled smushing"})}}`),P(u([c`{magentaBright Package}{dim :} ${I.name}                              `,c`{magentaBright Version}{dim :} ${I.version}                           `,c`{magentaBright Private}{dim :} ${I.private}`].join("\n"),{padding:0,borderColor:"gray",dimBorder:!0,borderStyle:{topLeft:" ",topRight:" ",bottomLeft:" ",bottomRight:" ",horizontal:"-",vertical:" "}}));const{run:e}=await a.prompt(t);return e.toLowerCase().substring(0,e.indexOf(" ")),await(async()=>{const{bundle:t}=await a.prompt([{type:"list",name:"bundle",message:"Select Bundle",choices:[c`Client    {gray.italic Build and compile bundles}`,c`Grammar   {gray.italic Packaging execution, eg: npm pack}`,c`Schema    {gray.italic Common git related operations for the project}`,c`Server    {gray.italic Publish to CDN, Netlify, Marketplace etc}`,c`Specs     {gray.italic Run various tests}`,c`{magenta < Go Back}`]}]),e=t.toLowerCase().substring(0,t.indexOf(" ")),n=L(e);return await i("pnpm",["run","build","--filter","./packages/specs"],{stdio:"inherit"}).catch(n)})()})()}};export{D as rollup,J as run};

/* Ctrl+Alt+Elite shared database (localStorage). Include on every page. */
(function(){'use strict';
var KEY='celite_db_v1',CK={creatorKit_vault:'CreatorKit Vault',creatorKit_planner:'CreatorKit Planner'};
var seed={
properties:[
{id:1,name:'Aura Crest Residences',price:1650000,location:'Demo listing, Philippines',beds:2,baths:1,floor:'42 sqm',lot:'60 sqm'},
{id:2,name:'Solaria Heights Park',price:2100000,location:'Demo listing, Philippines',beds:3,baths:2,floor:'55 sqm',lot:'72 sqm'},
{id:3,name:'Metro Park Townhomes',price:2800000,location:'Demo listing, Philippines',beds:3,baths:2,floor:'68 sqm',lot:'90 sqm'}],
restaurants:[
{id:1,name:"The Grand Bistro",cuisine:'Italian',price:'$$$',rating:4.8,capacity:20,hours:'11:00 AM - 10:00 PM',slots:['5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM']},
{id:2,name:'Sakura Sushi House',cuisine:'Japanese',price:'$$$$',rating:4.9,capacity:12,hours:'5:00 PM - 10:30 PM',slots:['6:00 PM','7:00 PM','8:00 PM','9:00 PM']},
{id:3,name:'The Prime Steakhouse',cuisine:'Steakhouse',price:'$$$$',rating:4.7,capacity:24,hours:'12:00 PM - 11:00 PM',slots:['5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM']}],
games:[
{id:1,name:'The Witcher 3',runner:'Wine/Proton',rating:4.9,size:'50 GB'},
{id:2,name:'Cyberpunk 2077',runner:'Wine/Proton',rating:4.7,size:'70 GB'},
{id:3,name:'Hades II',runner:'Linux Native',rating:4.9,size:'15 GB'},
{id:4,name:'Super Mario World',runner:'Retro/Emulator',rating:4.9,size:'1 MB'}],
inquiries:[],reservations:[],library:[],mortgages:[],activity:[]};
var d;try{d=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!d||typeof d!=='object'){d=JSON.parse(JSON.stringify(seed))}
Object.keys(seed).forEach(function(k){if(!Array.isArray(d[k]))d[k]=JSON.parse(JSON.stringify(seed[k]))});
function save(){try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}}
function ck(k){try{return JSON.parse(localStorage.getItem(k))||[]}catch(e){return[]}}
var DB={
all:function(t){return CK[t]?ck(t):(d[t]||[])},
find:function(t,f){return DB.all(t).filter(f)},
insert:function(t,r){r.id=Date.now()+Math.floor(Math.random()*1000);r.createdAt=new Date().toISOString();d[t].push(r);save();return r},
update:function(t,id,p){var r=d[t].filter(function(x){return x.id===id})[0];if(r){Object.assign(r,p);save()}return r},
remove:function(t,id){if(CK[t]){localStorage.setItem(t,JSON.stringify(ck(t).filter(function(x){return x.id!==id})))}else{d[t]=d[t].filter(function(x){return x.id!==id});save()}},
log:function(m){d.activity.unshift({id:Date.now()+Math.random(),message:m,createdAt:new Date().toISOString()});d.activity=d.activity.slice(0,100);save()},
exportJSON:function(){var o=JSON.parse(JSON.stringify(d));Object.keys(CK).forEach(function(k){o[k]=ck(k)});return JSON.stringify(o,null,2)},
importJSON:function(s){var o=JSON.parse(s);Object.keys(o).forEach(function(k){if(CK[k])localStorage.setItem(k,JSON.stringify(o[k]));else if(Array.isArray(o[k]))d[k]=o[k]});save()},
reset:function(){d=JSON.parse(JSON.stringify(seed));save()}
};
window.CEDB=DB;

/* helpers */
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function peso(n){return'\u20B1'+Math.round(n).toLocaleString('en-PH')}
function today(){var t=new Date();return new Date(t.getTime()-t.getTimezoneOffset()*6e4).toISOString().slice(0,10)}
function fdt(s){try{return new Date(s).toLocaleString()}catch(e){return s}}
function toast(m){var t=document.createElement('div');t.className='cedb-toast';t.textContent=m;document.body.appendChild(t);setTimeout(function(){t.remove()},2800)}
function modal(title,html,onOk,okText,wide){
var o=document.createElement('div');o.className='cedb-ov';
o.innerHTML='<div class="cedb-m'+(wide?' wide':'')+'"><div class="cedb-h"><b>'+title+'</b><button type="button" class="cedb-x">&times;</button></div><form class="cedb-b">'+html+'<div class="cedb-err"></div>'+(onOk?'<button class="cedb-btn" type="submit">'+(okText||'Submit')+'</button>':'')+'</form></div>';
document.body.appendChild(o);var close=function(){o.remove()};
$('.cedb-x',o).onclick=close;o.addEventListener('mousedown',function(e){if(e.target===o)close()});
var f=$('form',o);f.onsubmit=function(e){e.preventDefault();var data={};new FormData(f).forEach(function(v,k){data[k]=v});var err=onOk&&onOk(data,close);if(typeof err==='string')$('.cedb-err',o).textContent=err};
return o}
function section(main,cls,html){var s=document.createElement('section');s.className='cedb-sec '+cls;s.innerHTML=html;main.appendChild(s);return s}
function table(cols,rows,empty){if(!rows.length)return'<p style="opacity:.7;font-size:12px">'+empty+'</p>';
return'<div style="overflow:auto"><table><thead><tr>'+cols.map(function(c){return'<th>'+c[0]+'</th>'}).join('')+'</tr></thead><tbody>'+rows.map(function(r){return'<tr>'+cols.map(function(c){return'<td>'+c[1](r)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>'}
var page=(location.pathname.split('/').pop()||'').toLowerCase();
var main;

/* ---------- CONTROL ESTATE ---------- */
function estate(){
var C='bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4',H='font-heading font-bold text-xl text-deca-navy',B='cedb-btn';
$$('main .grid > div').forEach(function(card){
var p=DB.find('properties',function(x){return x.name===$('h3',card).textContent.trim()})[0];if(!p)return;
var price=$('p',card);
var info=document.createElement('p');info.className='text-xs text-slate-500';
info.innerHTML=esc(p.location)+'<br>'+p.beds+' BR &bull; '+p.baths+' Bath &bull; Floor '+p.floor+' &bull; Lot '+p.lot+'<br><b>Est. '+peso(pmt(p.price,6.25,20))+'/mo</b> (20 yrs @ 6.25%, no down payment)';
price.after(info);
var b=$('button',card);b.removeAttribute('onclick');b.onclick=function(){inquire(p)}});
main=$('main');
var s1=section(main,C,'<h2 class="'+H+'">Mortgage Calculator</h2><p class="text-xs text-slate-500">Estimate your monthly amortization. Rates are editable estimates; confirm the actual rate with your lender.</p><div class="cedb-grid" id="cc"></div><div class="cedb-res" id="cres"></div><div><button class="'+B+'" id="csave" type="button">Save computation</button></div>');
$('#cc').innerHTML='<div><span class="cedb-lbl">Property</span><select class="cedb-in" id="cp">'+DB.all('properties').map(function(p){return'<option value="'+p.id+'">'+esc(p.name)+' - '+peso(p.price)+'</option>'}).join('')+'</select></div><div><span class="cedb-lbl">Down payment (%)</span><input class="cedb-in" id="cd" type="number" min="0" max="90" value="10"></div><div><span class="cedb-lbl">Term (years, 1-30)</span><input class="cedb-in" id="cy" type="number" min="1" max="30" value="20"></div><div><span class="cedb-lbl">Interest rate (% / yr)</span><input class="cedb-in" id="cr" type="number" step="0.01" min="0" value="6.25"></div>';
var last=null;
function calc(){var p=DB.find('properties',function(x){return x.id==$('#cp').value})[0],dp=+$('#cd').value,y=+$('#cy').value,r=+$('#cr').value;
if(!p||!(dp>=0&&dp<=90)||!(y>=1&&y<=30)||!(r>=0)){$('#cres').innerHTML='<span style="color:#dc2626">Enter a down payment of 0-90%, a term of 1-30 years and a valid rate.</span>';last=null;return}
var down=p.price*dp/100,loan=p.price-down,m=pmt(loan,r,y),tot=m*y*12;
last={property:p.name,price:p.price,downPct:dp,years:y,rate:r,loan:Math.round(loan),monthly:Math.round(m),totalInterest:Math.round(tot-loan)};
$('#cres').innerHTML='Down payment: <b>'+peso(down)+'</b><br>Loan amount: <b>'+peso(loan)+'</b><br>Monthly amortization: <b style="font-size:18px">'+peso(m)+'</b><br>Total interest: <b>'+peso(tot-loan)+'</b> &bull; Total paid: <b>'+peso(tot+down)+'</b>'}
$$('#cc input,#cc select').forEach(function(i){i.oninput=calc});calc();
$('#csave').onclick=function(){if(!last)return toast('Fix the inputs first.');DB.insert('mortgages',Object.assign({},last));DB.log('Saved mortgage computation for '+last.property);toast('Computation saved.');lists()};
var s2=section(main,C,'');
function lists(){s2.innerHTML='<h2 class="'+H+'">My Inquiries</h2>'+table([['Date',function(r){return fdt(r.createdAt)}],['Property',function(r){return esc(r.property)}],['Name',function(r){return esc(r.name)}],['Contact',function(r){return esc(r.phone)}],['Status',function(r){return r.status}],['',function(r){return'<button class="cedb-btn del sm" data-t="inquiries" data-id="'+r.id+'">Delete</button>'}]],DB.all('inquiries'),'No inquiries yet. Press "Inquire Now" on a property.')+'<h2 class="'+H+'" style="margin-top:20px">Saved Computations</h2>'+table([['Property',function(r){return esc(r.property)}],['Down',function(r){return r.downPct+'%'}],['Term',function(r){return r.years+' yrs @ '+r.rate+'%'}],['Monthly',function(r){return'<b>'+peso(r.monthly)+'</b>'}],['',function(r){return'<button class="cedb-btn del sm" data-t="mortgages" data-id="'+r.id+'">Delete</button>'}]],DB.all('mortgages'),'Nothing saved yet.');
$$('[data-t]',s2).forEach(function(b){b.onclick=function(){DB.remove(b.dataset.t,+b.dataset.id);lists()}})}
window.__lists=lists;lists()}
function pmt(P,rate,yrs){var r=rate/1200,n=yrs*12;return r?P*r/(1-Math.pow(1+r,-n)):P/n}
function inquire(p){modal('Inquire: '+esc(p.name),'<div><label>Full name</label><input class="cedb-in" name="name" required></div><div><label>Mobile number</label><input class="cedb-in" name="phone" placeholder="09XXXXXXXXX" required></div><div><label>Email</label><input class="cedb-in" name="email" type="email" required></div><div><label>Message (optional)</label><textarea class="cedb-in" name="message" rows="3"></textarea></div>',function(v,close){
if(!/^[0-9+\-\s]{7,15}$/.test(v.phone))return'Enter a valid phone number.';
DB.insert('inquiries',{property:p.name,name:v.name.trim(),phone:v.phone.trim(),email:v.email.trim(),message:v.message,status:'Sent'});DB.log('Inquiry sent for '+p.name);close();toast('Inquiry sent successfully!');if(window.__lists)window.__lists()},'Send inquiry')}

/* ---------- ALT DINING ---------- */
function seatsLeft(r,date,slot){var used=DB.find('reservations',function(x){return x.restaurantId===r.id&&x.date===date&&x.time===slot&&x.status==='Confirmed'}).reduce(function(a,x){return a+x.guests},0);return Math.max(0,r.capacity-used)}
function dining(){
$$('main .grid > div').forEach(function(card){
var r=DB.find('restaurants',function(x){return x.name===$('h3',card).textContent.trim()})[0];if(!r)return;
var info=document.createElement('p');info.className='text-xs text-gray-500 cedb-avail';info.dataset.r=r.id;
$('p',card).after(info);
var b=$('button',card);b.removeAttribute('onclick');b.onclick=function(){reserve(r)}});
main=$('main');
var s=section(main,'bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-3','');
function paint(){$$('.cedb-avail').forEach(function(e){var r=DB.find('restaurants',function(x){return x.id==e.dataset.r})[0];e.innerHTML='Open '+r.hours+' &bull; Seats left tonight at 7:00 PM: <b>'+seatsLeft(r,today(),'7:00 PM')+'</b>/'+r.capacity});
s.innerHTML='<h2 class="font-bold text-xl text-gray-900">My Reservations</h2>'+table([['Code',function(r){return r.code}],['Restaurant',function(r){return esc(r.restaurant)}],['When',function(r){return r.date+' '+r.time}],['Guests',function(r){return r.guests}],['Name',function(r){return esc(r.name)}],['Status',function(r){return r.status}],['',function(r){return(r.status==='Confirmed'?'<button class="cedb-btn alt sm" data-c="'+r.id+'">Cancel</button> ':'')+'<button class="cedb-btn del sm" data-x="'+r.id+'">Delete</button>'}]],DB.all('reservations'),'No reservations yet. Press a "Book" button above.');
$$('[data-c]',s).forEach(function(b){b.onclick=function(){DB.update('reservations',+b.dataset.c,{status:'Cancelled'});DB.log('Reservation cancelled');toast('Reservation cancelled.');paint()}});
$$('[data-x]',s).forEach(function(b){b.onclick=function(){DB.remove('reservations',+b.dataset.x);paint()}})}
window.__paintDining=paint;paint()}
function reserve(r){var t=today();
var o=modal('Reserve at '+esc(r.name),'<div><label>Name</label><input class="cedb-in" name="name" required></div><div><label>Phone</label><input class="cedb-in" name="phone" required></div><div><label>Date</label><input class="cedb-in" name="date" id="rd" type="date" min="'+t+'" value="'+t+'" required></div><div><label>Time</label><select class="cedb-in" name="time" id="rt"></select></div><div><label>Guests (1-12)</label><input class="cedb-in" name="guests" type="number" min="1" max="12" value="2" required></div><div><label>Special requests</label><input class="cedb-in" name="notes"></div>',function(v,close){
var g=+v.guests,left=seatsLeft(r,v.date,v.time);
if(v.date<t)return'Pick today or a future date.';
if(!(g>=1&&g<=12))return'Guests must be 1-12.';
if(g>left)return'Only '+left+' seat(s) left for that time. Choose another slot.';
var code='RSV-'+Math.random().toString(36).slice(2,7).toUpperCase();
DB.insert('reservations',{code:code,restaurantId:r.id,restaurant:r.name,name:v.name.trim(),phone:v.phone.trim(),date:v.date,time:v.time,guests:g,notes:v.notes,status:'Confirmed'});
DB.log('Reserved '+r.name+' for '+g+' on '+v.date+' '+v.time);close();toast('Table reserved! Code '+code);window.__paintDining()},'Confirm reservation');
function slots(){$('#rt',o).innerHTML=r.slots.map(function(s){var l=seatsLeft(r,$('#rd',o).value,s);return'<option value="'+s+'"'+(s==='7:00 PM'?' selected':'')+(l?'':' disabled')+'>'+s+' ('+l+' seats left)</option>'}).join('')}
$('#rd',o).onchange=slots;slots()}

/* ---------- ELITE GAMING HUB ---------- */
function gaming(){
var cards={};
$$('main .grid > div').forEach(function(card){
var g=DB.find('games',function(x){return x.name===$('h3',card).textContent.trim()})[0];if(!g)return;cards[g.id]=card;
var info=document.createElement('p');info.className='text-xs text-gray-500';info.textContent='Download size: '+g.size;$('p',card).after(info);
var b=$('button',card);b.removeAttribute('onclick');
var bar=document.createElement('div');bar.className='cedb-bar';bar.style.display='none';bar.innerHTML='<i></i>';b.after(bar);
var un=document.createElement('button');un.type='button';un.className='text-xs text-gray-400 underline';un.style.display='none';un.textContent='Uninstall';bar.after(un);
card._g=g;card._b=b;card._bar=bar;card._un=un;
b.onclick=function(){var it=lib(g);if(it)return launch(g,it);
b.disabled=true;bar.style.display='block';var n=0,iv=setInterval(function(){n+=10;$('i',bar).style.width=n+'%';b.textContent='Installing '+n+'%';if(n>=100){clearInterval(iv);DB.insert('library',{gameId:g.id,name:g.name,runner:g.runner,size:g.size,launches:0,lastLaunched:null});DB.log('Installed '+g.name);b.disabled=false;toast(g.name+' installed.');paint()}},250)};
un.onclick=function(){var it=lib(g);if(it){DB.remove('library',it.id);DB.log('Uninstalled '+g.name);paint()}}});
function lib(g){return DB.find('library',function(x){return x.gameId===g.id})[0]}
function launch(g,it){DB.update('library',it.id,{launches:(it.launches||0)+1,lastLaunched:new Date().toISOString()});DB.log('Launched '+g.name+' ('+g.runner+')');toast('Launching '+g.name+' via '+g.runner+'...');paint()}
main=$('main');
var s=section(main,'bg-lutris-darkCard border border-lutris-darkBorder rounded-2xl p-6 space-y-3 text-gray-100','');
function paint(){Object.keys(cards).forEach(function(k){var c=cards[k],it=lib(c._g);c._bar.style.display='none';$('i',c._bar).style.width='0';c._b.textContent=it?'Launch':'Install / Launch';c._un.style.display=it?'inline':'none'});
s.innerHTML='<h2 class="font-bold text-xl text-white">My Library</h2>'+table([['Game',function(r){return esc(r.name)}],['Runner',function(r){return r.runner}],['Size',function(r){return r.size}],['Launches',function(r){return r.launches}],['Last launched',function(r){return r.lastLaunched?fdt(r.lastLaunched):'Never'}]],DB.all('library'),'No games installed yet. Press "Install / Launch" on a game.')}
paint()}

/* ---------- HUB ---------- */
function hub(){main=$('main');
var n=function(t){return DB.all(t).length};
var st=[['Properties',n('properties')],['Inquiries',n('inquiries')],['Saved loans',n('mortgages')],['Reservations',DB.find('reservations',function(r){return r.status==='Confirmed'}).length],['Games installed',n('library')],['CreatorKit ideas',n('creatorKit_vault')],['Planner tasks',n('creatorKit_planner')]];
section(main,'rounded-3xl p-6 border border-elite-border bg-elite-card text-left space-y-4','<h2 class="font-heading font-bold text-xl text-white">Ecosystem Database Overview</h2><div class="cedb-grid">'+st.map(function(x){return'<div style="background:#1e293b;border-radius:14px;padding:14px"><div style="font-size:24px;font-weight:800;color:#fff">'+x[1]+'</div><div class="text-xs text-slate-400">'+x[0]+'</div></div>'}).join('')+'</div><h3 class="font-bold text-white text-sm">Recent activity</h3>'+table([['When',function(r){return fdt(r.createdAt)}],['Activity',function(r){return esc(r.message)}]],DB.all('activity').slice(0,8),'No activity yet. Use any app and it will show up here.'))}

/* ---------- DATABASE PANEL (all pages) ---------- */
function panel(){
var f=document.createElement('button');f.className='cedb-fab';f.type='button';f.textContent='Database';document.body.appendChild(f);
f.onclick=function(){var tabs=Object.keys(d).concat(Object.keys(CK)),cur='properties';
var o=modal('Ecosystem Database','<div class="cedb-tabs" style="padding:0"></div><div class="cedb-tw" style="padding:0"></div><div class="cedb-row" style="padding:0"><button type="button" class="cedb-btn sm" id="ex">Export JSON</button><button type="button" class="cedb-btn alt sm" id="im">Import JSON</button><button type="button" class="cedb-btn del sm" id="rs">Reset all</button></div>',null,null,true);
var tb=$('.cedb-tabs',o),tw=$('.cedb-tw',o);
function draw(){tb.innerHTML=tabs.map(function(t){return'<button type="button" class="cedb-tab'+(t===cur?' on':'')+'" data-t="'+t+'">'+(CK[t]||t)+' ('+DB.all(t).length+')</button>'}).join('');
var rows=DB.all(cur),cols=[];rows.forEach(function(r){Object.keys(r).forEach(function(k){if(cols.indexOf(k)<0)cols.push(k)})});
tw.innerHTML=rows.length?'<table class="cedb-t"><thead><tr>'+cols.map(function(c){return'<th>'+esc(c)+'</th>'}).join('')+'<th></th></tr></thead><tbody>'+rows.map(function(r){return'<tr>'+cols.map(function(c){var v=r[c];return'<td title="'+esc(typeof v==='object'?JSON.stringify(v):v)+'">'+esc(typeof v==='object'?JSON.stringify(v):v)+'</td>'}).join('')+'<td><button type="button" class="cedb-btn del sm" data-d="'+r.id+'">Delete</button></td></tr>'}).join('')+'</tbody></table>':'<p>This table is empty.</p>';
$$('[data-t]',tb).forEach(function(b){b.onclick=function(){cur=b.dataset.t;draw()}});
$$('[data-d]',tw).forEach(function(b){b.onclick=function(){DB.remove(cur,+b.dataset.d);draw()}})}
draw();
$('#ex',o).onclick=function(){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([DB.exportJSON()],{type:'application/json'}));a.download='ctrl-alt-elite-db.json';a.click()};
$('#im',o).onclick=function(){var i=document.createElement('input');i.type='file';i.accept='.json';i.onchange=function(){var fr=new FileReader();fr.onload=function(){try{DB.importJSON(fr.result);toast('Imported. Reloading...');setTimeout(function(){location.reload()},700)}catch(e){toast('Invalid JSON file.')}};fr.readAsText(i.files[0])};i.click()};
$('#rs',o).onclick=function(){if(confirm('Reset the database to its starting data? CreatorKit data is kept.')){DB.reset();location.reload()}}}}

document.addEventListener('DOMContentLoaded',function(){
try{if(page.indexOf('contol_estate')>-1)estate();else if(page.indexOf('alt_dining')>-1)dining();else if(page.indexOf('elite_gaming')>-1)gaming();else if(page.indexOf('ecosystem_hub')>-1)hub()}catch(e){console.error('DB init',e)}
panel()})
})();

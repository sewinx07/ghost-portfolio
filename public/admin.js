// Minimal admin client logic
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1600);
}

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  await fetch('/api/admin/login', { method: 'DELETE' });
  location.href = '/admin/login';
});

// Maintenance
document.getElementById('saveMaint')?.addEventListener('click', async () => {
  const enabled = document.getElementById('maintToggle').checked;
  const message = document.getElementById('maintMsg').value;
  const r = await fetch('/api/admin/settings', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ maintenance: String(enabled), maintenance_message: message }) });
  if (r.ok) { document.getElementById('maintStatus').textContent = enabled ? 'ENABLED' : 'DISABLED'; toast('Maintenance saved'); } else toast('Failed');
});
document.getElementById('saveOwn')?.addEventListener('click', async () => {
  const r = await fetch('/api/admin/settings', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ ownership_name: document.getElementById('ownName').value, ownership_site: document.getElementById('ownSite').value }) });
  toast(r.ok ? 'Ownership saved' : 'Failed');
});

// Projects
const projForm = document.getElementById('projForm');
document.getElementById('addProj')?.addEventListener('click', () => { projForm.style.display='grid'; projForm.reset(); projForm.id.value=''; window.scrollTo({top: projForm.offsetTop-80, behavior:'smooth'}); });
document.getElementById('cancelProj')?.addEventListener('click', () => { projForm.style.display='none'; projForm.reset(); });
projForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(projForm);
  const tech = (fd.get('technologies')||'').toString().split(',').map(s=>s.trim()).filter(Boolean);
  const feat = (fd.get('features')||'').toString().split(/[\n,]+/).map(s=>s.trim()).filter(Boolean);
  const body = {
    id: fd.get('id')||undefined,
    title: fd.get('title'), slug: fd.get('slug'), category: fd.get('category'), year: fd.get('year'), role: fd.get('role'),
    technologies: JSON.stringify(tech), thumbnail: fd.get('thumbnail'), image: fd.get('image')||'', featured: fd.get('featured')?'1':'0',
    link: fd.get('link')||'', source: fd.get('source')||'', overview: fd.get('overview'), process: fd.get('process'), features: JSON.stringify(feat), result: fd.get('result')
  };
  const r = await fetch('/api/admin/projects', { method: body.id ? 'PUT' : 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
  toast(r.ok ? 'Project saved' : 'Failed'); if(r.ok) location.reload();
});
document.querySelectorAll('.editProj').forEach(btn => btn.addEventListener('click', () => {
  const tr = btn.closest('tr'); const p = JSON.parse(tr.dataset.proj);
  projForm.style.display='grid'; projForm.id.value=p.id; projForm.title.value=p.title; projForm.slug.value=p.slug; projForm.category.value=p.category; projForm.year.value=p.year; projForm.role.value=p.role;
  projForm.technologies.value=p.technologies.join(', '); projForm.thumbnail.value=p.thumbnail; projForm.image.value=p.image||''; projForm.featured.checked=!!p.featured;
  projForm.link.value=p.link||''; projForm.source.value=p.source||''; projForm.overview.value=p.overview; projForm.process.value=p.process; projForm.features.value=p.features.join('\n'); projForm.result.value=p.result;
  window.scrollTo({top: projForm.offsetTop-80, behavior:'smooth'});
}));
document.querySelectorAll('.delProj').forEach(btn => btn.addEventListener('click', async () => {
  const tr = btn.closest('tr'); const p = JSON.parse(tr.dataset.proj);
  if(!confirm(`Delete ${p.title}?`)) return; const r = await fetch(`/api/admin/projects?id=${p.id}`, { method:'DELETE' }); toast(r.ok?'Deleted':'Failed'); if(r.ok) tr.remove();
}));

// Navigation
document.getElementById('navForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const rows = [...document.querySelectorAll('#navForm [data-nav-id]')].map(r => ({id: r.dataset.navId, ref: r.querySelector('.nav-ref').value, label: r.querySelector('.nav-label').value, position: Number(r.querySelector('.nav-pos').value)||0, visible: r.querySelector('.nav-vis').checked?1:0}));
  const r = await fetch('/api/admin/navigation', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(rows) });
  toast(r.ok?'Nav saved':'Failed');
});

// Skills
const skForm = document.getElementById('skillForm');
document.getElementById('addSkill')?.addEventListener('click', ()=>{skForm.style.display='flex'; skForm.reset(); skForm.name.focus();});
document.getElementById('cancelSkill')?.addEventListener('click', ()=>{skForm.style.display='none';});
skForm?.addEventListener('submit', async (e)=>{ e.preventDefault(); const fd=new FormData(skForm); const body={group_title:fd.get('group_title'), name:fd.get('name'), position:Number(fd.get('position'))||0}; const r=await fetch('/api/admin/skills',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); toast(r.ok?'Skill saved':'Failed'); if(r.ok) location.reload(); });
document.querySelectorAll('.delSkill').forEach(btn=>btn.addEventListener('click',async()=>{const tr=btn.closest('tr'); const s=JSON.parse(tr.dataset.skill); if(!confirm(`Delete ${s.name}?`)) return; const r=await fetch(`/api/admin/skills?id=${s.id}`,{method:'DELETE'}); toast(r.ok?'Deleted':'Failed'); if(r.ok) tr.remove();}));

// Experience
const expForm = document.getElementById('expForm');
document.getElementById('addExp')?.addEventListener('click', ()=>{expForm.style.display='grid'; expForm.reset();});
document.getElementById('cancelExp')?.addEventListener('click', ()=>{expForm.style.display='none';});
expForm?.addEventListener('submit', async (e)=>{ e.preventDefault(); const fd=new FormData(expForm); const body={year:fd.get('year'), role:fd.get('role'), place:fd.get('place')||'', description:fd.get('description'), position:Number(fd.get('position'))||0}; const r=await fetch('/api/admin/experience',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); toast(r.ok?'Experience saved':'Failed'); if(r.ok) location.reload(); });
document.querySelectorAll('.delExp').forEach(btn=>btn.addEventListener('click',async()=>{const tr=btn.closest('tr'); const e=JSON.parse(tr.dataset.exp); if(!confirm(`Delete ${e.role} ${e.year}?`)) return; const r=await fetch(`/api/admin/experience?id=${e.id}`,{method:'DELETE'}); toast(r.ok?'Deleted':'Failed'); if(r.ok) tr.remove();}));

// Home/About/Contact/Brand/SEO
['home','about','contact','brand','seo'].forEach(kind=>{
  document.getElementById(kind+'Form')?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const fd=new FormData(e.target);
    const entries={}; for(const [k,v] of fd.entries()) entries[k]=String(v);
    const r=await fetch(`/api/admin/content?kind=${kind}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(entries)});
    toast(r.ok?kind.toUpperCase()+' saved':'Failed');
  });
});

// Contributors
const conForm = document.getElementById('contribForm');
document.getElementById('addContrib')?.addEventListener('click', ()=>{conForm.style.display='flex'; conForm.reset();});
document.getElementById('cancelContrib')?.addEventListener('click', ()=>{conForm.style.display='none';});
conForm?.addEventListener('submit', async (e)=>{ e.preventDefault(); const fd=new FormData(conForm); const body={name:fd.get('name'), role:fd.get('role')||'', url:fd.get('url')||''}; const r=await fetch('/api/admin/contributors',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); toast(r.ok?'Contributor saved':'Failed'); if(r.ok) location.reload(); });
document.querySelectorAll('.delContrib').forEach(btn=>btn.addEventListener('click',async()=>{const tr=btn.closest('tr'); const c=JSON.parse(tr.dataset.contrib); if(!confirm(`Delete ${c.name}?`)) return; const r=await fetch(`/api/admin/contributors?id=${c.id}`,{method:'DELETE'}); toast(r.ok?'Deleted':'Failed'); if(r.ok) tr.remove();}));

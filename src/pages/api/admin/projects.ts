import type { APIRoute } from 'astro';
import { getDb } from '@/server/db';
import { getSession } from '@/server/auth';

export const prerender = false;

function parseJsonArray(s:string){ try{ const v=JSON.parse(s); return Array.isArray(v)?v.map(String):[] } catch{return []} }

export const GET: APIRoute = async ({ request }) => {
  const sess = getSession(request);
  if (!sess?.authenticated) return new Response('Unauthorized', { status: 401 });
  const db = getDb();
  const rows = db.prepare('SELECT * FROM projects ORDER BY featured DESC, updated_at DESC, id DESC').all();
  return new Response(JSON.stringify(rows));
};

export const POST: APIRoute = async ({ request }) => {
  const sess = getSession(request);
  if (!sess?.authenticated) return new Response('Unauthorized', { status: 401 });
  const b = await request.json();
  const db = getDb();
  const st = db.prepare(`INSERT INTO projects (title,slug,category,year,role,technologies,thumbnail,image,featured,link,source,overview,process,features,result)
    VALUES (@title,@slug,@category,@year,@role,@technologies,@thumbnail,@image,@featured,@link,@source,@overview,@process,@features,@result)`);
  st.run({
    title:b.title, slug:b.slug, category:b.category, year:b.year, role:b.role,
    technologies: b.technologies || '[]', thumbnail:b.thumbnail, image:b.image||'', featured:Number(b.featured||0),
    link:b.link||'', source:b.source||'', overview:b.overview, process:b.process, features:b.features||'[]', result:b.result
  });
  return new Response(JSON.stringify({ ok: true }));
};

export const PUT: APIRoute = async ({ request }) => {
  const sess = getSession(request);
  if (!sess?.authenticated) return new Response('Unauthorized', { status: 401 });
  const b = await request.json();
  const db = getDb();
  const st = db.prepare(`UPDATE projects SET title=@title,slug=@slug,category=@category,year=@year,role=@role,technologies=@technologies,thumbnail=@thumbnail,image=@image,featured=@featured,link=@link,source=@source,overview=@overview,process=@process,features=@features,result=@result WHERE id=@id`);
  st.run({
    id:b.id, title:b.title, slug:b.slug, category:b.category, year:b.year, role:b.role,
    technologies:b.technologies||'[]', thumbnail:b.thumbnail, image:b.image||'', featured:Number(b.featured||0),
    link:b.link||'', source:b.source||'', overview:b.overview, process:b.process, features:b.features||'[]', result:b.result
  });
  return new Response(JSON.stringify({ ok: true }));
};

export const DELETE: APIRoute = async ({ url, request }) => {
  const sess = getSession(request);
  if (!sess?.authenticated) return new Response('Unauthorized', { status: 401 });
  const id = url.searchParams.get('id');
  if (!id) return new Response('Bad', { status: 400 });
  const db = getDb();
  db.prepare('DELETE FROM projects WHERE id=?').run(Number(id));
  return new Response(JSON.stringify({ ok: true }));
};

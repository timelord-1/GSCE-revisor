from pathlib import Path
import fitz,subprocess,json,hashlib,re
import argparse
parser=argparse.ArgumentParser(description='Recursively verify PDFs; does not analyse or edit flashcards.')
parser.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[1]/'Application questions')
parser.add_argument('--output',type=Path,default=Path('/tmp/trilogy-pdf-check'))
args=parser.parse_args();root=args.root.resolve();out=args.output.resolve();out.mkdir(parents=True,exist_ok=True);records=[]
files=sorted(p for p in root.rglob('*') if p.is_file() and p.suffix.lower()=='.pdf')
print('PDF inventory:')
for p in files: print(p.relative_to(root))
print('TOTAL FILES',len(files),'(expected by original request: 19)')
if not files: raise SystemExit('No PDFs found')
for n,p in enumerate(files,1):
 rel=p.relative_to(root).as_posix();dest=out/f'{n:02}';dest.mkdir(exist_ok=True)
 r={'number':n,'path':rel,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size,'accessible':False,'extraction':'pending','analysis':'pending','batch':'specification' if n==1 else '/'.join(p.parts[-3:-1])}
 try:
  doc=fitz.open(p)
  if doc.needs_pass and not doc.authenticate(''):raise ValueError('PDF requires an unavailable password')
  r['pages']=len(doc);texts=[];page_status=[]
  for i,page in enumerate(doc):
   text=page.get_text(sort=True);texts.append(text)
   pix=page.get_pixmap(matrix=fitz.Matrix(0.6,0.6),alpha=False);pix.save(dest/f'page-{i+1:03}.png')
   images=len(page.get_images());page_status.append({'page':i+1,'characters':len(text.strip()),'embeddedImages':images,'rendered':True,'blankText':not bool(text.strip())})
  (dest/'text.txt').write_text('\n'.join(f'\n=== PAGE {i+1} ===\n{t}' for i,t in enumerate(texts)))
  proc=subprocess.run(['pdftotext','-layout',str(p),str(dest/'layout.txt')],capture_output=True,text=True)
  if proc.returncode:raise ValueError('pdftotext failed: '+proc.stderr.strip())
  layout=(dest/'layout.txt').read_text();layout_pages=layout.split('\f');layout_pages=layout_pages[:-1] if not layout_pages[-1].strip() else layout_pages
  if len(layout_pages)!=len(doc):raise ValueError(f'Page count mismatch: {len(doc)} in PDF vs {len(layout_pages)} extracted')
  r.update(accessible=True,extraction='complete-text-and-page-images',characters=sum(len(t) for t in texts),blankTextPages=[x['page'] for x in page_status if x['blankText']],pagesWithImages=[x['page'] for x in page_status if x['embeddedImages']],extractorWarnings=proc.stderr.strip(),pageStatus=page_status)
 except Exception as e:r['extraction']='failed';r['error']=str(e)
 records.append(r)
 print(f"{n:02} | {rel} | {r.get('pages','?')} pages | {r['extraction']} | blank-text pages: {r.get('blankTextPages',[])}",flush=True)
(out/'manifest.json').write_text(json.dumps(records,indent=2))
print('TOTAL',len(records),'ACCESSIBLE',sum(r['accessible'] for r in records),'PAGES',sum(r.get('pages',0) for r in records))
if any(not r['accessible'] for r in records):raise SystemExit(1)

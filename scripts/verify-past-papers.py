"""Check the complete downloaded library; writes a report, never edits flashcards."""
import json,re,hashlib,pathlib,subprocess,sys
import fitz
root=pathlib.Path(__file__).resolve().parents[1]
catalog=json.loads(subprocess.check_output(['node','-e','process.stdout.write(JSON.stringify(require("./src/papers-data.js")))'],cwd=root,text=True))
records=[];failures=[]
for document in catalog['documents']:
 record={'id':document['id'],'filename':document['filename'],'source':document['url'],'status':'failed'}
 try:
  file=root/'src/assets/past-papers'/document['filename'];content=file.read_bytes()
  assert len(content)==document['bytes'] and hashlib.sha1(content).hexdigest()==document['sha1'],'AQA hash/size mismatch'
  pdf=fitz.open(file)
  if pdf.needs_pass and not pdf.authenticate(''):raise ValueError('PDF requires a password')
  assert len(pdf)>0,'Empty PDF'
  first=re.sub('[^A-Z0-9]','',pdf[0].get_text().upper())
  assert document['filename'][4:11] in first,'Qualification/paper/tier does not match the cover'
  assert str(document['year']) in first,'Year does not match the cover'
  notes=[];characters=0
  for index,page in enumerate(pdf):
   text=page.get_text();characters+=len(text);page.get_pixmap(matrix=fitz.Matrix(.15,.15),alpha=False)
   if re.search(r'cannot be reproduced|not reproduced.*copyright|removed.*copyright',text,re.I):notes.append({'page':index+1,'note':'The original publisher reports omitted copyright material.'})
  record.update(status='verified',pages=len(pdf),renderedPages=len(pdf),textCharacters=characters,sha256=hashlib.sha256(content).hexdigest(),sourceOmissions=notes)
  print(f"{document['filename']}: {len(pdf)} pages verified",flush=True)
 except Exception as error:
  record['error']=str(error);failures.append(record)
 records.append(record)
report={'qualification':'8464','documents':records,'totalFiles':len(records),'totalPages':sum(r.get('pages',0) for r in records),'failures':len(failures)}
(root/'dist').mkdir(exist_ok=True);(root/'dist/PAPER-VERIFICATION.json').write_text(json.dumps(report,indent=2)+'\n')
print(f"TOTAL {len(records)} PDFs / {report['totalPages']} pages; {len(failures)} failures")
if failures:
 print(json.dumps(failures,indent=2));sys.exit(1)

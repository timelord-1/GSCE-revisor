const {BrowserWindow,dialog,ipcMain,app}=require('electron');
const path=require('node:path');
const catalog=require('./papers-data.js');
const {createPaperStore}=require('./paper-files.cjs');
function registerPaperWindows(getOwner,{smokeTest=false}={}) {
  const cacheRoot=path.join(app.getPath(smokeTest?'temp':'userData'),smokeTest?'trilogy-paper-smoke-cache':'past-papers');
  const store=createPaperStore({root:path.join(__dirname,'assets/past-papers'),cacheRoot,catalog});
  const viewers=new Map();
  function checkCaller(event) {
    const owner=getOwner();
    if (!owner || owner.isDestroyed() || event.sender!==owner.webContents || event.senderFrame!==owner.webContents.mainFrame) throw new Error('This window cannot access past papers.');
    return owner;
  }
  ipcMain.handle('papers:open',async(event,id)=>{
    try {
      const owner=checkCaller(event),document=store.get(id),file=await store.prepare(id);
      const previous=viewers.get(id);if(previous&&!previous.isDestroyed()){previous.focus();return {ok:true};}
      const viewer=new BrowserWindow({parent:owner,width:1000,height:850,show:!smokeTest,title:document.filename,webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false,plugins:true,...(smokeTest?{partition:'trilogy-paper-smoke'}:{})}});
      viewers.set(id,viewer);viewer.setMenuBarVisibility(false);viewer.webContents.setWindowOpenHandler(()=>({action:'deny'}));viewer.webContents.on('will-navigate',event=>event.preventDefault());
      viewer.webContents.session.setPermissionRequestHandler((_webContents,_permission,callback)=>callback(false));
      viewer.on('closed',()=>viewers.delete(id));
      try {await viewer.loadFile(file);}catch(error){viewer.close();throw error;}
      return {ok:true};
    }catch {return {ok:false,error:'Could not open this PDF. Reinstall the app if its bundled files are missing or damaged.'};}
  });
  ipcMain.handle('papers:save',async(event,id)=>{
    try {
      const owner=checkCaller(event),document=store.get(id);
      const choice=await dialog.showSaveDialog(owner,{title:'Save AQA PDF',defaultPath:path.join(app.getPath('downloads'),document.filename),filters:[{name:'PDF document',extensions:['pdf']}]});
      if(choice.canceled||!choice.filePath)return {ok:true,cancelled:true};
      await store.saveTo(id,choice.filePath);return {ok:true};
    }catch {return {ok:false,error:'Could not save this PDF. Check the destination is writable and try again.'};}
  });
}
module.exports={registerPaperWindows};

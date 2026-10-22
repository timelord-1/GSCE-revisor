const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('trilogyPapers',{
  open:id=>ipcRenderer.invoke('papers:open',id),
  save:id=>ipcRenderer.invoke('papers:save',id)
});

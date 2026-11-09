// Custom interactions for La Plaza. Motion follows the light, the menu and the visit.
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const heroImage=document.querySelector('.hero-image');
let sceneRequest=0;
document.querySelectorAll('[data-light]').forEach(button=>button.addEventListener('click',async()=>{
 const request=++sceneRequest;
 const scenes={architecture:['assets/4k/architecture-v2.webp','Visualización arquitectónica de La Plaza al anochecer'],kitchen:['assets/4k/venue-14.webp','Langostinos al pil-pil en La Plaza'],terrace:['assets/4k/venue-01.webp','La terraza a plena luz'],bar:['assets/4k/venue-02.webp','La barra de La Plaza']};
 const [src,description]=scenes[button.dataset.light];
 const img=new Image();img.src=src;
 try{await img.decode()}catch{return;}
 if(request!==sceneRequest)return;
 heroImage.getAnimations().forEach(animation=>animation.cancel());
 document.querySelectorAll('[data-light]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 heroImage.src=src;
 heroImage.alt=description;document.querySelector('.hero-image-index').textContent=description.toUpperCase();
 if(!reduceMotion.matches)heroImage.animate([{opacity:.45},{opacity:1}],{duration:550,easing:'ease-out'});
}));

const gallerySection=document.querySelector('#galeria');
const browseButton=document.createElement('button');browseButton.className='button button-outline browse-gallery';browseButton.textContent='Explorar La Plaza ↗';browseButton.setAttribute('aria-expanded','false');
const collection=document.createElement('div');collection.className='collection';collection.hidden=true;collection.id='collection';browseButton.setAttribute('aria-controls','collection');
const collectionIntro=document.createElement('p');collectionIntro.className='collection-intro';collectionIntro.textContent='Distintas horas. Distintas mesas. La misma plaza.';
const collectionFilters=document.createElement('div');collectionFilters.className='collection-filters';collectionFilters.setAttribute('role','group');collectionFilters.setAttribute('aria-label','Filtrar imágenes');
const collectionGrid=document.createElement('div');collectionGrid.className='collection-grid';
const collectionStatus=document.createElement('p');collectionStatus.className='collection-status';collectionStatus.setAttribute('role','status');
const loadMore=document.createElement('button');loadMore.className='button button-outline';loadMore.textContent='Ver más momentos';
collection.append(collectionIntro,collectionFilters,collectionGrid,collectionStatus,loadMore);gallerySection.append(browseButton,collection);
let catalog=[],filtered=[],visibleCount=0,selectedCategory='Todas';
const labelFor=category=>/vino/i.test(category)?'La bodega':/postre/i.test(category)?'Algo dulce':/cocina|plato|gastronom/i.test(category)?'En la mesa':/bebida|copa|cocktail/i.test(category)?'Las copas':'El local';
function openCatalogImage(index){
 const item=filtered[index];
 activeCatalogIndex=index;
 const dialog=document.querySelector('#catalog-dialog');
 const img=dialog.querySelector('img');img.src=item.src;img.alt=item.title;
 dialog.querySelector('.catalog-caption').textContent=`${index+1} / ${filtered.length} · ${item.title}`;
 if(!dialog.open){dialog.showModal();document.body.style.overflow='hidden';}
}
let activeCatalogIndex=0;
const catalogDialog=document.createElement('dialog');catalogDialog.id='catalog-dialog';catalogDialog.className='gallery-dialog';catalogDialog.setAttribute('aria-label','Momentos de La Plaza');
catalogDialog.innerHTML='<button class="dialog-close" aria-label="Cerrar imagen">×</button><img alt=""><div class="gallery-controls"><button data-back aria-label="Imagen anterior">←</button><p class="catalog-caption"></p><button data-next aria-label="Imagen siguiente">→</button></div>';
document.body.append(catalogDialog);
catalogDialog.querySelector('.dialog-close').onclick=()=>catalogDialog.close();
catalogDialog.addEventListener('close',()=>document.body.style.overflow='');
const advance=step=>openCatalogImage((activeCatalogIndex+step+filtered.length)%filtered.length);
catalogDialog.querySelector('[data-back]').onclick=()=>advance(-1);catalogDialog.querySelector('[data-next]').onclick=()=>advance(1);
catalogDialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();advance(-1);}if(e.key==='ArrowRight'){e.preventDefault();advance(1);}});
function appendImages(){
 const stop=Math.min(visibleCount+12,filtered.length);
 for(let i=visibleCount;i<stop;i++){
  const item=filtered[i],button=document.createElement('button'),image=document.createElement('img'),caption=document.createElement('span');
  button.className='collection-item';button.setAttribute('aria-label','Ampliar: '+item.title);image.src=item.src;image.alt=item.title;image.loading='lazy';image.width=3840;image.height=2160;caption.textContent=item.title;
  button.append(image,caption);button.addEventListener('click',()=>openCatalogImage(i));collectionGrid.append(button);
 }
 visibleCount=stop;loadMore.hidden=visibleCount>=filtered.length;collectionStatus.textContent=`${visibleCount} de ${filtered.length} imágenes`;
}
function filterImages(category){selectedCategory=category;filtered=catalog.filter(i=>category==='Todas'||labelFor(i.category)===category);visibleCount=0;collectionGrid.replaceChildren();collectionFilters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===category)));appendImages();}
loadMore.onclick=appendImages;
browseButton.addEventListener('click',async()=>{
 collection.hidden=!collection.hidden;browseButton.setAttribute('aria-expanded',String(!collection.hidden));browseButton.textContent=collection.hidden?'Explorar La Plaza ↗':'Cerrar colección ×';
 if(collection.hidden||catalog.length)return;
 collectionStatus.textContent='Preparando los momentos de La Plaza…';
 try{const response=await fetch('gallery.json');if(!response.ok)throw new Error();catalog=await response.json();
  for(const label of ['En la mesa','Algo dulce','La bodega','Las copas','El local','Todas']){const b=document.createElement('button');b.className='filter';b.textContent=label;b.onclick=()=>filterImages(label);collectionFilters.append(b);}
  filterImages('En la mesa');
 }catch{collectionStatus.textContent='No se ha podido abrir la colección. Cierra y vuelve a intentarlo.';}
});


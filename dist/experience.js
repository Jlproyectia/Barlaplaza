// Custom interactions for La Plaza. Motion follows the light, the menu and the visit.
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const heroImage=document.querySelector('.hero-image');
document.querySelectorAll('[data-light]').forEach(button=>button.addEventListener('click',async()=>{
 const scenes={kitchen:['assets/venue-14.jpg','Langostinos al pil-pil en La Plaza'],terrace:['assets/venue-01.jpg','La terraza a plena luz'],bar:['assets/venue-02.jpg','La barra de La Plaza']};
 const [src,description]=scenes[button.dataset.light];
 const img=new Image();img.src=src;
 try{await img.decode()}catch{return;}
 document.querySelectorAll('[data-light]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 if(!reduceMotion.matches)await heroImage.animate([{opacity:1},{opacity:.2}],{duration:220,fill:'forwards'}).finished;
 heroImage.src=src;
 heroImage.alt=description+', recreación con IA';
 if(!reduceMotion.matches)heroImage.animate([{opacity:.2},{opacity:1}],{duration:650,fill:'forwards'});
}));

const gallerySection=document.querySelector('#galeria');
const browseButton=document.createElement('button');browseButton.className='button button-outline browse-gallery';browseButton.textContent='Explorar La Plaza ↗';browseButton.setAttribute('aria-expanded','false');
const collection=document.createElement('div');collection.className='collection';collection.hidden=true;collection.id='collection';browseButton.setAttribute('aria-controls','collection');
const collectionIntro=document.createElement('p');collectionIntro.className='collection-intro';collectionIntro.textContent='Distintas horas. Distintas mesas. La misma plaza. Imágenes recreadas con IA a partir del local real.';
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
 const img=dialog.querySelector('img');img.src=item.src;img.alt=item.title+', recreación con IA';
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
  button.className='collection-item';button.setAttribute('aria-label','Ampliar: '+item.title);image.src=item.src;image.alt=item.title;image.loading='lazy';image.width=1672;image.height=941;caption.textContent=item.title;
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

// A custom editorial sequence follows three moments at the actual venue.
const ritual=document.createElement('section');ritual.className='ritual';ritual.setAttribute('aria-labelledby','ritual-title');
ritual.innerHTML='<img class="ritual-photo" src="assets/venue-58.jpg" alt="Un arroz servido en la terraza, recreación con IA" loading="lazy" width="1672" height="941"><div class="ritual-scrim"></div><div class="ritual-copy"><h2 id="ritual-title">Una mesa.<br>Mil maneras<br>de disfrutarla.</h2><p>Empieza con algo para compartir.</p></div><div class="ritual-choices" role="group" aria-label="Momentos en La Plaza"><button aria-pressed="true" data-moment="0">El primer bocado</button><button aria-pressed="false" data-moment="1">La sobremesa</button><button aria-pressed="false" data-moment="2">La última copa</button></div>';
document.querySelector('#carta').before(ritual);
const moments=[['assets/venue-58.jpg','Empieza con algo para compartir.','Un arroz servido en la terraza'],['assets/venue-62.jpg','Hay conversaciones que merecen otro café.','Un café en una mesa de La Plaza'],['assets/venue-43.jpg','Y deja que la noche encuentre su ritmo.','Un mojito en la barra de La Plaza']];
let momentRequest=0;
ritual.querySelectorAll('button').forEach(button=>button.addEventListener('click',async()=>{
 const request=++momentRequest;const [src,copy,alt]=moments[Number(button.dataset.moment)];const replacement=new Image();replacement.src=src;
 try{await replacement.decode()}catch{return;}
 if(request!==momentRequest)return;
 const photo=ritual.querySelector('img');photo.src=src;photo.alt=alt+', recreación con IA';ritual.querySelector('.ritual-copy p').textContent=copy;
 ritual.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 if(!reduceMotion.matches)photo.animate([{opacity:.3,transform:'scale(1.025)'},{opacity:1,transform:'scale(1)'}],{duration:800,easing:'cubic-bezier(.2,.7,.2,1)'});
}));
// Category-specific photography keeps the menu grounded in the restaurant setting.
const categoryPhoto={compartir:['assets/venue-13.jpg','Tataki en una mesa de La Plaza'],principales:['assets/venue-29.jpg','Arroz en la terraza'],dulce:['assets/venue-39.jpg','El momento del postre'],copas:['assets/venue-43.jpg','Una copa en La Plaza']};
const dishIds={'Tataki de atún':13,'Cazuela de langostinos al pil-pil':14,'Berenjenas fritas con miel de caña':16,'Surtido de croquetas':15,'Tabla de jamón ibérico de bellota':37,'Surtido de quesos con denominación de origen':36,'Arroz con bogavante':17,'Arroz caldoso a la marinera':29,'Lubina':30,'Carrillada de cerdo ibérica al Pedro Ximénez':18,'Solomillo de ternera retinta a la parrilla':19,'Lomo del salmón al cava':31,'Tatín de manzana':39,'Coulant de chocolate':40,'Tarta de queso':41,'Brownie con helado de vainilla':42,'Fruta de temporada':27,'Helado tres sabores':28,'Mojito':43,'Margarita':44,'Piña colada':45,'Daiquiri':46,'Sangría':48,'Vinos':76};
let dishRequest=0;
window.addEventListener('dish-select',async event=>{
 const {name,row}=event.detail;const id=dishIds[name];if(!id)return;const request=++dishRequest;
 const src='assets/venue-'+String(id).padStart(2,'0')+'.jpg';const image=new Image();image.src=src;
 try{await image.decode()}catch{return;}if(request!==dishRequest||!row.isConnected)return;
 document.querySelectorAll('.menu-item.selected').forEach(r=>{r.classList.remove('selected');r.querySelector('.dish-inline')?.remove();});
 row.classList.add('selected');image.className='dish-inline';image.alt=name+', recreación con IA';image.width=1672;image.height=941;row.append(image);
 const main=document.querySelector('.menu-photo-wrap img');main.src=src;main.alt=image.alt;main.hidden=false;
 document.querySelector('.menu-caption').textContent=name;
 if(!reduceMotion.matches)main.animate([{opacity:.2,transform:'scale(1.02)'},{opacity:1,transform:'scale(1)'}],{duration:600});
});
document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{const [src,alt]=categoryPhoto[b.dataset.category];const photo=document.querySelector('.menu-photo-wrap img');const next=new Image();next.src=src;next.onload=()=>{photo.src=src;photo.alt=alt+', recreación con IA';photo.hidden=false;photo.parentElement.querySelector('.photo-failure').hidden=true;};}));



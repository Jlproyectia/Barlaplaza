const persistentHeader=document.querySelector('.header');
const headerSentinel=document.createElement('div');headerSentinel.className='header-sentinel';headerSentinel.setAttribute('aria-hidden','true');document.querySelector('main').prepend(headerSentinel);
new IntersectionObserver(([entry])=>persistentHeader.classList.toggle('is-scrolled',!entry.isIntersecting),{rootMargin:'-72px 0px 0px 0px'}).observe(headerSentinel);
// One restrained reveal vocabulary, independent of scrolling speed.
const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!still){const arrival=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('arrived');arrival.unobserve(entry.target);}}),{threshold:.07});document.querySelectorAll('.bodega-heading,.wine-rail figure,.gallery-tile,.visit-details').forEach((el,i)=>{el.classList.add('arrival');el.style.setProperty('--arrival-delay',`${(i%3)*70}ms`);arrival.observe(el);});}
// Stable menu category transitions; image details always open in the same viewer.
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{if(still)return;document.querySelector('#menu-items').animate([{opacity:.4,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:430,easing:'cubic-bezier(.2,.7,.2,1)'});}));
// Close the mobile navigation when entering a section, while retaining the header.
document.querySelectorAll('#mobile-nav a').forEach(link=>link.addEventListener('click',()=>document.querySelector('#mobile-nav').hidden=true));

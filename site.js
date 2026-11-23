(() => {
  const button = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.submenu');
  if (button && menu) {
    button.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', e => {
      if (e.target.closest('a')) {menu.classList.remove('open'); button.setAttribute('aria-expanded', 'false')}
    });
  }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealed = [...document.querySelectorAll('.reveal')];
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealed.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => {
      if (isIntersecting) {target.classList.add('is-visible');observer.unobserve(target)}
    }), {threshold:0.07,rootMargin:'0px 0px -12px 0px'});
    revealed.forEach(el => observer.observe(el));
  }
  if (reducedMotion) return;
  const h1 = document.querySelector('.hero h1[data-typing="true"]');
  if (!h1) return;
  // Réserve la largeur du titre complet pour éviter tout saut de mise en page.
  const label = h1.textContent.trim().replace(/\s+/g,' ');
  const originals = [...h1.childNodes];
  const layout = document.createElement('span'); layout.className='typing-layout';
  originals.forEach(n => layout.appendChild(n));
  const display = document.createElement('span'); display.className='typing-screen typing-caret'; display.setAttribute('aria-hidden','true');
  h1.setAttribute('aria-label',label);
  h1.append(layout,display);
  const segments=[];
  for (const node of layout.childNodes) {
    if (node.nodeType===3) segments.push({text:node.textContent,em:false});
    else segments.push({text:node.textContent,em:node.tagName==='EM'});
  }
  const units=segments.flatMap(seg=>Array.from(seg.text).map(char=>({char,em:seg.em})));
  let written=0;
  let currentEm=null;
  function appendChar({char,em}) {
    if (em) {
      if (!currentEm) {currentEm=document.createElement('em');display.appendChild(currentEm)}
      currentEm.appendChild(document.createTextNode(char));
    } else {
      currentEm=null;
      display.appendChild(document.createTextNode(char));
    }
  }
  function typeNext() {
    if (written<units.length) {
      appendChar(units[written++]);
      window.setTimeout(typeNext, written===1?170:43);
    } else {
      window.setTimeout(()=>display.classList.remove('typing-caret'),1250);
    }
  }
  window.setTimeout(typeNext,350);
})();

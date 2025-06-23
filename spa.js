window.addEventListener('DOMContentLoaded', () => {
  // 1) fire the grain once (it will not re-init on page swaps)
  grained('#grain-overlay', {
    animate: true,
    patternWidth: 500,
    patternHeight: 500,
    grainOpacity: 0.05,
    grainDensity: 1,
    grainWidth: 2,
    grainHeight: 1
  });

  // 2) load the first partial
  loadPage('partials/home.html');
});

let headerInterval = null;

async function loadPage(url) {
  const page = document.getElementById('page');

  page.classList.remove('fade-in');
  page.classList.add('fade-out'); // force faster fade out

  setTimeout(async () => {
    page.innerHTML = await (await fetch(url)).text();
    page.classList.remove('fade-out'); // clean up
    page.classList.add('fade-in'); // slower fade in
    setupHeaderTransition();
    setupLinks();
  }, 800); // must match fade-out duration
}

function setupHeaderTransition() {
  if (headerInterval) clearInterval(headerInterval);

  const header = document.getElementById('dynamicHeader');
  if (!header) return;

  const texts = ["I'm Shad.", ".شادمهر هستم"];
  let idx = 0;

  // Initially ensure visible
  header.classList.remove('hidden');

  headerInterval = setInterval(() => {
    // 1. Fade out by adding .hidden
    header.classList.add('hidden');

    // 2. After fade-out duration (matches CSS), swap and fade in
    setTimeout(() => {
      idx = (idx + 1) % texts.length;
      const link = header.querySelector('a');
      if (link) {
        link.textContent = texts[idx];
      } else {
        header.textContent = texts[idx];
      }
      // 3. Fade back in
      header.classList.remove('hidden');
    }, 1000); // <-- this matches your CSS transition: 1s
  }, 4000);
}

function setupLinks() {
  document.querySelectorAll('a[data-link]').forEach(a => {
    a.onclick = e => {
      e.preventDefault();
      const href = a.getAttribute('href');
      const partial = href === '/' ? 'partials/home.html' : `partials${href}`;
      history.pushState(null, '', href);
      loadPage(partial);
    };
  });
}

window.onpopstate = () => {
  const partial = location.pathname === '/' 
    ? 'partials/home.html' 
    : `partials${location.pathname}`;
  loadPage(partial);
};

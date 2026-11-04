const list = document.getElementById('docs');
const status = document.getElementById('status');
const categories = document.getElementById('categories');
const query = document.getElementById('q');
const sort = document.getElementById('sort');
const empty = document.getElementById('empty');
const themeToggle = document.getElementById('theme-toggle');
let docs = [];
let category = '';

// docs.json 값은 textContent로만 넣어 마크업으로 해석되지 않게 한다.
function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function link(text, href) {
  const a = el('a', text);
  a.href = href;
  return a;
}

function card(doc) {
  const li = el('li');
  const h2 = el('h2');
  h2.append(link(doc.title, doc.path));
  const meta = el('div', '', 'meta');
  const date = doc.translated_at ? ' · 번역일 ' + doc.translated_at : '';
  meta.append(el('span', doc.category + date));
  if (doc.source_url) {
    const source = link('원문 ↗', doc.source_url);
    source.className = 'source-link';
    source.setAttribute('aria-label', doc.title + ' 원문 보기');
    meta.append(source);
  } else {
    meta.append(el('span', '원문 미확인'));
  }
  li.append(h2, el('p', doc.description), meta);
  return li;
}

function render() {
  const shown = visibleDocs(docs, { query: query.value, category, sort: sort.value });
  list.replaceChildren(...shown.map(card));
  empty.hidden = shown.length > 0;
  status.textContent = query.value.trim() || category
    ? `검색 결과 ${shown.length}개`
    : `${docs.length}개 문서`;
}

function selectCategory(name) {
  category = name;
  for (const b of categories.children) b.setAttribute('aria-pressed', String(b.dataset.category === name));
  render();
}

function renderCategories() {
  const names = ['', ...new Set(docs.map((d) => d.category))];
  categories.replaceChildren(...names.map((name) => {
    const count = name ? docs.filter((d) => d.category === name).length : docs.length;
    const b = el('button', `${name || '전체'} ${count}`);
    b.type = 'button';
    b.dataset.category = name;
    b.setAttribute('aria-pressed', String(name === category));
    b.addEventListener('click', () => selectCategory(name));
    return b;
  }));
}

function syncThemeToggle() {
  const label = document.documentElement.getAttribute('data-theme') === 'dark'
    ? '라이트 테마로 전환'
    : '다크 테마로 전환';
  themeToggle.setAttribute('aria-label', label);
  themeToggle.title = label;
}

themeToggle.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
  syncThemeToggle();
});
syncThemeToggle();

document.getElementById('filters').addEventListener('submit', (e) => e.preventDefault());
query.addEventListener('input', render);
sort.addEventListener('change', render);
document.getElementById('reset').addEventListener('click', () => {
  query.value = '';
  selectCategory('');
  query.focus(); // 초기화 버튼이 사라져도 키보드 위치를 잃지 않게 한다.
});

fetch('docs.json')
  .then((r) => {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  })
  .then((data) => {
    docs = data;
    renderCategories();
    document.getElementById('sort-control').hidden = false;
    render();
  })
  .catch(() => {
    status.textContent = '문서 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
  });

// ============================================================
//  منطق الموقع: عرض المنتجات، السلة، وإرسال الطلب على واتساب
// ============================================================

const $ = (id) => document.getElementById(id);
const money = (n) => `${n.toLocaleString("en-US")} ج`;
// أيقونة من مجموعة الأيقونات الموحدة (الأسماء في أول index.html)
const ico = (name, cls = "") => `<svg class="ico ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

// الشاشة الحالية: { type: "home" } | { type: "cat", id } | { type: "brand", name }  (والبحث بيعرض نتائج لوحده)
let view = { type: "home" };

/* ---------- العروض (OFFER في products.js) ---------- */
const OFFER_CFG = typeof OFFER !== "undefined" ? OFFER : null;
function offerActive() {
  if (!OFFER_CFG || !OFFER_CFG.until) return false;
  return new Date() <= new Date(OFFER_CFG.until + "T23:59:59");   // بيشمل آخر يوم
}
// بنطبّق نسب الخصم على المنتجات (السعر القديم بيتحط تلقائياً) طول ما العرض شغال
function applyOffers() {
  if (!offerActive()) return;
  (OFFER_CFG.items || []).forEach(({ id, percent }) => {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p || p._offer) return;
    p._offer = true;
    p.oldPrice = p.price;
    p.price = Math.round((p.price * (100 - percent)) / 100);
    p.badge = `خصم ${percent}%`;
  });
}
const offerEnd = () => {
  const [y, m, d] = OFFER_CFG.until.split("-");
  return `${Number(d)}/${Number(m)}`;
};
applyOffers();
let searchTerm = "";
let cart = loadCart();

/* ---------- تخزين السلة في المتصفح ---------- */
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    // نتأكد إن المنتجات لسه موجودة في القائمة وإن المقاس (لو مطلوب) لسه صحيح
    return saved.filter((i) => {
      const p = PRODUCTS.find((x) => x.id === i.id);
      return p && p.inStock && !catHidden(p.category) && (!hasSizes(p) || p.sizes.includes(i.size));
    });
  } catch (e) {
    return [];
  }
}
// المنتج ليه مقاسات لو عنده sizes في products.js
function hasSizes(p) {
  return Array.isArray(p.sizes) && p.sizes.length > 0;
}
function saveCart() {
  try { localStorage.setItem("cart", JSON.stringify(cart)); } catch (e) {}
}

/* ---------- إعداد بيانات الستور في الصفحة ---------- */
function setupStore() {
  $("logoImg").alt = STORE.name;
  $("cityName").textContent = STORE.city;
  $("workingHours").textContent = STORE.workingHours;
  document.title = STORE.comingSoon
    ? `قريباً | ${STORE.name}`
    : `${STORE.name} - ملابس وكشاكيل وعطور ومذكرات وشنط | ${STORE.city}`;

  const link = `https://wa.me/${STORE.whatsapp}`;
  $("floatWhats").href = link;
  $("footerWhats").href = link;

  $("custArea").innerHTML =
    `<option value="">اختار المنطقة</option>` +
    STORE.areas.map((a) => `<option value="${a}">${a}</option>`).join("");
}

/* ---------- التصنيفات ---------- */
// تصنيف مخفي مؤقتاً (hidden: true في products.js) → هو ومنتجاته مش بيظهروا
const catHidden = (id) => CATEGORIES.some((c) => c.id === id && c.hidden);

// التصنيف الفاضي (من غير منتجات) بيختفي لوحده لحد ما تضيف له منتجات
const visibleCats = () => CATEGORIES.filter((c) => !c.hidden && c.id !== "all" && PRODUCTS.some((p) => p.category === c.id));
const brandOf = (p) => p.brand || p.vendor || "";

function renderHome() {
  // تصنيفات كبيرة
  $("catGrid").innerHTML = visibleCats()
    .map((c) => {
      const n = PRODUCTS.filter((p) => p.category === c.id).length;
      return `<button class="cat-tile" data-cat="${c.id}">
        <span class="cat-ico">${ico(c.icon)}</span>
        <span class="cat-name">${c.name}</span>
        <span class="cat-count">${n} منتج</span>
      </button>`;
    })
    .join("");

  // الأكثر مبيعاً
  const best = (typeof BEST_SELLERS !== "undefined" ? BEST_SELLERS : [])
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p) => p && !catHidden(p.category));
  $("bestRow").innerHTML = best.map((p) => cardHTML(p, "الأكثر مبيعاً")).join("");
  $("bestRow").previousElementSibling.hidden = $("bestRow").hidden = !best.length;

  // البراندات
  const brands = (typeof BRANDS !== "undefined" ? BRANDS : []).filter((b) =>
    PRODUCTS.some((p) => brandOf(p) === b.name && !catHidden(p.category))
  );
  $("brandRow").innerHTML = brands
    .map(
      (b) => `<button class="brand-tile" data-brand="${b.name}">
        <span class="brand-logo">${b.logo ? `<img src="${b.logo}" alt="${b.name}" loading="lazy">` : ico(b.icon || "star")}</span>
        <span class="brand-name">${b.name}</span>
      </button>`
    )
    .join("");
  $("brandRow").previousElementSibling.hidden = $("brandRow").hidden = !brands.length;

  renderBanners();
}

/* ---------- الأكثر مبيعاً: بيتحرك لوحده وبيقف لما العميل يلمسه ---------- */
let bestTimer = null, bestPaused = false;
function startBest() {
  clearInterval(bestTimer);
  const row = $("bestRow");
  if (!row || row.hidden) return;
  if (!row.dataset.bound) {
    row.dataset.bound = "1";
    ["touchstart", "mouseenter"].forEach((ev) => row.addEventListener(ev, () => (bestPaused = true), { passive: true }));
    ["touchend", "mouseleave"].forEach((ev) => row.addEventListener(ev, () => setTimeout(() => (bestPaused = false), 2500), { passive: true }));
  }
  bestTimer = setInterval(() => {
    if (bestPaused || row.hidden || !row.offsetParent) return;
    const step = (row.querySelector(".card") || {}).offsetWidth + 12 || 180;
    const atEnd = Math.abs(row.scrollLeft) + row.clientWidth >= row.scrollWidth - 6;
    row.scrollTo({ left: atEnd ? 0 : row.scrollLeft - step, behavior: "smooth" });   // RTL: التحرك للشمال = سالب
  }, 3000);
}

/* ---------- البانرز ---------- */
let bannerIdx = 0, bannerTimer = null;

// بانر العروض بيتضاف أول بانر طول ما العرض شغال، وبعدها البانرز العادية من BANNERS
function bannerList() {
  const base = typeof BANNERS !== "undefined" ? BANNERS : [];
  if (!offerActive()) return base;
  return [
    { title: OFFER_CFG.name, text: `${OFFER_CFG.tagline} · لحد ${offerEnd()}`, cta: "شوف العروض", icon: "tag", style: "orange", go: { view: "offers" } },
    ...base
  ];
}

function renderBanners() {
  const list = bannerList();
  const box = $("banners");
  box.hidden = !list.length;
  if (!list.length) return;
  box.innerHTML = `
    <div class="b-track" id="bTrack">
      ${list
        .map(
          (b, i) => `<div class="b-slide ${b.style === "orange" ? "b-orange" : "b-navy"}" ${b.image ? `style="background-image:url('${b.image}')"` : ""} data-go="${i}" role="button" tabindex="0">
            ${b.image ? "" : `<span class="b-icon">${ico(b.icon || "gift")}</span>
            <div class="b-text"><h3>${b.title}</h3><p>${b.text || ""}</p>${b.cta ? `<span class="b-cta">${b.cta}</span>` : ""}</div>`}
          </div>`
        )
        .join("")}
    </div>
    ${list.length > 1 ? `<div class="b-dots">${list.map((_, i) => `<button class="b-dot" data-dot="${i}" aria-label="بانر ${i + 1}"></button>`).join("")}</div>` : ""}`;
  showBanner(0);
  startBanners();
  if (box.dataset.bound) return;
  box.dataset.bound = "1";

  // السحب بالصباع
  let x0 = null;
  box.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; stopBanners(); }, { passive: true });
  box.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) showBanner(bannerIdx + (dx < 0 ? 1 : -1));   // RTL: سحب لليسار = التالي
    x0 = null;
    startBanners();
  });
  box.addEventListener("mouseenter", stopBanners);
  box.addEventListener("mouseleave", startBanners);
}

function showBanner(i) {
  const n = bannerList().length;
  bannerIdx = (i + n) % n;
  const tr = $("bTrack");
  if (tr) tr.style.transform = `translateX(${bannerIdx * 100}%)`;
  document.querySelectorAll(".b-dot").forEach((d, k) => d.classList.toggle("on", k === bannerIdx));
}
function startBanners() {
  stopBanners();
  if (bannerList().length > 1) bannerTimer = setInterval(() => showBanner(bannerIdx + 1), 4500);
}
function stopBanners() { clearInterval(bannerTimer); }

function goBanner(i) {
  const g = (bannerList()[i] || {}).go || {};
  if (g.cat && g.cat !== "all") openList({ type: "cat", id: g.cat });
  else if (g.brand) openList({ type: "brand", name: g.brand });
  else if (g.view) openList({ type: g.view });
  else if (g.info === "streak") openStreak();
  else if (g.product) openProduct(g.product);
  else if (g.coupon) {
    appliedCoupon = null;
    $("couponInput").value = g.coupon;
    openDrawer();
    if (cart.length) toggleCoupon();
  }
}

/* ---------- التنقل بين الرئيسية والقوائم ---------- */
function openList(v) {
  view = v;
  searchTerm = "";
  $("searchInput").value = "";
  $("searchPop").hidden = true;
  renderProducts();
  window.scrollTo({ top: 0 });
}
function goHome() {
  view = { type: "home" };
  searchTerm = "";
  $("searchInput").value = "";
  $("searchPop").hidden = true;
  renderProducts();
  window.scrollTo({ top: 0 });
}

/* ---------- المنتجات ---------- */
// الكروت والسلة بتستخدم نسخة مصغّرة أخف من الصورة (images/x.jpg -> images/thumbs/x.jpg)
// ولو النسخة المصغّرة مش موجودة بيرجع تلقائياً للصورة الأصلية، فمفيش حاجة هتبوظ
function thumbPath(src) {
  return src.replace(/^images\//, "images/thumbs/");
}
function productImage(p) {
  if (!p.image) return p.emoji;
  const thumb = thumbPath(p.image);
  const fallback = thumb === p.image ? "" : ` onerror="this.onerror=null;this.src='${p.image}'"`;
  return `<img src="${thumb}" alt="${p.name}" loading="lazy" decoding="async"${fallback}>`;
}

function cardHTML(p, badge) {
  const b = p._offer ? p.badge : badge || p.badge;   // شارة الخصم أهم من "الأكثر مبيعاً"
  return `
    <article class="card">
      ${b ? `<span class="badge">${b}</span>` : ""}
      <div class="p-img ${p.image ? "has-photo" : ""}" data-open="${p.id}">${productImage(p)}</div>
      <div class="p-body">
        <h3 class="p-name" data-open="${p.id}">${p.name}</h3>
        <div class="price-row">
          <span class="price">${money(p.price)}</span>
          ${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : ""}
        </div>
        <button class="add-btn" data-add="${p.id}" ${p.inStock ? "" : "disabled"}>
          ${!p.inStock ? "غير متوفر حالياً" : hasSizes(p) ? "اختار المقاس" : "أضف للسلة"}
        </button>
      </div>
    </article>`;
}

function renderProducts() {
  const term = searchTerm.trim().toLowerCase();
  const searching = !!term;
  const home = view.type === "home" && !searching;
  $("homeView").hidden = !home;
  $("listView").hidden = home;
  document.body.classList.toggle("is-home", home);
  updateHeader();
  document.querySelectorAll(".nav-link").forEach((b) => b.classList.toggle("on", !home && !searching && b.dataset.view === view.type));
  if (home) { renderHome(); startBanners(); startBest(); return; }
  stopBanners();
  clearInterval(bestTimer);

  let list = PRODUCTS.filter((p) => !catHidden(p.category));
  let title = "";
  let sub = "";
  let empty = "المنتجات هتتضاف قريباً.";
  const byIds = (ids) => ids.map((id) => list.find((p) => p.id === id)).filter(Boolean);

  if (searching) {
    list = list.filter((p) => p.name.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term));
    title = `نتائج البحث: ${searchTerm.trim()}`;
    empty = "مفيش منتجات مطابقة للبحث.";
  } else if (view.type === "cat") {
    list = list.filter((p) => p.category === view.id);
    const c = CATEGORIES.find((x) => x.id === view.id);
    title = c ? c.name : "";
  } else if (view.type === "brand") {
    list = list.filter((p) => brandOf(p) === view.name);
    title = `البراند: ${view.name}`;
  } else if (view.type === "offers") {
    const on = offerActive();
    title = OFFER_CFG ? OFFER_CFG.name : "العروض";
    list = on ? byIds(OFFER_CFG.items.map((i) => i.id)) : [];
    sub = on ? `${OFFER_CFG.tagline} · العروض شغالة لحد ${offerEnd()}` : "العروض خلصت، تابعنا للعروض الجاية.";
    empty = "مفيش عروض شغالة دلوقتي.";
  } else if (view.type === "suggest") {
    title = "المقترحات";
    list = byIds(typeof SUGGESTED !== "undefined" ? SUGGESTED : []);
    sub = "اخترناها لك";
  }

  $("listTitle").textContent = title;
  $("listSub").textContent = sub;
  $("listSub").hidden = !sub;
  $("emptyMsg").hidden = list.length > 0;
  $("emptyMsg").textContent = empty;
  $("productsGrid").innerHTML = list.map((p) => cardHTML(p)).join("");
  // قسم أكواد الخصم في صفحة العروض متوقف (عشان يرجع: شيل // من السطر اللي تحت)
  // renderCodes(!searching && view.type === "offers");
}

/* ---------- أكواد الخصم في صفحة العروض ---------- */
function describeCoupon(c) {
  const v = c.type === "percent" ? `خصم ${c.value}%` : `خصم ${c.value} ج`;
  const min = c.minOrder ? ` على طلبات ${money(c.minOrder)} أو أكتر` : "";
  const exp = c.expires ? ` · لحد ${Number(c.expires.split("-")[2])}/${Number(c.expires.split("-")[1])}` : "";
  return v + min + exp;
}
function renderCodes(show) {
  const box = $("codesBox");
  const list = (typeof COUPONS !== "undefined" ? COUPONS : []).filter(
    (c) => c.public !== false && c.active !== false && (!c.expires || new Date() <= new Date(c.expires + "T23:59:59"))
  );
  box.hidden = !show || !list.length;
  if (box.hidden) return;
  box.innerHTML =
    `<h3 class="sec-title">أكواد الخصم</h3><div class="code-list">` +
    list
      .map(
        (c) => `<div class="code-card">
          <div><b class="code-txt">${c.code}</b><small>${describeCoupon(c)}</small></div>
          <button type="button" class="code-btn" data-copy="${c.code}">${ico("copy")} استخدم الكود</button>
        </div>`
      )
      .join("") +
    `</div>`;
}
function useCode(btn) {
  const code = btn.dataset.copy;
  try { navigator.clipboard && navigator.clipboard.writeText(code); } catch (e) {}
  $("couponInput").value = code;
  if (cart.length) {
    appliedCoupon = null;
    openDrawer();
    toggleCoupon();
  } else {
    btn.textContent = "اتنسخ، ضيف منتجات وهتلاقيه في السلة";
    setTimeout(() => { btn.innerHTML = `${ico("copy")} استخدم الكود`; }, 2500);
  }
}

/* ---------- الهيدر (شفاف فوق الهيرو، وبيتحول لأخضر لما تنزل) ---------- */
function updateHeader() {
  const atTop = document.body.classList.contains("is-home") && window.scrollY < 40 && $("searchPop").hidden;
  $("siteHeader").classList.toggle("solid", !atTop);
  const hint = $("scrollHint");
  if (hint) hint.classList.toggle("gone", window.scrollY > 30);
}
window.addEventListener("scroll", updateHeader, { passive: true });

function openSearch() {
  $("searchPop").hidden = false;
  updateHeader();
  $("searchInput").focus();
}
function closeSearch() {
  $("searchPop").hidden = true;
  $("searchInput").value = "";
  if (searchTerm) { searchTerm = ""; renderProducts(); }
  updateHeader();
}

/* ---------- السلة ---------- */
// نفس المنتج بمقاسين مختلفين = سطرين منفصلين في السلة
function addToCart(id, qty = 1, size = "", open = true) {
  const item = cart.find((i) => i.id === id && (i.size || "") === size);
  if (item) item.qty += qty;
  else cart.push({ id, qty, size });
  saveCart();
  renderCart();
  if (open) openDrawer();
}

function changeQty(id, size, delta) {
  const item = cart.find((i) => i.id === id && (i.size || "") === size);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((i) => i !== item);
  saveCart();
  renderCart();
}

function removeItem(id, size) {
  cart = cart.filter((i) => !(i.id === id && (i.size || "") === size));
  saveCart();
  renderCart();
}

/* ---------- كود الخصم ---------- */
// الأكواد نفسها في آخر ملف products.js (COUPONS)
const COUPON_LIST = typeof COUPONS !== "undefined" ? COUPONS : [];
let appliedCoupon = loadCoupon();

// بنوحّد شكل الكود: نشيل المسافات، نحوّل الأرقام العربي، ونكبّر الحروف
function normalizeCode(s) {
  return String(s || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
    .toUpperCase();
}

function checkCoupon(input) {
  const code = normalizeCode(input);
  if (!code) return { error: "اكتب كود الخصم الأول" };
  const c = COUPON_LIST.find((x) => x.active !== false && normalizeCode(x.code) === code);
  if (!c) return { error: "الكود ده مش صحيح" };
  if (c.expires && new Date() > new Date(c.expires + "T23:59:59")) return { error: "الكود ده انتهت صلاحيته" };
  return { coupon: c };
}

function couponDiscount(subtotal) {
  const c = appliedCoupon;
  if (!c || subtotal < (c.minOrder || 0)) return 0;
  const d = c.type === "percent" ? Math.round((subtotal * c.value) / 100) : c.value;
  return Math.min(d, subtotal);   // الخصم عمره ما يزيد عن إجمالي المنتجات
}

function saveCoupon() {
  try {
    if (appliedCoupon) localStorage.setItem("coupon", appliedCoupon.code);
    else localStorage.removeItem("coupon");
  } catch (e) {}
}
function loadCoupon() {
  try {
    const saved = localStorage.getItem("coupon");
    return saved ? checkCoupon(saved).coupon || null : null;
  } catch (e) {
    return null;
  }
}

function showCouponMsg(text, kind) {
  const el = $("couponMsg");
  el.hidden = !text;
  el.textContent = text || "";
  el.className = "coupon-msg " + (kind || "");
}

function toggleCoupon() {
  if (appliedCoupon) {                      // زرار "إلغاء"
    appliedCoupon = null;
    saveCoupon();
    $("couponInput").value = "";
    showCouponMsg("");
    renderCart();
    return;
  }
  const r = checkCoupon($("couponInput").value);
  if (r.error) { showCouponMsg(r.error, "err"); return; }
  appliedCoupon = r.coupon;
  saveCoupon();
  renderCart();
}

function renderCoupon(t) {
  const input = $("couponInput");
  const btn = $("applyCoupon");
  const applied = !!appliedCoupon;
  input.disabled = applied;
  btn.textContent = applied ? "إلغاء" : "تطبيق";
  btn.classList.toggle("remove", applied);
  if (!applied) return;

  input.value = appliedCoupon.code;
  const min = appliedCoupon.minOrder || 0;
  if (t.subtotal < min) showCouponMsg(`الكود هيشتغل لما المنتجات توصل ${money(min)} (ناقص ${money(min - t.subtotal)})`, "warn");
  else showCouponMsg(`تم تطبيق الكود، وفّرت ${money(t.discount)}`, "ok");
}

/* ---------- سلسلة الطلبات (ستريك) ---------- */
// الإعدادات في آخر ملف products.js (STREAK)
const STREAK_CFG = typeof STREAK !== "undefined" ? STREAK : null;

const pad = (n) => String(n).padStart(2, "0");
const dateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtDate = (key) => {
  const [y, m, d] = key.split("-");
  return `${d}/${m}/${y}`;
};
function daysBetween(fromKey, toKey) {
  const [y1, m1, d1] = fromKey.split("-").map(Number);
  const [y2, m2, d2] = toKey.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

function loadStreak() {
  try {
    const r = JSON.parse(localStorage.getItem("streak") || "null");
    return r && r.lastDate && r.count > 0 ? r : null;
  } catch (e) {
    return null;
  }
}
function saveStreak(day) {
  try { localStorage.setItem("streak", JSON.stringify({ count: day, lastDate: dateKey(new Date()) })); } catch (e) {}
}

// بنحسب أنهي يوم في السلسلة لو العميل طلب النهاردة
function streakStatus() {
  const today = dateKey(new Date());
  const rec = loadStreak();
  if (!STREAK_CFG || !rec) return { day: 1, rec: null, gap: null, broken: false, today };
  const max = STREAK_CFG.fees.length;
  const gap = daysBetween(rec.lastDate, today);
  if (gap === 0) return { day: Math.min(rec.count, max), rec, gap, broken: false, today };            // طلب تاني في نفس اليوم
  if (gap > 0 && gap <= STREAK_CFG.maxGapDays) return { day: Math.min(rec.count + 1, max), rec, gap, broken: false, today };
  return { day: 1, rec, gap, broken: true, today };                                                    // السلسلة اتقطعت
}

function streakFee(day) {
  const f = STREAK_CFG.fees;
  return f[Math.min(day, f.length) - 1];
}

function renderStreak(t) {
  const box = $("streakBox");
  if (!STREAK_CFG) { box.hidden = true; return; }
  box.hidden = false;

  const fees = STREAK_CFG.fees;
  const max = fees.length;
  const st = t.streak;
  const feeText = (f) => (f === 0 ? "مجاني" : `${f} ج`);

  const steps = fees
    .map((f, i) => {
      const n = i + 1;
      const cls = n < st.day ? "done" : n === st.day ? "now" : "";
      return `<div class="streak-step ${cls}"><span>يوم ${n}</span><b>${feeText(f)}</b></div>`;
    })
    .join("");

  const nextFee = fees[Math.min(st.day, max - 1)];
  let msg;
  if (!st.rec) msg = `ابدأ سلسلتك النهاردة: كل يوم جديد تطلب فيه رسوم التوصيل بتقل، لحد ما تبقى مجانية في اليوم ${max}.`;
  else if (st.broken) msg = "السلسلة اتقطعت فبدأت من الأول. ابدأ من جديد النهاردة!";
  else if (st.day >= max) msg = "وصلت لأعلى مستوى! التوصيل مجاني طول ما بتطلب كل يوم (أو بتفوّت يوم واحد بس).";
  else if (st.gap === 0) msg = `طلبت النهاردة وسلسلتك على يوم ${st.day}. اطلب بكرة وهتنزل الرسوم لـ ${feeText(nextFee)}.`;
  else msg = `ده اليوم ${st.day} من سلسلتك. اطلب بكرة (أو بعده) وهتنزل الرسوم لـ ${feeText(nextFee)}.`;

  const warn = st.ok
    ? ""
    : `طلبك لازم يوصل ${money(STREAK_CFG.minOrder)} عشان يدخل في السلسلة (ناقص ${money(STREAK_CFG.minOrder - t.subtotal)}).`;

  box.innerHTML = `
    <div class="streak-title"><span>${ico("bolt")} سلسلة الطلبات</span><span>يوم ${st.day} من ${max}</span></div>
    <div class="streak-steps">${steps}</div>
    <p class="streak-msg">${msg}</p>
    ${warn ? `<p class="streak-msg streak-warn">${warn}</p>` : ""}
    <button type="button" class="link-btn" data-info="streak">اعرف أكتر عن السلسلة</button>`;
}

/* ---------- توصيل مجاني في مواعيد محددة (المدينة الجامعية) ---------- */
// الإعدادات في آخر ملف products.js (FREE_SLOTS)
const SLOT_CFG = typeof FREE_SLOTS !== "undefined" ? FREE_SLOTS : null;
let deliverySlot = "";   // "" = لسه ما اختارش، "asap" = أقرب وقت، غير كده = مفتاح الميعاد

const isSlotArea = (area) => !!SLOT_CFG && SLOT_CFG.areas.includes(area);
const slotKey = (d) => `${dateKey(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

function slotLabel(d) {
  const today = new Date();
  const diff = Math.round(
    (new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000
  );
  const day = diff === 0 ? "اليوم" : diff === 1 ? "بكرة" : `${d.getDate()}/${d.getMonth() + 1}`;
  const h = d.getHours();
  const m = d.getMinutes();
  return `${day} الساعة ${h % 12 || 12}${m ? ":" + pad(m) : ""} ${h < 12 ? "صباحاً" : "مساءً"}`;
}

// أقرب 3 مواعيد لسه ينفع الطلب يلحقها (قبلها بـ leadMinutes على الأقل)
function upcomingSlots() {
  if (!SLOT_CFG) return [];
  const now = new Date();
  const times = [...SLOT_CFG.times].sort();
  const out = [];
  for (let day = 0; day < 3 && out.length < 3; day++) {
    for (const t of times) {
      const [h, m] = t.split(":").map(Number);
      const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + day, h, m);
      if (at - now >= SLOT_CFG.leadMinutes * 60000) out.push(at);
    }
  }
  return out.slice(0, 3);
}

function chosenSlot() {
  if (!isSlotArea($("custArea").value) || !deliverySlot || deliverySlot === "asap") return null;
  return upcomingSlots().find((s) => slotKey(s) === deliverySlot) || null;
}

function renderSlots() {
  const wrap = $("slotWrap");
  wrap.hidden = !isSlotArea($("custArea").value);
  if (wrap.hidden) {
    if (deliverySlot) { deliverySlot = ""; renderCart(); }
    return;
  }
  const slots = upcomingSlots();
  const before = deliverySlot;
  if (deliverySlot && deliverySlot !== "asap" && !slots.some((s) => slotKey(s) === deliverySlot)) deliverySlot = "";   // الميعاد فات
  $("custSlot").innerHTML =
    `<option value="">اختار ميعاد التوصيل</option>` +
    slots.map((s) => `<option value="${slotKey(s)}">${slotLabel(s)} (توصيل مجاني)</option>`).join("") +
    `<option value="asap">أقرب وقت (رسوم التوصيل العادية)</option>`;
  $("custSlot").value = deliverySlot;
  if (before !== deliverySlot) renderCart();
}

function getTotals() {
  const subtotal = cart.reduce((sum, i) => {
    const p = PRODUCTS.find((x) => x.id === i.id);
    return sum + p.price * i.qty;
  }, 0);
  const discount = couponDiscount(subtotal);
  const hasItems = cart.length > 0;
  const base = STORE.deliveryFee;

  // رسوم التوصيل: بنبدأ بالعادية وبعدين أي حاجة تخفضها (السلسلة، الإجمالي الكبير، ميعاد مجاني)
  const st = streakStatus();
  st.ok = !!STREAK_CFG && subtotal >= STREAK_CFG.minOrder;
  const amountFree = STORE.freeDeliveryFrom > 0 && subtotal >= STORE.freeDeliveryFrom;   // قبل الخصم
  const slot = chosenSlot();
  const slotFree = !!slot;
  const slotText = slot ? `${slotLabel(slot)} (توصيل مجاني)` : isSlotArea($("custArea").value) && deliverySlot === "asap" ? "أقرب وقت" : "";

  let delivery = base;
  let reason = "";
  if (st.ok) {
    const f = streakFee(st.day);
    if (f < delivery) { delivery = f; reason = "streak"; }
  }
  if (amountFree) { delivery = 0; reason = "amount"; }
  if (slotFree) { delivery = 0; reason = "slot"; }
  if (!hasItems) { delivery = 0; reason = ""; }

  let note = "";
  if (reason === "slot") note = "توصيل مجاني لأنك اخترت ميعاد من مواعيد التوصيل المجاني";
  else if (reason === "amount") note = "التوصيل مجاني على طلبك";
  else if (reason === "streak") note = delivery === 0 ? "التوصيل مجاني بسبب سلسلة طلباتك" : `خصم السلسلة: التوصيل ${money(delivery)} بدل ${money(base)}`;
  else if (hasItems && STORE.freeDeliveryFrom > 0) note = `ضيف ${money(STORE.freeDeliveryFrom - subtotal)} كمان والتوصيل يبقى مجاني`;

  return { subtotal, discount, delivery, total: subtotal - discount + delivery, free: hasItems && delivery === 0, note, streak: st, slotText };
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  $("cartCount").textContent = count;

  const hasItems = cart.length > 0;
  $("cartEmpty").hidden = hasItems;
  $("checkout").hidden = !hasItems;

  $("cartItems").innerHTML = cart
    .map((i) => {
      const p = PRODUCTS.find((x) => x.id === i.id);
      return `
      <div class="cart-item">
        <div class="ci-img">${productImage(p)}</div>
        <div>
          <div class="ci-name">${p.name}</div>
          ${i.size ? `<div class="ci-size">المقاس: <b>${i.size}</b></div>` : ""}
          <div class="ci-price">${money(p.price)} × ${i.qty} = <b>${money(p.price * i.qty)}</b></div>
          <div class="qty">
            <button data-dec="${p.id}" data-size="${i.size || ""}" aria-label="تقليل">−</button>
            <span>${i.qty}</span>
            <button data-inc="${p.id}" data-size="${i.size || ""}" aria-label="زيادة">+</button>
          </div>
        </div>
        <button class="ci-remove" data-remove="${p.id}" data-size="${i.size || ""}">حذف</button>
      </div>`;
    })
    .join("");

  const t = getTotals();
  $("sumSubtotal").textContent = money(t.subtotal);
  $("sumDelivery").textContent = t.free ? "مجاني" : money(t.delivery);
  $("discountRow").hidden = !(t.discount > 0);
  $("discountCode").textContent = appliedCoupon ? appliedCoupon.code : "";
  $("sumDiscount").textContent = money(t.discount);
  $("sumTotal").textContent = money(t.total);
  renderCoupon(t);
  renderStreak(t);
  $("freeNote").textContent = t.note;
}

/* ---------- فتح وقفل السلة ---------- */
function openDrawer() {
  renderSlots();   // نحدّث المواعيد والسلسلة على حسب الوقت الحالي
  renderCart();
  $("drawer").classList.add("open");
  $("drawer").setAttribute("aria-hidden", "false");
  $("overlay").hidden = false;
  document.body.style.overflow = "hidden";
}
function closeDrawer() {
  $("drawer").classList.remove("open");
  $("drawer").setAttribute("aria-hidden", "true");
  $("overlay").hidden = true;
  document.body.style.overflow = "";
}

/* ---------- نافذة تفاصيل المنتج ---------- */
let modalProduct = null;
let modalQty = 1;
let modalImg = 0;
let modalSize = "";

// شرائح اختيار المقاس (بتظهر بس لو المنتج عنده sizes)
function renderSizes() {
  const p = modalProduct;
  $("pmSizesWrap").hidden = !hasSizes(p);
  $("pmSizeError").hidden = true;
  $("pmSizes").innerHTML = hasSizes(p)
    ? p.sizes
        .map((s) => `<button type="button" class="size-chip ${s === modalSize ? "active" : ""}" data-pick-size="${s}">${s}</button>`)
        .join("")
    : "";
}

function pickSize(s) {
  modalSize = s;
  renderSizes();
}

// صور المعرض: images لو موجودة، وإلا image، وإلا يظهر الإيموجي
function productGallery(p) {
  if (p.images && p.images.length) return p.images;
  return p.image ? [p.image] : [];
}

function renderGallery() {
  const p = modalProduct;
  const imgs = productGallery(p);

  $("pmMain").classList.toggle("has-photo", imgs.length > 0);
  $("pmMain").innerHTML = imgs.length ? `<img src="${imgs[modalImg]}" alt="${p.name}">` : p.emoji;

  if (imgs.length > 1) {
    $("pmMain").insertAdjacentHTML(
      "beforeend",
      `<button type="button" class="nav-btn nav-prev" data-nav="-1" aria-label="الصورة السابقة">›</button>
       <button type="button" class="nav-btn nav-next" data-nav="1" aria-label="الصورة التالية">‹</button>`
    );
  }

  $("pmThumbs").innerHTML =
    imgs.length > 1
      ? imgs
          .map(
            (src, i) =>
              `<button type="button" class="thumb ${i === modalImg ? "active" : ""}" data-thumb="${i}" aria-label="صورة ${i + 1}"><img src="${src}" alt=""></button>`
          )
          .join("")
      : "";
}

function openProduct(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  modalProduct = p;
  modalQty = 1;
  modalImg = 0;
  modalSize = "";

  const cat = CATEGORIES.find((c) => c.id === p.category);
  const catText = cat ? cat.name : "";
  $("pmCat").textContent = p.vendor ? `${catText} · من ${p.vendor}` : catText;
  $("pmName").textContent = p.name;
  $("pmPrice").textContent = money(p.price);
  $("pmOldPrice").textContent = p.oldPrice ? money(p.oldPrice) : "";

  const stock = $("pmStock");
  stock.textContent = p.inStock ? "متوفر" : "غير متوفر حالياً";
  stock.className = "pm-stock " + (p.inStock ? "ok" : "out");

  renderSizes();

  $("pmDetails").textContent = p.details || p.desc;
  // مسامحين مع أخطاء الكتابة في products.js: أي مواصفة مش [اسم, قيمة] بتتجاهل بدل ما الموقع يقع
  const features = Array.isArray(p.features) ? p.features.filter(Boolean) : [];
  const specs = Array.isArray(p.specs) ? p.specs.filter((x) => Array.isArray(x) && x.length >= 2) : [];
  $("pmFeatures").innerHTML = features.map((f) => `<li>${f}</li>`).join("");
  $("pmSpecs").innerHTML = specs.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("");
  $("pmSpecs").hidden = !specs.length;

  $("pmQty").textContent = modalQty;
  $("pmAdd").disabled = !p.inStock;
  $("pmAdd").textContent = p.inStock ? "أضف للسلة" : "غير متوفر حالياً";

  renderGallery();
  $("productModal").hidden = false;
  $("productModal").querySelector(".modal-box").scrollTop = 0;
  document.body.style.overflow = "hidden";
}

function closeProduct() {
  $("productModal").hidden = true;
  modalProduct = null;
  document.body.style.overflow = "";
}

function changeModalQty(delta) {
  modalQty = Math.min(99, Math.max(1, modalQty + delta));
  $("pmQty").textContent = modalQty;
}

function shiftModalImage(step) {
  const n = productGallery(modalProduct).length;
  if (n < 2) return;
  modalImg = (modalImg + step + n) % n;
  renderGallery();
}

function addFromModal() {
  if (!modalProduct || !modalProduct.inStock) return;

  // لو المنتج ليه مقاسات لازم العميل يختار واحد
  if (hasSizes(modalProduct) && !modalSize) {
    $("pmSizeError").hidden = false;
    $("pmSizesWrap").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const id = modalProduct.id;
  const qty = modalQty;
  const size = modalSize;
  closeProduct();        // نقفل النافذة الأول عشان السلة تفتح بعدها
  addToCart(id, qty, size);
}

/* ---------- الدفع ---------- */
function selectedPay() {
  return document.querySelector('input[name="pay"]:checked').value;
}

function renderPayInfo() {
  const box = $("payInfo");
  const pay = selectedPay();
  if (pay === "cash") {
    box.hidden = true;
    return;
  }
  const info = pay === "wallet" ? STORE.wallet : STORE.instapay;
  const value = pay === "wallet" ? info.number : info.handle;
  box.hidden = false;
  box.innerHTML = `حوّل الإجمالي على: <b>${value}</b><br>وابعت صورة التحويل على واتساب بعد إرسال الطلب.`;
}

const PAY_LABELS = {
  cash: "كاش عند الاستلام",
  wallet: "محفظة إلكترونية",
  instapay: "InstaPay"
};

/* ---------- إرسال الطلب ---------- */
function validate() {
  renderSlots();   // لو الميعاد المختار فات مع الوقت بيتصفّر
  const fields = ["custName", "custPhone", "custArea", "custAddress", "custSlot"];
  fields.forEach((id) => $(id).classList.remove("invalid"));

  const errors = [];
  const name = $("custName").value.trim();
  const phone = $("custPhone").value.trim().replace(/[\s-]/g, "");
  const area = $("custArea").value;
  const address = $("custAddress").value.trim();

  if (name.length < 2) { errors.push("اكتب اسمك"); $("custName").classList.add("invalid"); }
  // أرقام مصرية: 01 + 9 أرقام (بنقبل الأرقام العربي كمان)
  const normalized = phone.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
  if (!/^01[0125]\d{8}$/.test(normalized)) { errors.push("رقم التليفون مش صحيح"); $("custPhone").classList.add("invalid"); }
  if (!area) { errors.push("اختار المنطقة"); $("custArea").classList.add("invalid"); }
  if (isSlotArea(area) && !deliverySlot) { errors.push("اختار ميعاد التوصيل"); $("custSlot").classList.add("invalid"); }
  if (address.length < 6) { errors.push("اكتب العنوان بالتفصيل"); $("custAddress").classList.add("invalid"); }

  return { errors, data: { name, phone: normalized, area, address, notes: $("custNotes").value.trim() } };
}

function buildMessage(d) {
  const t = getTotals();
  const lines = cart.map((i) => {
    const p = PRODUCTS.find((x) => x.id === i.id);
    const size = i.size ? ` (المقاس: ${i.size})` : "";
    const vendor = p.vendor ? ` — المورّد: ${p.vendor}` : "";
    return `• ${p.name}${size} × ${i.qty} = ${money(p.price * i.qty)}${vendor}`;
  });

  return [
    `طلب جديد من الموقع 🛒`,
    ``,
    `*المنتجات:*`,
    ...lines,
    ``,
    `المجموع: ${money(t.subtotal)}`,
    t.discount > 0 ? `الخصم (كود ${appliedCoupon.code}): ${money(t.discount)}` : null,
    `التوصيل: ${t.free ? "مجاني" : money(t.delivery)}`,
    t.slotText ? `ميعاد التوصيل: ${t.slotText}` : null,
    t.streak.ok
      ? `🔥 سلسلة الطلبات: يوم ${t.streak.day} من ${STREAK_CFG.fees.length} (${
          t.streak.rec ? "آخر طلب: " + (t.streak.gap === 0 ? "النهاردة" : fmtDate(t.streak.rec.lastDate)) : "أول طلب"
        })`
      : null,
    `*الإجمالي: ${money(t.total)}*`,
    ``,
    `*بيانات العميل:*`,
    `الاسم: ${d.name}`,
    `التليفون: ${d.phone}`,
    `المنطقة: ${d.area}`,
    `العنوان: ${d.address}`,
    d.notes ? `ملاحظات: ${d.notes}` : null,
    ``,
    `طريقة الدفع: ${PAY_LABELS[selectedPay()]}`,
    selectedPay() !== "cash" ? `(هبعت صورة التحويل)` : null
  ]
    .filter((l) => l !== null)
    .join("\n");
}

/* ---------- شاشة الفتافيت قبل تأكيد الطلب ---------- */
let fataOffered = false;      // بتظهر مرة واحدة بس لكل طلب
let pendingData = null;
const fataItems = () => PRODUCTS.filter((p) => p.category === "fatafeet" && p.inStock && !catHidden("fatafeet"));

function fataMessage(t) {
  const left50 = STREAK_CFG ? STREAK_CFG.minOrder - t.subtotal : 0;
  const leftFree = STORE.freeDeliveryFrom > 0 ? STORE.freeDeliveryFrom - t.subtotal : 0;
  if (left50 > 0)
    return `إجمالي المنتجات ${money(t.subtotal)}. ضيف ${money(left50)} فتافيت وطلبك يوصل الحد الأدنى (${money(STREAK_CFG.minOrder)}) ويتحسب في سلسلة الطلبات`;
  if (leftFree > 0 && leftFree <= 100)
    return `فاضل ${money(leftFree)} بس والتوصيل يبقى مجاني`;
  return "ضيف حاجة حلوة مع طلبك بنقرة واحدة.";
}

function renderFata() {
  $("fataMsg").textContent = fataMessage(getTotals());
  $("fataList").innerHTML = fataItems()
    .map((p) => {
      const it = cart.find((i) => i.id === p.id);
      return `<div class="fata-row">
        <span class="fata-emoji">${p.image ? `<img src="${thumbPath(p.image)}" alt="">` : ico("candy")}</span>
        <div class="fata-name"><b>${p.name}</b><small>${money(p.price)}</small></div>
        ${it
          ? `<div class="qty"><button data-fdec="${p.id}" aria-label="تقليل">−</button><span>${it.qty}</span><button data-finc="${p.id}" aria-label="زيادة">+</button></div>`
          : `<button class="fata-add" data-finc="${p.id}">+ أضف</button>`}
      </div>`;
    })
    .join("");
}

function openFata() {
  renderFata();
  $("fataModal").hidden = false;
  document.body.classList.add("no-scroll");
}
function closeFata() {
  $("fataModal").hidden = true;
  document.body.classList.remove("no-scroll");
}

function submitOrder(e) {
  e.preventDefault();
  const err = $("formError");
  const { errors, data } = validate();

  if (errors.length) {
    err.textContent = errors.join(" • ");
    err.hidden = false;
    return;
  }
  err.hidden = true;

  // قبل التأكيد: نعرض شاشة الفتافيت مرة واحدة
  if (!fataOffered && fataItems().length) {
    fataOffered = true;
    pendingData = data;
    openFata();
    return;
  }
  finalizeOrder(data);
}

function finalizeOrder(data) {

  const t = getTotals();   // نحسبها قبل ما نفضّي السلة
  const url = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(buildMessage(data))}`;
  window.open(url, "_blank", "noopener");

  // الطلب اتبعت: نسجّل يوم السلسلة (لو الطلب وصل للحد الأدنى)
  if (t.streak.ok) saveStreak(t.streak.day);

  // بعد الإرسال نفضّي السلة وكود الخصم
  fataOffered = false;
  pendingData = null;
  cart = [];
  saveCart();
  appliedCoupon = null;
  saveCoupon();
  $("couponInput").value = "";
  showCouponMsg("");
  renderCart();
  $("orderForm").reset();
  deliverySlot = "";
  renderSlots();
  renderPayInfo();
  closeDrawer();
}

/* ---------- شرح الستريك ---------- */
const addDays = (key, n) => {
  const d = new Date(key + "T00:00:00");
  d.setDate(d.getDate() + n);
  return dateKey(d);
};

function openStreak() {
  if (!STREAK_CFG) return;
  const fees = STREAK_CFG.fees, max = fees.length;
  const st = streakStatus();
  const feeText = (f) => (f === 0 ? "مجاني" : `${f} ج`);
  const skip = STREAK_CFG.maxGapDays - 1;

  // وضع العميل الحالي
  let you;
  if (!st.rec) you = `لسه ماطلبتش. ابدأ النهاردة، أول يوم توصيله ${feeText(fees[0])}.`;
  else if (st.broken) you = "سلسلتك القديمة اتقطعت. لو طلبت النهاردة هتبدأ من اليوم الأول.";
  else {
    const left = max - st.day;
    const deadline = fmtDate(addDays(st.rec.lastDate, STREAK_CFG.maxGapDays));
    you = st.gap === 0
      ? `إنت في اليوم ${st.day} من ${max} (توصيل ${feeText(streakFee(st.day))}). `
      : `لو طلبت النهاردة هتبقى في اليوم ${st.day} من ${max} (توصيل ${feeText(streakFee(st.day))}). `;
    you += left > 0 ? `فاضل ${left} ${left === 1 ? "يوم" : "أيام"} على التوصيل المجاني. ` : "توصيلك مجاني. ";
    you += `آخر ميعاد لطلبك الجاي عشان السلسلة متتقطعش: ${deadline}.`;
  }

  const rows = fees
    .map((f, i) => {
      const n = i + 1;
      const cur = st.rec && !st.broken ? n === st.day : n === 1;
      return `<div class="st-day ${cur ? "now" : ""} ${f === 0 ? "free" : ""}"><span>يوم ${n}</span><b>${feeText(f)}</b></div>`;
    })
    .join("");

  $("streakInfo").innerHTML = `
    <h2 id="stTitle">${ico("bolt")} ستريك كله بحسابو</h2>
    <p class="st-lead">اطلب كل يوم وتوصيلك بيرخص يوم ورا يوم لحد ما يبقى <b>مجاني</b>.</p>
    <div class="st-days">${rows}</div>
    <p class="st-you">${you}</p>
    <h3>القواعد</h3>
    <ul class="st-rules">
      <li>${ico("check")} الحد الأدنى للطلب <b>${money(STREAK_CFG.minOrder)}</b> (قبل الخصم) عشان اليوم يتحسب في السلسلة.</li>
      <li>${ico("check")} ${skip > 0 ? `مسموح تفوّت <b>${skip === 1 ? "يوم واحد" : skip + " أيام"}</b> من غير ما السلسلة تتقطع.` : "لازم تطلب كل يوم عشان السلسلة تكمل."}</li>
      <li>${ico("check")} لو فوّت أكتر من كده، السلسلة بترجع من اليوم الأول.</li>
      <li>${ico("check")} من اليوم ${max} التوصيل <b>مجاني</b> طول ما بتكمّل.</li>
      <li>${ico("check")} أكتر من طلب في نفس اليوم بيتحسبوا يوم واحد.</li>
      <li>${ico("check")} السلسلة محفوظة على جهازك ومتصفحك، ولو مسحت بيانات المتصفح هتبدأ من الأول.</li>
    </ul>
    <button type="button" class="btn-whats" id="streakOk">تمام، يلا نطلب</button>`;
  $("streakModal").hidden = false;
}
function closeStreak() { $("streakModal").hidden = true; }

/* ---------- الأحداث ---------- */
document.addEventListener("click", (e) => {
  // فتح نافذة تفاصيل المنتج (من الصورة أو الاسم أو زرار "عرض التفاصيل")
  const opener = e.target.closest("[data-open]");
  if (opener) {
    openProduct(Number(opener.dataset.open));
    return;
  }

  const ban = e.target.closest("[data-go]");
  if (ban) { goBanner(Number(ban.dataset.go)); return; }

  const t = e.target.closest("button");
  if (!t) return;
  if (t.dataset.info === "streak") { openStreak(); return; }
  if (t.id === "streakOk") { closeStreak(); return; }

  if (t.dataset.nav) shiftModalImage(Number(t.dataset.nav));
  else if (t.dataset.thumb) {
    modalImg = Number(t.dataset.thumb);
    renderGallery();
  } else if (t.dataset.view) {
    openList({ type: t.dataset.view });
  } else if (t.dataset.copy) {
    useCode(t);
  } else if (t.id === "scrollHint") {
    $("homeContent").scrollIntoView({ behavior: "smooth" });
  } else if (t.dataset.cat) {
    openList({ type: "cat", id: t.dataset.cat });
  } else if (t.dataset.brand) {
    openList({ type: "brand", name: t.dataset.brand });
  } else if (t.id === "backHome") {
    goHome();
  } else if (t.dataset.dot) {
    stopBanners(); showBanner(Number(t.dataset.dot)); startBanners();
  } else if (t.dataset.add) {
    const id = Number(t.dataset.add);
    const p = PRODUCTS.find((x) => x.id === id);
    // المنتجات اللي ليها مقاسات بتفتح النافذة عشان العميل يختار المقاس
    if (p && hasSizes(p)) openProduct(id);
    else addToCart(id);
  } else if (t.dataset.pickSize) pickSize(t.dataset.pickSize);
  else if (t.dataset.inc) changeQty(Number(t.dataset.inc), t.dataset.size || "", 1);
  else if (t.dataset.dec) changeQty(Number(t.dataset.dec), t.dataset.size || "", -1);
  else if (t.dataset.remove) removeItem(Number(t.dataset.remove), t.dataset.size || "");
});

$("openCart").addEventListener("click", openDrawer);
$("openSearch").addEventListener("click", () => ($("searchPop").hidden ? openSearch() : closeSearch()));
$("closeSearch").addEventListener("click", closeSearch);
$("closeCart").addEventListener("click", closeDrawer);
$("overlay").addEventListener("click", closeDrawer);
$("closeProduct").addEventListener("click", closeProduct);
$("productModal").addEventListener("click", (e) => { if (e.target === $("productModal")) closeProduct(); });
$("pmInc").addEventListener("click", () => changeModalQty(1));
$("pmDec").addEventListener("click", () => changeModalQty(-1));
$("pmAdd").addEventListener("click", addFromModal);
$("applyCoupon").addEventListener("click", toggleCoupon);
$("couponInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); toggleCoupon(); }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!$("streakModal").hidden) closeStreak();
    else if (modalProduct) closeProduct();
    else closeDrawer();
  } else if (modalProduct && e.key === "ArrowLeft") shiftModalImage(1);   // RTL: الشمال = التالي
  else if (modalProduct && e.key === "ArrowRight") shiftModalImage(-1);
});

$("searchInput").addEventListener("input", (e) => {
  searchTerm = e.target.value;
  renderProducts();   // لو الخانة فضيت بيرجع للرئيسية تلقائياً
});

document.querySelectorAll('input[name="pay"]').forEach((r) => r.addEventListener("change", renderPayInfo));
$("orderForm").addEventListener("submit", submitOrder);
$("streakClose").addEventListener("click", closeStreak);
$("streakModal").addEventListener("click", (e) => { if (e.target === $("streakModal")) closeStreak(); });
$("fataClose").addEventListener("click", closeFata);   // X = رجوع للسلة من غير إرسال
$("fataModal").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (b && b.dataset.finc) { addToCart(Number(b.dataset.finc), 1, "", false); renderFata(); }
  else if (b && b.dataset.fdec) { changeQty(Number(b.dataset.fdec), "", -1); renderFata(); }
  else if (e.target === $("fataModal")) closeFata();
});
// "كمّل الطلب": بنعيد التحقق لأن السلة والإجمالي اتغيروا ممكن
const fataContinue = () => {
  closeFata();
  const { errors, data } = validate();
  if (errors.length) { $("formError").textContent = errors.join(" • "); $("formError").hidden = false; return; }
  finalizeOrder(data);
};
$("fataGo").addEventListener("click", fataContinue);
$("fataSkip").addEventListener("click", fataContinue);
$("custArea").addEventListener("change", () => { renderSlots(); renderCart(); });
$("custSlot").addEventListener("change", (e) => { deliverySlot = e.target.value; renderCart(); });

/* ---------- تشغيل ---------- */
setupStore();
renderProducts();
renderCart();
renderPayInfo();
renderSlots();

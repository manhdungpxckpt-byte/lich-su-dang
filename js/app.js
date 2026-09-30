/* Ôn Thi Lịch Sử Đảng — App logic */
(function(){
"use strict";

const CHAPTERS = [
  {id:1, num:"CHƯƠNG 1", title:"Đảng ra đời & lãnh đạo giành chính quyền", desc:"1858–1945: Bối cảnh, Nguyễn Ái Quốc, Hội nghị thành lập Đảng, các cao trào cách mạng và Cách mạng tháng Tám."},
  {id:2, num:"CHƯƠNG 2", title:"Kháng chiến chống thực dân Pháp", desc:"1945–1954: Xây dựng chính quyền, toàn quốc kháng chiến, Đại hội II và chiến thắng Điện Biên Phủ."},
  {id:3, num:"CHƯƠNG 3", title:"Kháng chiến chống Mỹ, thống nhất đất nước", desc:"1954–1975: Đồng khởi, Đại hội III, Mậu Thân 1968, Paris 1973 và Đại thắng mùa Xuân 1975."},
  {id:4, num:"CHƯƠNG 4", title:"Xây dựng CNXH & mở đầu đổi mới", desc:"1975–1986: Thống nhất đất nước, Đại hội IV–V, khủng hoảng và Đại hội VI đổi mới."},
  {id:5, num:"CHƯƠNG 5", title:"Đổi mới toàn diện & CNH–HĐH", desc:"1986–2006: Đại hội VII–X, Cương lĩnh 1991, ra khỏi khủng hoảng, gia nhập WTO."},
  {id:6, num:"CHƯƠNG 6", title:"Tiếp tục đổi mới & hội nhập sâu", desc:"2006–nay: Đại hội XI–XIV, xây dựng Đảng, chống tham nhũng, chuyển đổi số, kỷ nguyên mới."}
];
const LETTERS = ["A","B","C","D"];
const LS_KEY = "lsd_progress_v1";

/* ---------- Data ---------- */
const QBANK = (window.QBANK||[]).map((q,i)=>({id:i, c:q.c, q:q.q, o:q.o, a:q.a, e:q.e||""}));
const byChapter = id => QBANK.filter(q=>q.c===id);

/* ---------- Store ---------- */
let store = {answered:{}, wrong:[], marked:[], best:{}, endlessBest:0, streak:0, lastDay:"", history:[]};
try{ const s = JSON.parse(localStorage.getItem(LS_KEY)); if(s) store = Object.assign(store, s); }catch(e){}
function save(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(store)); }catch(e){} }
function todayStr(){ return new Date().toISOString().slice(0,10); }
function touchStreak(){
  const t = todayStr();
  if(store.lastDay === t) return;
  const y = new Date(Date.now()-864e5).toISOString().slice(0,10);
  store.streak = (store.lastDay === y) ? (store.streak||0)+1 : 1;
  store.lastDay = t; save();
  const el = document.getElementById("streakNum"); if(el) el.textContent = store.streak;
}

/* ---------- Helpers ---------- */
const $ = id => document.getElementById(id);
function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function pickRandom(arr,n){ return shuffle(arr).slice(0,Math.min(n,arr.length)); }
function toast(msg){ const t=$("toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove("show"),2200); }
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function chName(id){ const c=CHAPTERS.find(c=>c.id===id); return c?c.num:""; }
function recordAnswer(q, right){
  touchStreak();
  const r = store.answered[q.id]||{t:0,r:0}; r.t++; if(right) r.r++; store.answered[q.id]=r;
  const wi = store.wrong.indexOf(q.id);
  if(!right && wi<0) store.wrong.push(q.id);
  if(right && wi>=0 && r.r>=2) store.wrong.splice(wi,1); // trả lời đúng 2 lần thì xóa khỏi danh sách sai
  save();
}
function fmtTime(s){ s=Math.max(0,s); const m=Math.floor(s/60), ss=s%60; return m+":"+String(ss).padStart(2,"0"); }

/* ---------- Router ---------- */
function navTo(name){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  $("view-"+name).classList.add("active");
  document.querySelectorAll("[data-nav]").forEach(b=>{
    if(b.classList.contains("navbtn")) b.classList.toggle("active", b.dataset.nav===name);
  });
  $("mobileNav").classList.remove("open");
  if(name==="home") renderHome();
  if(name==="review") renderReview();
  window.scrollTo({top:0, behavior:"smooth"});
}
document.querySelectorAll("[data-nav]").forEach(b=>b.addEventListener("click",e=>{e.preventDefault();navTo(b.dataset.nav);}));
$("menuBtn").addEventListener("click",()=>$("mobileNav").classList.toggle("open"));

/* ---------- Theme ---------- */
const themeBtn = $("themeBtn");
function applyTheme(d){ document.body.classList.toggle("dark",d); themeBtn.textContent=d?"☀️":"🌙"; try{localStorage.setItem("lsd_theme",d?"d":"l");}catch(e){} }
applyTheme((function(){try{return localStorage.getItem("lsd_theme")==="d";}catch(e){return false;}})());
themeBtn.addEventListener("click",()=>applyTheme(!document.body.classList.contains("dark")));

/* ---------- Home ---------- */
function stats(){
  const ids = Object.keys(store.answered);
  let t=0,r=0; ids.forEach(k=>{t+=store.answered[k].t; r+=store.answered[k].r;});
  return {done:ids.length, total:t, right:r, acc: t?Math.round(r/t*100):0};
}
function renderHome(){
  const s = stats();
  $("heroStats").innerHTML =
    `<div class="hstat"><b>${QBANK.length}</b><span>câu hỏi</span></div>`+
    `<div class="hstat"><b>${CHAPTERS.length}</b><span>chương</span></div>`+
    `<div class="hstat"><b>${s.done}</b><span>đã làm</span></div>`+
    `<div class="hstat"><b>${s.acc}%</b><span>đúng</span></div>`;
  $("streakNum").textContent = store.streak||0;
  $("chapterTotal").textContent = `• ${QBANK.length} câu`;
  $("chapterGrid").innerHTML = CHAPTERS.map(c=>{
    const list = byChapter(c.id);
    const done = list.filter(q=>store.answered[q.id]).length;
    const pct = list.length?Math.round(done/list.length*100):0;
    return `<div class="chapter" data-ch="${c.id}">
      <span class="ch-num">${c.num}</span><h4>${esc(c.title)}</h4><p>${esc(c.desc)}</p>
      <div class="ch-meta"><span class="ch-count">${list.length} câu hỏi</span><span class="ch-done">Đã làm ${done}/${list.length}</span></div>
      <div class="mini-bar"><i style="width:${pct}%"></i></div></div>`;
  }).join("");
  document.querySelectorAll(".chapter").forEach(el=>el.addEventListener("click",()=>{
    navTo("practice"); $("practiceScope").value = el.dataset.ch;
  }));
  const acc = s.total?Math.round(s.right/s.total*100):0;
  $("progressBox").innerHTML =
    `<div class="result-grid">
      <div class="result-cell"><b>${s.done}</b><span>câu đã làm</span></div>
      <div class="result-cell"><b>${s.total}</b><span>lượt trả lời</span></div>
      <div class="result-cell"><b>${acc}%</b><span>tỷ lệ đúng</span></div>
      <div class="result-cell"><b>${store.wrong.length}</b><span>câu cần ôn lại</span></div>
    </div>`;
  const keys = Object.keys(store.best);
  $("bestBox").innerHTML = keys.length
    ? keys.map(k=>`<div class="tag">🏆 Đề ${k} câu: <strong>${store.best[k]}</strong> điểm</div>`).join("")
    : `<div class="muted">Chưa có bài thi nào. Hãy vào Thi thử để lập kỷ lục!</div>`;
  const tags = ["Giáo trình LSĐ 2021","Bộ 270–730 câu SV","Đề NEU","Đề UEH","Đề HUST","Đề HVTC","Ôn thi sinh viên","Tự biên soạn & đối chiếu"];
  $("sourceTags").innerHTML = tags.map(t=>`<span class="tag">${t}</span>`).join("");
}
$("resetProgress").addEventListener("click",()=>{
  if(!confirm("Xóa toàn bộ tiến độ, câu sai và kỷ lục?")) return;
  store={answered:{},wrong:[],marked:[],best:{},endlessBest:0,streak:0,lastDay:"",history:[]};
  save(); renderHome(); renderReview(); toast("Đã xóa tiến độ. Bắt đầu lại nào! 💪");
});
$("exportBtn").addEventListener("click",()=>{
  const s=stats();
  const txt=`KẾT QUẢ ÔN TẬP LỊCH SỬ ĐẢNG\nNgày xuất: ${new Date().toLocaleString("vi-VN")}\nTổng câu đã làm: ${s.done}/${QBANK.length}\nLượt trả lời: ${s.total} • Đúng: ${s.right} (${s.acc}%)\nCâu cần ôn lại: ${store.wrong.length}\nKỷ lục thi thử: ${JSON.stringify(store.best)}\nKỷ lục vô hạn: ${store.endlessBest||0} streak\n`;
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([txt],{type:"text/plain"})); a.download="ket-qua-on-tap-lich-su-dang.txt"; a.click();
});

/* ---------- Question card renderer ---------- */
function qCardHTML(q, idx, total, opts){
  opts = opts||{};
  const order = opts.order || [0,1,2,3];
  const marked = store.marked.includes(q.id);
  return `<div class="qcard" data-qid="${q.id}">
    <div class="qhead"><span class="qnum">Câu ${idx}/${total}</span><span class="qchap">${chName(q.c)}</span>
    <button class="qmark ${marked?"on":""}" data-mark="${q.id}" title="Ghim câu hỏi">⭐</button></div>
    <p class="qtext">${esc(q.q)}</p>
    <div class="opts">${order.map((oi,k)=>`<button class="opt" data-opt="${oi}"><span class="key">${LETTERS[k]}</span><span>${esc(q.o[oi])}</span></button>`).join("")}</div>
    <div class="explain hidden"></div></div>`;
}
document.addEventListener("click",e=>{
  const m = e.target.closest("[data-mark]");
  if(m){ e.preventDefault();
    const id=+m.dataset.mark, i=store.marked.indexOf(id);
    if(i>=0){store.marked.splice(i,1); m.classList.remove("on"); toast("Đã bỏ ghim ⭐");}
    else{store.marked.push(id); m.classList.add("on"); toast("Đã ghim câu hỏi ⭐");}
    save(); return;
  }
});

/* ---------- PRACTICE ---------- */
let P = null;
function fillScope(sel, withAll){
  sel.innerHTML = (withAll?`<option value="0">🌐 Toàn bộ ngân hàng (${QBANK.length} câu)</option>`:"") +
    CHAPTERS.map(c=>`<option value="${c.id}">${c.num}: ${esc(c.title)} (${byChapter(c.id).length} câu)</option>`).join("");
}
fillScope($("practiceScope"), true);
$("practiceStart").addEventListener("click",()=>{
  const scope=+$("practiceScope").value, n=+$("practiceCount").value;
  const pool = scope===0?QBANK:byChapter(scope);
  const list = pickRandom(pool,n).map(q=>({q, order: $("practiceShuffle").checked?shuffle([0,1,2,3]):[0,1,2,3], ans:null}));
  P={list, i:0, right:0, instant:$("practiceInstant").checked};
  $("practiceSetup").classList.add("hidden"); $("practiceResult").classList.add("hidden");
  $("practiceBox").classList.remove("hidden"); renderPractice();
  window.scrollTo({top:$("practiceBox").offsetTop-80,behavior:"smooth"});
});
function renderPractice(){
  const cur=P.list[P.i];
  $("practiceProg").textContent=`Câu ${P.i+1}/${P.list.length}`;
  $("practiceScore").textContent=`✅ ${P.right} đúng`;
  $("practiceBar").style.width=Math.round((P.i)/P.list.length*100)+"%";
  const box=$("practiceQ");
  box.innerHTML=qCardHTML(cur.q,P.i+1,P.list.length,{order:cur.order});
  if(cur.ans!==null) paintPractice(cur,box);
  box.querySelectorAll(".opt").forEach(b=>b.addEventListener("click",()=>{
    if(cur.ans!==null) return;
    cur.ans=+b.dataset.opt;
    const ok = cur.ans===cur.q.a;
    if(ok) P.right++;
    recordAnswer(cur.q,ok);
    $("practiceScore").textContent=`✅ ${P.right} đúng`;
    paintPractice(cur,box);
    if(!P.instant && P.i<P.list.length-1) setTimeout(nextPractice,650);
  }));
  $("practicePrev").disabled = P.i===0;
  $("practiceNext").textContent = P.i===P.list.length-1 ? "Xem kết quả ✓" : "Câu tiếp →";
}
function paintPractice(cur,box){
  const ok = cur.ans===cur.q.a;
  box.querySelectorAll(".opt").forEach(b=>{
    const oi=+b.dataset.opt; b.disabled=true;
    if(oi===cur.q.a) b.classList.add("correct");
    else if(oi===cur.ans) b.classList.add("wrong");
    else b.classList.add("dim");
  });
  if(P.instant || cur.ans!==null){
    const ex=box.querySelector(".explain");
    ex.classList.remove("hidden");
    ex.innerHTML=`${ok?"✅ <strong>Chính xác!</strong>":"❌ <strong>Chưa đúng.</strong> Đáp án đúng là <strong>"+LETTERS[cur.order.indexOf(cur.q.a)]+"</strong>."} ${cur.q.e?`<br>📖 <em>${esc(cur.q.e)}</em>`:""}`;
  }
}
function nextPractice(){
  if(P.i<P.list.length-1){P.i++;renderPractice();}
  else finishPractice();
}
$("practiceNext").addEventListener("click",nextPractice);
$("practicePrev").addEventListener("click",()=>{if(P.i>0){P.i--;renderPractice();}});
$("practiceQuit").addEventListener("click",()=>{
  $("practiceBox").classList.add("hidden"); $("practiceSetup").classList.remove("hidden"); P=null;
});
function finishPractice(){
  const total=P.list.length, pct=Math.round(P.right/total*100);
  const msg = pct>=80?"🎉 Xuất sắc! Bạn đã nắm rất chắc kiến thức!":pct>=60?"💪 Khá tốt! Ôn thêm các câu sai nhé!":pct>=40?"📚 Cần cố gắng thêm, hãy xem lại giải thích!":"🔥 Đừng nản! Ôn lại lý thuyết rồi luyện tiếp nhé!";
  $("practiceBox").classList.add("hidden");
  const r=$("practiceResult"); r.classList.remove("hidden");
  r.innerHTML=`<div class="card result-hero"><h3>Kết quả luyện tập</h3><div class="big-score">${P.right}/${total}</div>
    <div>${msg}</div><div class="muted">Đúng ${pct}% • Các câu sai đã được lưu vào mục “Ôn câu sai”</div>
    <div style="margin-top:16px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <button class="btn primary" id="pAgain">↻ Luyện đề mới</button>
      <button class="btn ghost" id="pReview">📌 Xem câu sai</button></div></div>`;
  $("pAgain").addEventListener("click",()=>$("practiceStart").click());
  $("pReview").addEventListener("click",()=>navTo("review"));
  renderHome();
}

/* ---------- EXAM ---------- */
let E=null, timerH=null;
const EXAM_MIN={15:20,30:40,40:60,50:60};
$("examStart").addEventListener("click",()=>{
  const n=+$("examCount").value;
  const list=pickRandom(QBANK,n).map(q=>({q,order:$("examShuffle").checked?shuffle([0,1,2,3]):[0,1,2,3],ans:null}));
  E={list,left:EXAM_MIN[n]*60,n};
  $("examSetup").classList.add("hidden"); $("examResult").classList.add("hidden");
  $("examBox").classList.remove("hidden");
  renderExam(); startTimer();
  window.scrollTo({top:$("examBox").offsetTop-80,behavior:"smooth"});
});
function renderExam(){
  const done=E.list.filter(x=>x.ans!==null).length;
  $("examProg").textContent=`Đã làm ${done}/${E.list.length}`;
  $("examBar").style.width=Math.round(done/E.list.length*100)+"%";
  $("examPalette").innerHTML=E.list.map((x,i)=>`<button class="pal ${x.ans!==null?"done":""}" data-pal="${i}">${i+1}</button>`).join("");
  document.querySelectorAll("[data-pal]").forEach(b=>b.addEventListener("click",()=>{
    document.querySelector(`[data-exam="${b.dataset.pal}"]`).scrollIntoView({behavior:"smooth",block:"center"});
  }));
  const box=$("examQ");
  box.innerHTML=E.list.map((x,i)=>`<div data-exam="${i}">${qCardHTML(x.q,i+1,E.list.length,{order:x.order})}</div>`).join("");
  box.querySelectorAll(".qcard").forEach((card,ci)=>{
    card.querySelectorAll(".opt").forEach(b=>b.addEventListener("click",()=>{
      E.list[ci].ans=+b.dataset.opt;
      card.querySelectorAll(".opt").forEach(o=>o.classList.remove("correct"));
      b.classList.add("correct");
      renderExamMeta();
    }));
    if(E.list[ci].ans!==null){
      const oi=E.list[ci].ans;
      const btn=card.querySelector(`[data-opt="${oi}"]`); if(btn) btn.classList.add("correct");
    }
  });
}
function renderExamMeta(){
  const done=E.list.filter(x=>x.ans!==null).length;
  $("examProg").textContent=`Đã làm ${done}/${E.list.length}`;
  $("examBar").style.width=Math.round(done/E.list.length*100)+"%";
  document.querySelectorAll("[data-pal]").forEach((p,i)=>p.classList.toggle("done",E.list[i].ans!==null));
}
function startTimer(){
  clearInterval(timerH);
  const show=()=>{ $("examTimer").textContent="⏱ "+fmtTime(E.left); $("examTimer").classList.toggle("low",E.left<=300); };
  show();
  timerH=setInterval(()=>{ E.left--; show(); if(E.left<=0){clearInterval(timerH); toast("⏰ Hết giờ! Tự động nộp bài."); submitExam();} },1000);
}
function submitExam(){
  clearInterval(timerH);
  let right=0;
  E.list.forEach(x=>{ const ok=x.ans===x.q.a; if(ok)right++; if(x.ans!==null) recordAnswer(x.q,ok); });
  const score10=(right/E.list.length*10);
  const key=String(E.n);
  if(!store.best[key]||score10>store.best[key]){store.best[key]=score10.toFixed(2);}
  store.history.unshift({d:new Date().toLocaleString("vi-VN"),n:E.n,right,score:score10.toFixed(2)});
  store.history=store.history.slice(0,20); save();
  $("examBox").classList.add("hidden");
  const r=$("examResult"); r.classList.remove("hidden");
  const msg=score10>=8?"🎉 Xuất sắc! Bạn sẵn sàng đi thi rồi!":score10>=6.5?"💪 Khá tốt! Cố thêm chút nữa!":score10>=5?"📚 Đạt yêu cầu, nhưng cần ôn thêm!":"🔥 Chưa đạt. Hãy luyện tập thêm nhé!";
  r.innerHTML=`<div class="card result-hero"><h3>Kết quả thi thử</h3><div class="big-score">${score10.toFixed(1)}</div>
    <div>${msg}</div>
    <div class="result-grid"><div class="result-cell"><b>${right}/${E.list.length}</b><span>số câu đúng</span></div>
    <div class="result-cell"><b>${Math.round(right/E.list.length*100)}%</b><span>tỷ lệ đúng</span></div>
    <div class="result-cell"><b>${E.list.length-right}</b><span>câu sai/bỏ</span></div></div>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
      <button class="btn danger" id="eAgain">↻ Thi đề mới</button>
      <button class="btn primary" id="eDetail">📋 Xem chi tiết từng câu</button></div></div>
    <div id="eDetailBox"></div>`;
  $("eAgain").addEventListener("click",()=>{r.classList.add("hidden");$("examSetup").classList.remove("hidden");});
  $("eDetail").addEventListener("click",()=>{
    $("eDetailBox").innerHTML=E.list.map((x,i)=>{
      const ok=x.ans===x.q.a;
      return `<div class="qcard"><div class="qhead"><span class="qnum">Câu ${i+1}</span><span class="qchap">${chName(x.q.c)}</span></div>
      <p class="qtext">${esc(x.q.q)}</p><div class="opts">${x.order.map((oi,k)=>{
        let cls=""; if(oi===x.q.a)cls="correct"; else if(oi===x.ans)cls="wrong";
        return `<button class="opt ${cls}" disabled><span class="key">${LETTERS[k]}</span><span>${esc(x.q.o[oi])}</span></button>`;}).join("")}</div>
      <div class="explain">${x.ans===null?"⚠️ <strong>Bạn chưa trả lời.</strong>":ok?"✅ <strong>Bạn trả lời đúng.</strong>":"❌ <strong>Bạn trả lời sai.</strong>"} ${x.q.e?`📖 <em>${esc(x.q.e)}</em>`:""}</div></div>`;
    }).join("");
    $("eDetailBox").scrollIntoView({behavior:"smooth"});
  });
  renderHome();
  window.scrollTo({top:0,behavior:"smooth"});
}
$("examSubmit").addEventListener("click",()=>{ if(confirm("Nộp bài và chấm điểm?")) submitExam(); });
$("examSubmit2").addEventListener("click",()=>{ if(confirm("Nộp bài và chấm điểm?")) submitExam(); });

/* ---------- ENDLESS ---------- */
let G={streak:0,right:0,wrong:0,asked:[],cur:null,order:[]};
function endlessNext(){
  let pool=QBANK.filter(q=>!G.asked.includes(q.id));
  if(!pool.length){G.asked=[];pool=QBANK.slice();}
  G.cur=pool[Math.floor(Math.random()*pool.length)];
  G.asked.push(G.cur.id); if(G.asked.length>QBANK.length)G.asked=[];
  G.order=shuffle([0,1,2,3]);
  const box=$("endlessQ");
  box.innerHTML=`<div class="qcard"><div class="qhead"><span class="qnum">Câu ${G.right+G.wrong+1}</span><span class="qchap">${chName(G.cur.c)}</span>
    <button class="qmark ${store.marked.includes(G.cur.id)?"on":""}" data-mark="${G.cur.id}">⭐</button></div>
    <p class="qtext">${esc(G.cur.q)}</p>
    <div class="opts">${G.order.map((oi,k)=>`<button class="opt" data-opt="${oi}"><span class="key">${LETTERS[k]}</span><span>${esc(G.cur.o[oi])}</span></button>`).join("")}</div>
    <div class="explain hidden"></div>
    <button class="btn primary full hidden" id="endNext">Câu tiếp theo →</button></div>`;
  box.querySelectorAll(".opt").forEach(b=>b.addEventListener("click",()=>{
    const ans=+b.dataset.opt, ok=ans===G.cur.a;
    box.querySelectorAll(".opt").forEach(o=>{o.disabled=true;const oi=+o.dataset.opt;
      if(oi===G.cur.a)o.classList.add("correct"); else if(oi===ans)o.classList.add("wrong"); else o.classList.add("dim");});
    if(ok){G.streak++;G.right++; if(G.streak>(store.endlessBest||0)){store.endlessBest=G.streak;save();}}
    else{G.streak=0;G.wrong++;}
    recordAnswer(G.cur,ok);
    $("endStreak").textContent=G.streak; $("endBest").textContent=store.endlessBest||0;
    $("endRight").textContent=G.right; $("endWrong").textContent=G.wrong;
    const ex=box.querySelector(".explain"); ex.classList.remove("hidden");
    ex.innerHTML=`${ok?`✅ <strong>Chính xác!</strong> 🔥 Streak ${G.streak}`:`❌ <strong>Sai rồi!</strong> Đáp án đúng: <strong>${LETTERS[G.order.indexOf(G.cur.a)]}</strong>. Streak về 0!`} ${G.cur.e?`<br>📖 <em>${esc(G.cur.e)}</em>`:""}`;
    const nx=$("endNext"); nx.classList.remove("hidden"); nx.addEventListener("click",endlessNext);
  }));
}
$("endReset").addEventListener("click",()=>{G={streak:0,right:0,wrong:0,asked:[],cur:null,order:[]};$("endStreak").textContent=0;$("endRight").textContent=0;$("endWrong").textContent=0;endlessNext();});
$("endBest").textContent=store.endlessBest||0;
endlessNext();

/* ---------- REVIEW ---------- */
let RTab="wrong";
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active")); t.classList.add("active");
  RTab=t.dataset.tab; renderReview();
}));
function renderReview(){
  $("wrongCount").textContent=store.wrong.length; $("markedCount").textContent=store.marked.length;
  const ids=RTab==="wrong"?store.wrong:store.marked;
  const list=$("reviewList");
  if(!ids.length){
    list.innerHTML=`<div class="card empty"><div class="big">${RTab==="wrong"?"🎉":"⭐"}</div>
      <p>${RTab==="wrong"?"Tuyệt vời! Bạn không còn câu sai nào. Hãy luyện tập hoặc thi thử để kiểm tra thêm.":"Bạn chưa ghim câu nào. Nhấn ⭐ ở bất kỳ câu hỏi nào để ghim lại ôn sau."}</p></div>`; return;
  }
  const qs=ids.map(id=>QBANK[id]).filter(Boolean);
  list.innerHTML=`<div class="card" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
    <strong>${qs.length} câu</strong><span class="muted">— nhấn vào đáp án để trả lời, đúng 2 lần sẽ tự xóa khỏi danh sách sai</span>
    <button class="btn small ghost" id="rClear" style="margin-left:auto">🗑 Xóa hết danh sách</button></div>`+
    qs.map((q,i)=>{
      const order=shuffle([0,1,2,3]);
      return `<div class="qcard" data-rq="${q.id}"><div class="qhead"><span class="qnum">Câu ${i+1}</span><span class="qchap">${chName(q.c)}</span>
      <button class="qmark ${store.marked.includes(q.id)?"on":""}" data-mark="${q.id}">⭐</button></div>
      <p class="qtext">${esc(q.q)}</p><div class="opts">${order.map((oi,k)=>`<button class="opt" data-opt="${oi}"><span class="key">${LETTERS[k]}</span><span>${esc(q.o[oi])}</span></button>`).join("")}</div>
      <div class="explain hidden"></div></div>`;
    }).join("");
  $("rClear").addEventListener("click",()=>{
    if(!confirm("Xóa hết danh sách này?"))return;
    if(RTab==="wrong")store.wrong=[]; else store.marked=[];
    save(); renderReview();
  });
  list.querySelectorAll("[data-rq]").forEach(card=>{
    const q=QBANK[+card.dataset.rq];
    card.querySelectorAll(".opt").forEach(b=>b.addEventListener("click",()=>{
      const ans=+b.dataset.opt, ok=ans===q.a;
      card.querySelectorAll(".opt").forEach(o=>{o.disabled=true;const oi=+o.dataset.opt;
        if(oi===q.a)o.classList.add("correct");else if(oi===ans)o.classList.add("wrong");else o.classList.add("dim");});
      recordAnswer(q,ok);
      const ex=card.querySelector(".explain"); ex.classList.remove("hidden");
      ex.innerHTML=`${ok?"✅ <strong>Đúng rồi!</strong>":"❌ <strong>Sai.</strong>"} ${q.e?`📖 <em>${esc(q.e)}</em>`:""}`;
      $("wrongCount").textContent=store.wrong.length; $("markedCount").textContent=store.marked.length;
    },{once:false}));
  });
}

/* ---------- SEARCH ---------- */
fillScope($("searchChapter"), true);
$("searchChapter").options[0].text="🌐 Tất cả các chương";
let searchH=null;
function doSearch(){
  const kw=$("searchInput").value.trim().toLowerCase();
  const ch=+$("searchChapter").value;
  let pool=ch===0?QBANK:byChapter(ch);
  if(kw) pool=pool.filter(q=>(q.q+" "+q.o.join(" ")+" "+q.e).toLowerCase().includes(kw));
  $("searchInfo").textContent=`Tìm thấy ${pool.length} câu hỏi`+(kw?` với từ khóa “${$("searchInput").value.trim()}”`:"");
  const show=pool.slice(0,60);
  $("searchList").innerHTML=show.map((q,i)=>`<div class="qcard"><div class="qhead"><span class="qnum">#${q.id+1}</span><span class="qchap">${chName(q.c)}</span>
    <button class="qmark ${store.marked.includes(q.id)?"on":""}" data-mark="${q.id}">⭐</button></div>
    <p class="qtext">${esc(q.q)}</p><div class="opts">${q.o.map((t,k)=>`<button class="opt ${k===q.a?"correct":""}" disabled><span class="key">${LETTERS[k]}</span><span>${esc(t)}</span></button>`).join("")}</div>
    ${q.e?`<div class="explain">📖 <em>${esc(q.e)}</em></div>`:""}</div>`).join("")+
    (pool.length>60?`<div class="card empty">Hiển thị 60/${pool.length} câu. Hãy nhập từ khóa cụ thể hơn để thu hẹp kết quả.</div>`:"");
}
$("searchInput").addEventListener("input",()=>{clearTimeout(searchH);searchH=setTimeout(doSearch,300);});
$("searchChapter").addEventListener("change",doSearch);
doSearch();

/* ---------- Init ---------- */
renderHome();
touchStreak();

})();

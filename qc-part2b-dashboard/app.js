(function(){
  "use strict";
  var questions=window.QC_QUESTIONS,current=questions[0],activeFilter="all";
  var $=function(s){return document.querySelector(s);};
  var esc=function(v){return String(v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});};
  var fmt=function(v,pct){return pct?(v*100).toFixed(v<.01?3:1)+"%":Number(v).toFixed(Math.abs(v)<1?4:2);};

  function renderList(){
    var query=$("#question-search").value.trim().toLowerCase();
    var filtered=questions.filter(function(q){return(activeFilter==="all"||q.type===activeFilter)&&(q.id+" "+q.title+" "+q.prompt).toLowerCase().includes(query);});
    $("#visible-count").textContent=filtered.length;
    $("#question-list").innerHTML=filtered.map(function(q){
      return '<button class="question-link '+(q.id===current.id?"active":"")+'" data-id="'+q.id+'"><i class="kind-dot '+q.type+'"></i><strong>'+q.id+'</strong><span>'+esc(q.title)+'</span></button>';
    }).join("")||'<p class="muted">No exercise matches this filter.</p>';
    document.querySelectorAll(".question-link").forEach(function(b){b.addEventListener("click",function(){selectQuestion(b.dataset.id);});});
  }
  function renderCoverage(){
    $("#coverage-grid").innerHTML=questions.map(function(q){return '<div class="coverage-item '+q.type+'"><strong>'+q.id+'</strong><span>'+(q.type==="numerical"?"calculated":"answered")+'</span></div>';}).join("");
  }
  function selectQuestion(id){
    current=questions.find(function(q){return q.id===id;})||questions[0];
    $("#exercise-number").textContent="EXERCISE "+current.id;
    $("#type-badge").textContent=current.type==="numerical"?"Numerical + simulation":"Analytical";
    $("#exercise-title").textContent=current.title;$("#exercise-prompt").textContent=current.prompt;
    $("#book-page").textContent=current.page;$("#pdf-page").textContent="PDF page "+current.pdfPage;
    if(current.type==="numerical")renderNumerical(current);else renderConceptual(current);
    renderList();
    if(innerWidth<981)$("#workspace").scrollIntoView({behavior:"smooth",block:"start"});
  }
  function renderNumerical(q){
    $("#numerical-view").hidden=false;$("#conceptual-view").hidden=true;
    $("#metrics").innerHTML=q.metrics.map(function(x){return '<div class="metric"><span>'+esc(x[0])+'</span><strong>'+esc(x[1])+'</strong></div>';}).join("");
    $("#chart-title").textContent=q.chartTitle;$("#formula").textContent=q.formula;$("#method-note").textContent=q.methodNote;$("#interpretation").textContent=q.interpretation;
    $("#result-head").innerHTML="<tr>"+q.table.headers.map(function(h){return"<th>"+esc(h)+"</th>";}).join("")+"</tr>";
    $("#result-body").innerHTML=q.table.rows.map(function(r){return"<tr>"+r.map(function(c){return"<td>"+esc(c)+"</td>";}).join("")+"</tr>";}).join("");
    renderChart(q.chart,q.chartTitle);
    $("#simulation-card").hidden=!q.simulation;
    if(q.simulation){$("#simulation-description").textContent=q.simulationDescription;$("#simulation-result").textContent="Run the seeded simulation to compare it with the exact result.";}
  }
  function renderConceptual(q){
    $("#numerical-view").hidden=true;$("#conceptual-view").hidden=false;$("#answer-heading").textContent=q.answerHeading;
    $("#conceptual-answer").innerHTML="<ul>"+q.answer.map(function(a){return"<li>"+esc(a)+"</li>";}).join("")+"</ul>";
    $("#simulation-note").textContent=q.simulationNote;
  }
  function frame(w,h,m,min,max,n,pct){
    var pw=w-m.l-m.r,ph=h-m.t-m.b;
    var x=function(i){return m.l+(n===1?pw/2:i*pw/(n-1));},y=function(v){return m.t+(max-v)*ph/(max-min||1);},grid="";
    for(var i=0;i<=5;i++){var v=min+(max-min)*i/5,yy=y(v);grid+='<line class="grid" x1="'+m.l+'" y1="'+yy+'" x2="'+(w-m.r)+'" y2="'+yy+'"/><text x="'+(m.l-10)+'" y="'+(yy+4)+'" text-anchor="end">'+fmt(v,pct)+"</text>";}
    return{x:x,y:y,grid:grid,pw:pw,ph:ph};
  }
  function renderChart(c,title){
    var w=900,h=390,m={l:72,r:28,t:24,b:62},body="",desc=title;
    if(c.type==="control"){
      var all=c.values.concat([c.ucl,c.lcl,c.center]),spread=Math.max.apply(null,all)-Math.min.apply(null,all)||1,min=Math.max(0,Math.min.apply(null,all)-spread*.12),max=Math.max.apply(null,all)+spread*.12,f=frame(w,h,m,min,max,c.values.length,c.percent);
      body+=f.grid;
      [[c.ucl,"limit","UCL"],[c.center,"center","CL"],[c.lcl,"limit","LCL"]].forEach(function(a){body+='<line class="'+a[1]+'" x1="'+m.l+'" y1="'+f.y(a[0])+'" x2="'+(w-m.r)+'" y2="'+f.y(a[0])+'"/><text x="'+(w-m.r-3)+'" y="'+(f.y(a[0])-6)+'" text-anchor="end">'+a[2]+" "+fmt(a[0],c.percent)+"</text>";});
      body+='<polyline class="series" points="'+c.values.map(function(v,i){return f.x(i)+","+f.y(v);}).join(" ")+'"/>';
      c.values.forEach(function(v,i){var alert=v>c.ucl||v<c.lcl;body+='<circle class="point '+(alert?"alert":"")+'" cx="'+f.x(i)+'" cy="'+f.y(v)+'" r="5"><title>'+esc(c.labels[i])+": "+fmt(v,c.percent)+"</title></circle>";});
      c.labels.forEach(function(label,i){if(c.labels.length<=16||i%2===0)body+='<text x="'+f.x(i)+'" y="'+(h-31)+'" text-anchor="middle">'+esc(label)+"</text>";});
      desc+=". Center "+fmt(c.center,c.percent)+", lower "+fmt(c.lcl,c.percent)+", upper "+fmt(c.ucl,c.percent)+".";
    }else if(c.type==="bars"){
      var maxb=Math.max.apply(null,c.values)*1.16,fb=frame(w,h,m,0,maxb,c.values.length,c.percent),slot=fb.pw/c.values.length,bw=slot*.58;body+=fb.grid;
      c.values.forEach(function(v,i){var xx=m.l+i*slot+(slot-bw)/2,yy=fb.y(v);body+='<rect class="bar" x="'+xx+'" y="'+yy+'" width="'+bw+'" height="'+(fb.y(0)-yy)+'" rx="5"><title>'+c.labels[i]+": "+fmt(v,c.percent)+'</title></rect><text x="'+(xx+bw/2)+'" y="'+(yy-9)+'" text-anchor="middle">'+fmt(v,c.percent)+'</text><text x="'+(xx+bw/2)+'" y="'+(h-31)+'" text-anchor="middle">n/c '+c.labels[i]+"</text>";});
    }else if(c.type==="pareto"){
      var total=c.values.reduce(function(a,b){return a+b;},0),cum=[],sum=0;c.values.forEach(function(v){sum+=v;cum.push(sum/total);});
      var fp=frame(w,h,m,0,Math.max.apply(null,c.values)*1.16,c.values.length,false),sl=fp.pw/c.values.length,bwp=sl*.62;body+=fp.grid;
      c.values.forEach(function(v,i){var xx=m.l+i*sl+(sl-bwp)/2,yy=fp.y(v);body+='<rect class="bar" x="'+xx+'" y="'+yy+'" width="'+bwp+'" height="'+(fp.y(0)-yy)+'" rx="4"><title>'+c.labels[i]+": "+v+'</title></rect><text x="'+(xx+bwp/2)+'" y="'+(h-29)+'" transform="rotate(-35 '+(xx+bwp/2)+" "+(h-29)+')" text-anchor="end">'+esc(c.labels[i])+"</text>";});
      var cy=function(p){return m.t+(1-p)*fp.ph;};body+='<polyline class="cumulative" points="'+cum.map(function(p,i){return(m.l+i*sl+sl/2)+","+cy(p);}).join(" ")+'"/>';cum.forEach(function(p,i){body+='<circle class="highlight" cx="'+(m.l+i*sl+sl/2)+'" cy="'+cy(p)+'" r="4"><title>Cumulative '+(p*100).toFixed(1)+"%</title></circle>";});
    }else if(c.type==="oc"){
      var ps=Array.from({length:51},function(_,i){return i/1000;}),vals=ps.map(function(p){var pa=poissonCDF(c.n*p,c.c);return c.risk==="producer"?1-pa:pa;}),fo=frame(w,h,m,0,1,ps.length,true);body+=fo.grid;
      body+='<polyline class="series" points="'+vals.map(function(v,i){return fo.x(i)+","+fo.y(v);}).join(" ")+'"/>';
      c.highlights.forEach(function(p){var i=Math.round(p*1000),v=vals[i];body+='<circle class="highlight" cx="'+fo.x(i)+'" cy="'+fo.y(v)+'" r="6"><title>p='+(p*100).toFixed(1)+"%, risk="+(v*100).toFixed(2)+'%</title></circle><text x="'+(fo.x(i)+8)+'" y="'+(fo.y(v)-9)+'">'+(v*100).toFixed(1)+"%</text>";});
      for(var k=0;k<=5;k++)body+='<text x="'+fo.x(k*10)+'" y="'+(h-31)+'" text-anchor="middle">'+k+"%</text>";
    }
    $("#chart").setAttribute("aria-label",desc);$("#chart").innerHTML='<svg viewBox="0 0 '+w+" "+h+'" aria-hidden="true">'+body+'<line class="axis" x1="'+m.l+'" y1="'+(h-m.b)+'" x2="'+(w-m.r)+'" y2="'+(h-m.b)+'"/><line class="axis" x1="'+m.l+'" y1="'+m.t+'" x2="'+m.l+'" y2="'+(h-m.b)+'"/></svg>';
  }
  function factorial(n){var v=1;for(var i=2;i<=n;i++)v*=i;return v;}
  function poissonCDF(lambda,c){var s=0;for(var k=0;k<=c;k++)s+=Math.exp(-lambda)*Math.pow(lambda,k)/factorial(k);return s;}
  function prng(seed){var s=seed>>>0;return function(){s=(1664525*s+1013904223)>>>0;return s/4294967296;};}
  function binomial(n,p,r){var c=0;for(var i=0;i<n;i++)if(r()<p)c++;return c;}
  function runSimulation(){
    if(!current.simulation)return;var trials=Number($("#trial-count").value),seed=Number($("#seed-value").value)||1040,r=prng(seed),s=current.simulation,est=[];
    if(s.mode==="tail"){var hits=0;for(var t=0;t<trials;t++)if(binomial(s.n,s.p,r)>=s.threshold)hits++;var e=hits/trials;$("#simulation-result").innerHTML="<strong>Simulated "+s.label+": "+(e*100).toFixed(2)+"%</strong> · exact "+(s.exact*100).toFixed(2)+"% · difference "+(Math.abs(e-s.exact)*100).toFixed(2)+" points · seed "+seed;return;}
    if(s.mode==="plans")s.plans.forEach(function(plan){var hits=0;for(var t=0;t<trials;t++){var accepted=binomial(plan[0],s.p,r)<=plan[1];if((s.risk==="consumer"&&accepted)||(s.risk==="producer"&&!accepted))hits++;}est.push(hits/trials);});
    if(s.mode==="oc")s.pValues.forEach(function(p){var hits=0;for(var t=0;t<trials;t++){var accepted=binomial(s.n,p,r)<=s.c;if((s.risk==="consumer"&&accepted)||(s.risk==="producer"&&!accepted))hits++;}est.push(hits/trials);});
    var diffs=est.map(function(v,i){return Math.abs(v-s.exacts[i]);});
    $("#simulation-result").innerHTML="<strong>Simulated: "+est.map(function(v){return(v*100).toFixed(2)+"%";}).join(" · ")+"</strong><br>Reference: "+s.exacts.map(function(v){return(v*100).toFixed(2)+"%";}).join(" · ")+" · largest difference "+(Math.max.apply(null,diffs)*100).toFixed(2)+" points · seed "+seed;
  }
  function exportCurrent(){var payload=Object.assign({},current,{exportedAt:new Date().toISOString(),note:"Fixed Chapter 10 data; no random input data."}),blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="exercise-"+current.id+".json";a.click();setTimeout(function(){URL.revokeObjectURL(url);},500);}
  $("#question-search").addEventListener("input",renderList);
  document.querySelectorAll(".filter-chip").forEach(function(b){b.addEventListener("click",function(){activeFilter=b.dataset.filter;document.querySelectorAll(".filter-chip").forEach(function(x){x.classList.toggle("active",x===b);});renderList();});});
  $("#simulate-button").addEventListener("click",runSimulation);$("#print-button").addEventListener("click",function(){print();});$("#export-button").addEventListener("click",exportCurrent);
  renderCoverage();selectQuestion("10-40");
})();

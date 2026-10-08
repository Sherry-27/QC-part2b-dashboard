(function () {
  "use strict";

  var FACTORS = {
    2:[1.881,0,3.269],3:[1.023,0,2.574],4:[.729,0,2.282],5:[.577,0,2.114],6:[.483,0,2.004],
    7:[.419,.076,1.924],8:[.373,.136,1.864],9:[.337,.184,1.816],10:[.308,.223,1.777],
    11:[.285,.256,1.744],12:[.266,.283,1.717],13:[.249,.308,1.692],14:[.235,.328,1.672],
    15:[.223,.347,1.653],16:[.212,.363,1.637],17:[.203,.378,1.622],18:[.194,.391,1.609],
    19:[.187,.403,1.597],20:[.180,.414,1.586],21:[.173,.425,1.575],22:[.167,.434,1.566],
    23:[.162,.443,1.557],24:[.157,.452,1.548],25:[.153,.460,1.540]
  };

  var CASES = [
    {id:"10-44",kind:"xbar",title:"Global Bank encoding mean",page:512,v:{n:10,mean:50,rbar:6.75},refs:{center:50,lcl:47.921,ucl:52.079}},
    {id:"10-50",kind:"xbar",title:"Reliant coating mean",page:513,v:{n:24,mean:74.965,rbar:3.165},refs:{center:74.965,lcl:74.468095,ucl:75.461905}},
    {id:"10-45",kind:"range",title:"Global Bank process spread",page:512,v:{n:10,rbar:6.75},refs:{center:6.75,lcl:1.50525,ucl:11.99475}},
    {id:"10-51",kind:"range",title:"Reliant coating spread",page:513,v:{n:24,rbar:3.165},refs:{center:3.165,lcl:1.43058,ucl:4.89942}},
    {id:"10-40(b)",kind:"p",title:"Weekly audit defect limits",page:511,v:{n:125,p:.02,series:"2,1,2,3,5,4,5,6,3,1,1,3,2,2,3,2"},refs:{center:.02,lcl:0,ucl:.057565942}},
    {id:"10-52",kind:"p",title:"Photomatic defect limits",page:513,v:{n:2000,p:.001,series:"3,1,2,4,4,2,2,3,1,0,2,2,1,3,2,2,0,4,2,0"},refs:{center:.001,lcl:0,ucl:.0031202594}},
    {id:"10-47(a)",kind:"acceptance",title:"Producer risk / n 200 / c 1",page:512,v:{n:200,c:1,p:.01,risk:"producer",model:"binomial"},refs:{risk:.5953543153}},
    {id:"10-47(b)",kind:"acceptance",title:"Producer risk / n 200 / c 2",page:512,v:{n:200,c:2,p:.01,risk:"producer",model:"binomial"},refs:{risk:.3233213055}},
    {id:"10-47(c)",kind:"acceptance",title:"Producer risk / n 250 / c 1",page:512,v:{n:250,c:1,p:.01,risk:"producer",model:"binomial"},refs:{risk:.7142482612}},
    {id:"10-47(d)",kind:"acceptance",title:"Producer risk / n 250 / c 2",page:512,v:{n:250,c:2,p:.01,risk:"producer",model:"binomial"},refs:{risk:.4568310267}},
    {id:"10-48(a)",kind:"acceptance",title:"Consumer risk / n 200 / c 1",page:512,v:{n:200,c:1,p:.015,risk:"consumer",model:"binomial"},refs:{risk:.19689659}},
    {id:"10-48(b)",kind:"acceptance",title:"Consumer risk / n 200 / c 2",page:512,v:{n:200,c:2,p:.015,risk:"consumer",model:"binomial"},refs:{risk:.4214963217}},
    {id:"10-48(c)",kind:"acceptance",title:"Consumer risk / n 250 / c 1",page:512,v:{n:250,c:1,p:.015,risk:"consumer",model:"binomial"},refs:{risk:.1098857501}},
    {id:"10-48(d)",kind:"acceptance",title:"Consumer risk / n 250 / c 2",page:512,v:{n:250,c:2,p:.015,risk:"consumer",model:"binomial"},refs:{risk:.2748831277}},
    {id:"10-55(a)",kind:"acceptance",title:"OC producer risk / p .005",page:514,v:{n:300,c:3,p:.005,risk:"producer",model:"poisson"},refs:{risk:.0656424544}},
    {id:"10-55(b)",kind:"acceptance",title:"OC producer risk / p .010",page:514,v:{n:300,c:3,p:.01,risk:"producer",model:"poisson"},refs:{risk:.3527681112}},
    {id:"10-55(c)",kind:"acceptance",title:"OC producer risk / p .015",page:514,v:{n:300,c:3,p:.015,risk:"producer",model:"poisson"},refs:{risk:.6577040442}},
    {id:"10-56(a)",kind:"acceptance",title:"OC consumer risk / p .010",page:514,v:{n:300,c:3,p:.01,risk:"consumer",model:"poisson"},refs:{risk:.6472318888}},
    {id:"10-56(b)",kind:"acceptance",title:"OC consumer risk / p .015",page:514,v:{n:300,c:3,p:.015,risk:"consumer",model:"poisson"},refs:{risk:.3422959558}},
    {id:"10-56(c)",kind:"acceptance",title:"OC consumer risk / p .020",page:514,v:{n:300,c:3,p:.02,risk:"consumer",model:"poisson"},refs:{risk:.1512038828}},
    {id:"10-46",kind:"pareto",title:"Construction punch-list priorities",page:512,v:{labels:"Electrical,Flooring,Heating/AC,Painting,Plumbing,Roofing,Tile,Wallboard,Windows,Other",counts:"257,23,35,19,22,31,51,303,16,68"},refs:{total:825,topTwoShare:.6787878788}},
    {id:"10-40(a)",kind:"proportion_test",title:"Audit-rate significance check",page:511,v:{successes:45,n:2000,p0:.02,alpha:.05},refs:{phat:.0225,z:.7985957062,pvalue:.2122624391}}
  ];

  var METHOD_NAMES = {
    xbar:"X-bar process limits", range:"Range variation limits", p:"Defective-rate limits",
    acceptance:"Lot acceptance risk", pareto:"Defect priority study", proportion_test:"Audit-rate test"
  };

  var FIELDS = {
    xbar:[["n","Subgroup size (n)","number","1"],["mean","Overall sample mean","number","any"],["rbar","Mean subgroup range","number","any"]],
    range:[["n","Subgroup size (n)","number","1"],["rbar","Mean subgroup range","number","any"]],
    p:[["n","Items inspected per period","number","1"],["p","Historical defective fraction","number","any"],["series","Defect counts by period","textarea","",true]],
    acceptance:[["n","Units drawn (n)","number","1"],["c","Maximum defects accepted (c)","number","1"],["p","Assumed defective fraction","number","any"],["risk","Risk being reported","select","",false,[["producer","Producer risk (alpha)"],["consumer","Consumer risk (beta)"]]],["model","Probability model","select","",false,[["binomial","Exact binomial"],["poisson","Poisson approximation"]]]],
    pareto:[["labels","Defect categories","textarea","",true],["counts","Observed frequencies","textarea","",true]],
    proportion_test:[["successes","Observed defectives (x)","number","1"],["n","Total inspected (n)","number","1"],["p0","Claimed defective fraction","number","any"],["alpha","Decision threshold","number","any"]]
  };

  var $ = function (selector) { return document.querySelector(selector); };
  var activeCase = null;
  var lastEvidence = null;

  function showPage(id) {
    document.querySelectorAll(".page-view").forEach(function (page) { page.hidden = page.id !== id; });
    document.querySelectorAll(".app-nav-button").forEach(function (button) { button.classList.toggle("active", button.dataset.page === id); });
    $(".top-actions").hidden = id === "calculator-page";
    window.scrollTo({top:0, behavior:"smooth"});
  }

  function listExercises() {
    var kind = $("#calc-kind").value;
    var matches = CASES.filter(function (record) { return record.kind === kind; });
    $("#calc-question").innerHTML = matches.map(function (record) {
      return '<option value="' + record.id + '">' + record.id + ' / ' + record.title + '</option>';
    }).join("");
    if (matches.length) openRecord(matches[0].id);
  }

  function openRecord(id) {
    activeCase = CASES.find(function (record) { return record.id === id; }) || null;
    if (!activeCase) return;
    buildFields(activeCase.kind, activeCase.v);
    $("#record-code").textContent = activeCase.id;
    $("#record-title").textContent = activeCase.title;
    $("#record-page").textContent = "Textbook p. " + activeCase.page;
    $("#ready-title").textContent = "Exercise " + activeCase.id + " is ready";
    $("#ready-copy").textContent = METHOD_NAMES[activeCase.kind] + " will be rebuilt from the selected chapter record.";
    clearEvidence();
  }

  function buildFields(kind, values) {
    $("#calc-input-fields").innerHTML = FIELDS[kind].map(function (definition) {
      var key = definition[0], label = definition[1], type = definition[2], wide = definition[4] ? " calc-field-wide" : "", control;
      if (type === "textarea") {
        control = '<textarea id="input-' + key + '" data-key="' + key + '">' + (values[key] || "") + '</textarea>';
      } else if (type === "select") {
        control = '<select id="input-' + key + '" data-key="' + key + '">' + definition[5].map(function (option) {
          return '<option value="' + option[0] + '" ' + (String(values[key]) === option[0] ? "selected" : "") + '>' + option[1] + '</option>';
        }).join("") + '</select>';
      } else {
        control = '<input id="input-' + key + '" data-key="' + key + '" type="number" step="' + definition[3] + '" value="' + values[key] + '">';
      }
      return '<div class="calc-field' + wide + '"><label for="input-' + key + '">' + label + '</label>' + control + '</div>';
    }).join("");
  }

  function readFields(kind) {
    var values = {};
    FIELDS[kind].forEach(function (definition) {
      var control = $("#input-" + definition[0]);
      values[definition[0]] = definition[2] === "number" ? Number(control.value) : control.value.trim();
      if (definition[2] === "number" && !Number.isFinite(values[definition[0]])) throw Error("Check the value entered for " + definition[1] + ".");
    });
    return values;
  }

  function calculate(kind, v, runs) {
    if (kind === "xbar") {
      if (!FACTORS[v.n]) throw Error("Subgroup size must be a whole number from 2 to 25.");
      var a2 = FACTORS[v.n][0], lower = v.mean - a2 * v.rbar, upper = v.mean + a2 * v.rbar;
      return {values:{center:v.mean,lcl:lower,ucl:upper,A2:a2},formula:"Center = overall mean\nLower limit = mean - A2 x mean range\nUpper limit = mean + A2 x mean range\nA2 for n=" + v.n + " is " + a2,chart:{type:"limits",labels:["Lower","Center","Upper"],values:[lower,v.mean,upper]}};
    }
    if (kind === "range") {
      if (!FACTORS[v.n]) throw Error("Subgroup size must be a whole number from 2 to 25.");
      var d3 = FACTORS[v.n][1], d4 = FACTORS[v.n][2], lowRange = d3 * v.rbar, highRange = d4 * v.rbar;
      return {values:{center:v.rbar,lcl:lowRange,ucl:highRange,D3:d3,D4:d4},formula:"Center = mean range\nLower limit = D3 x mean range\nUpper limit = D4 x mean range\nD3=" + d3 + "; D4=" + d4,chart:{type:"limits",labels:["Lower","Center","Upper"],values:[lowRange,v.rbar,highRange]}};
    }
    if (kind === "p") {
      if (v.n <= 0 || v.p < 0 || v.p > 1) throw Error("Items inspected must be positive and the defective fraction must fall between 0 and 1.");
      var se = Math.sqrt(v.p * (1-v.p) / v.n), lowP = Math.max(0,v.p-3*se), highP = Math.min(1,v.p+3*se), counts = parseNumbers(v.series), proportions = counts.map(function (x) { return x > 1 ? x/v.n : x; });
      return {values:{center:v.p,lcl:lowP,ucl:highP,standardError:se},formula:"Standard error = sqrt[p(1-p)/n]\nLower limit = max(0, p - 3 x standard error)\nUpper limit = min(1, p + 3 x standard error)",chart:proportions.length?{type:"control",values:proportions,center:v.p,lcl:lowP,ucl:highP}:{type:"limits",labels:["Lower","Center","Upper"],values:[lowP,v.p,highP]}};
    }
    if (kind === "acceptance") {
      if (v.n <= 0 || v.c < 0 || v.c > v.n || v.p < 0 || v.p > 1) throw Error("Review n, c and the defective fraction; one or more values are outside their valid range.");
      var accept = v.model === "poisson" ? poissonCDF(v.n*v.p,v.c) : binomialCDF(v.n,v.c,v.p), risk = v.risk === "producer" ? 1-accept : accept, experiment = simulateEvent(risk,runs,seedForRecord());
      return {values:{acceptanceProbability:accept,risk:risk,experiment:experiment,gap:Math.abs(experiment-risk)},formula:(v.model === "poisson" ? "lambda = n x p; accumulate Poisson terms from 0 to c" : "Accumulate binomial probabilities from 0 to c") + "\nReported risk = " + (v.risk === "producer" ? "1 - acceptance probability" : "acceptance probability") + "\nComputer experiment = " + runs.toLocaleString() + " seeded runs",chart:{type:"compare",labels:["Exact risk","Experiment"],values:[risk,experiment],percent:true}};
    }
    if (kind === "pareto") {
      var names = v.labels.split(",").map(function (x) { return x.trim(); }).filter(Boolean), countsP = parseNumbers(v.counts);
      if (!names.length || names.length !== countsP.length) throw Error("The category list and frequency list must contain the same number of entries.");
      var pairs = names.map(function (name,i) { return [name,countsP[i]]; }).sort(function (a,b) { return b[1]-a[1]; }), total = pairs.reduce(function (sum,item) { return sum+item[1]; },0), topTwo = (pairs[0][1] + (pairs[1] ? pairs[1][1] : 0))/total, running=0, to80=0;
      pairs.some(function (item,i) { running += item[1]; if (running/total >= .8) { to80=i+1; return true; } return false; });
      return {values:{total:total,topTwoShare:topTwo,categoriesTo80:to80},formula:"Order categories from highest to lowest frequency\nCategory share = frequency / total\nCumulative share = running frequency / total",chart:{type:"pareto",labels:pairs.map(function (x) { return x[0]; }),values:pairs.map(function (x) { return x[1]; })}};
    }
    if (kind === "proportion_test") {
      if (v.n <= 0 || v.successes < 0 || v.successes > v.n || v.p0 <= 0 || v.p0 >= 1) throw Error("Review the observed count, total inspected and claimed fraction.");
      var phat = v.successes/v.n, z = (phat-v.p0)/Math.sqrt(v.p0*(1-v.p0)/v.n), pValue = .5*erfc(z/Math.sqrt(2)), simP = simulateEvent(pValue,runs,seedForRecord());
      return {values:{phat:phat,z:z,pvalue:pValue,experiment:simP,decision:pValue<v.alpha?"Evidence against the claim":"Claim is not rejected"},formula:"Observed fraction = x / n\nz = (observed fraction - claimed fraction) / standard error\nOne-sided p-value = 1 - normal CDF(z)\nDecision uses alpha = " + v.alpha,chart:{type:"compare",labels:["Observed","Claimed"],values:[phat,v.p0],percent:true}};
    }
    throw Error("This analysis family is not available.");
  }

  function renderEvidence(kind, values, result, runs) {
    lastEvidence = {exercise:activeCase.id,bookPage:activeCase.page,analysis:METHOD_NAMES[kind],inputs:values,derivedValues:result.values,reference:activeCase.refs,experimentRuns:runs};
    var metricLabels = {center:"Center line",lcl:"Lower limit",ucl:"Upper limit",A2:"A2 factor",D3:"D3 factor",D4:"D4 factor",standardError:"Standard error",acceptanceProbability:"Acceptance probability",risk:"Reported risk",experiment:"Experiment estimate",gap:"Experiment gap",total:"Total observations",topTwoShare:"Largest two share",categoriesTo80:"Categories reaching 80%",phat:"Observed fraction",z:"Z statistic",pvalue:"One-sided p-value",decision:"Statistical finding"};
    var cards = Object.keys(result.values).map(function (key,index) {
      return '<div class="evidence-metric"><span>0' + (index+1) + ' / ' + (metricLabels[key]||key) + '</span><strong>' + formatValue(key,result.values[key]) + '</strong></div>';
    }).join("");
    var experimentText = (kind === "acceptance" || kind === "proportion_test") ? runs.toLocaleString() + " seeded repetitions were used for the probability cross-check." : "This method is deterministic; the computer reproduces the formula and plot directly.";
    $("#calculator-result-content").innerHTML =
      '<header class="evidence-header"><div><p class="eyebrow">Evidence sheet / ' + activeCase.id + '</p><h2>' + activeCase.title + '</h2><p>' + METHOD_NAMES[kind] + ' · textbook page ' + activeCase.page + '</p></div><span class="evidence-seal">AUDITED</span></header>' +
      '<div class="evidence-metrics">' + cards + '</div>' +
      '<div class="evidence-grid"><section class="reference-ledger"><p class="eyebrow">Reference ledger</p><h3>Calculated value against book answer</h3>' + comparisonRows(result.values,activeCase.refs) + '</section><section class="calc-visual"><p class="eyebrow">Visual trace</p><h3>Pattern produced by the exercise</h3><div class="calc-mini-chart" id="calc-mini-chart"></div></section></div>' +
      '<div class="method-strip"><section><p class="eyebrow">Working formula</p><pre>' + result.formula + '</pre></section><section><p class="eyebrow">Computer check</p><p>' + experimentText + '</p></section></div>';
    renderMiniChart(result.chart);
    $("#calculator-empty").hidden = true;
    $("#calculator-result").hidden = false;
    $("#calculator-result-status").textContent = activeCase.id + " / audit complete";
    $("#calculator-result").scrollIntoView({behavior:"smooth",block:"start"});
  }

  function comparisonRows(values, refs) {
    return Object.keys(refs).map(function (key) {
      var actual=values[key], reference=refs[key], difference=Math.abs(actual-reference), pass=difference<=Math.max(1e-6,Math.abs(reference)*1e-4);
      return '<div class="ledger-row"><strong>' + key + '</strong><span><small>Computed</small>' + formatValue(key,actual) + '</span><span><small>Reference</small>' + formatValue(key,reference) + '</span><b class="' + (pass?"verified":"review") + '">' + (pass?"Aligned":"Review") + '</b></div>';
    }).join("");
  }

  function renderMiniChart(chart) {
    var box=$("#calc-mini-chart"),w=820,h=310,m={l:52,r:24,t:25,b:64},pw=w-m.l-m.r,ph=h-m.t-m.b,body="";
    if (chart.type === "control") {
      var all=chart.values.concat([chart.center,chart.lcl,chart.ucl]),min=Math.min.apply(null,all),max=Math.max.apply(null,all),pad=(max-min||1)*.15; min=Math.max(0,min-pad); max+=pad;
      var x=function(i){return m.l+i*pw/Math.max(1,chart.values.length-1);}, y=function(v){return m.t+(max-v)*ph/(max-min);};
      for(var g=0;g<=4;g++){var yy=m.t+g*ph/4;body+='<line class="grid" x1="'+m.l+'" y1="'+yy+'" x2="'+(w-m.r)+'" y2="'+yy+'"/>';}
      body+='<line class="limit" x1="'+m.l+'" y1="'+y(chart.ucl)+'" x2="'+(w-m.r)+'" y2="'+y(chart.ucl)+'"/><line class="center" x1="'+m.l+'" y1="'+y(chart.center)+'" x2="'+(w-m.r)+'" y2="'+y(chart.center)+'"/><line class="limit" x1="'+m.l+'" y1="'+y(chart.lcl)+'" x2="'+(w-m.r)+'" y2="'+y(chart.lcl)+'"/><polyline class="line" points="'+chart.values.map(function(v,i){return x(i)+','+y(v);}).join(' ')+'"/>';
      chart.values.forEach(function(v,i){body+='<circle cx="'+x(i)+'" cy="'+y(v)+'" r="4" class="trace-point"/>';});
    } else if (chart.type === "pareto") {
      var maxP=Math.max.apply(null,chart.values),slot=pw/chart.values.length,bw=slot*.62;
      chart.values.forEach(function(v,i){var bh=v/maxP*ph,xx=m.l+i*slot+(slot-bw)/2;body+='<rect class="bar" x="'+xx+'" y="'+(m.t+ph-bh)+'" width="'+bw+'" height="'+bh+'"/><text x="'+(xx+bw/2)+'" y="'+(h-25)+'" text-anchor="middle">'+shortLabel(chart.labels[i])+'</text>';});
    } else {
      var maxB=Math.max.apply(null,chart.values)*1.2||1,slotB=pw/chart.values.length,bwB=slotB*.42;
      chart.values.forEach(function(v,i){var bh=v/maxB*ph,xx=m.l+i*slotB+(slotB-bwB)/2;body+='<rect class="bar '+(i===1?'reference':'')+'" x="'+xx+'" y="'+(m.t+ph-bh)+'" width="'+bwB+'" height="'+bh+'"/><text x="'+(xx+bwB/2)+'" y="'+(m.t+ph-bh-9)+'" text-anchor="middle">'+formatValue('chart',v)+'</text><text x="'+(xx+bwB/2)+'" y="'+(h-28)+'" text-anchor="middle">'+chart.labels[i]+'</text>';});
    }
    box.innerHTML='<svg viewBox="0 0 '+w+' '+h+'" aria-hidden="true">'+body+'</svg>';
  }

  function clearEvidence(){ $("#calculator-error").hidden=true; $("#calculator-result").hidden=true; $("#calculator-empty").hidden=false; }
  function restoreRecord(){ if(activeCase){ buildFields(activeCase.kind,activeCase.v); clearEvidence(); } }
  function shortLabel(value){ value=String(value); return value.length>10?value.slice(0,9)+"…":value; }
  function formatValue(key,value){ if(typeof value!=="number")return String(value); if(["risk","experiment","gap","topTwoShare","phat","pvalue","acceptanceProbability","center","lcl","ucl","standardError","chart"].includes(key)&&Math.abs(value)<=1)return(value*100).toFixed(value<.01?3:2)+"%"; return Number(value.toFixed(6)).toLocaleString(); }
  function parseNumbers(text){ if(!text)return[]; var values=text.split(/[\s,;]+/).filter(Boolean).map(Number); if(values.some(function(x){return!Number.isFinite(x)||x<0;}))throw Error("Use non-negative numbers separated by commas."); return values; }
  function binomialCDF(n,c,p){var sum=0;for(var k=0;k<=c;k++)sum+=comb(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k);return sum;}
  function comb(n,k){k=Math.min(k,n-k);var value=1;for(var i=1;i<=k;i++)value=value*(n-k+i)/i;return value;}
  function poissonCDF(lambda,c){var sum=0;for(var k=0;k<=c;k++)sum+=Math.exp(-lambda)*Math.pow(lambda,k)/factorial(k);return sum;}
  function factorial(n){var value=1;for(var i=2;i<=n;i++)value*=i;return value;}
  function erf(x){var sign=x<0?-1:1;x=Math.abs(x);var a1=.254829592,a2=-.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=.3275911,t=1/(1+p*x);return sign*(1-(((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x));}
  function erfc(x){return 1-erf(x);}
  function seedForRecord(){var text=activeCase?activeCase.id:"chapter10",seed=1040;for(var i=0;i<text.length;i++)seed=(seed*31+text.charCodeAt(i))>>>0;return seed;}
  function random(seed){var state=seed>>>0;return function(){state=(1664525*state+1013904223)>>>0;return state/4294967296;};}
  function simulateEvent(probability,runs,seed){var draw=random(seed),hits=0;for(var i=0;i<runs;i++)if(draw()<probability)hits++;return hits/runs;}

  document.querySelectorAll(".app-nav-button").forEach(function(button){button.addEventListener("click",function(){showPage(button.dataset.page);});});
  $("#calc-kind").addEventListener("change",listExercises);
  $("#calc-question").addEventListener("change",function(){openRecord(this.value);});
  $("#reset-button").addEventListener("click",restoreRecord);
  $("#calculator-form").addEventListener("submit",function(event){
    event.preventDefault();
    var error=$("#calculator-error");error.hidden=true;
    try{var kind=$("#calc-kind").value,values=readFields(kind),runs=Number($("#calc-trials").value),result=calculate(kind,values,runs);renderEvidence(kind,values,result,runs);}catch(problem){error.textContent=problem.message;error.hidden=false;}
  });
  $("#download-calculation").addEventListener("click",function(){
    if(!lastEvidence)return;
    var blob=new Blob([JSON.stringify(lastEvidence,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),link=document.createElement("a");
    link.href=url;link.download="chapter10-"+activeCase.id.replace(/[^0-9a-z]+/gi,"-")+"-evidence.json";link.click();setTimeout(function(){URL.revokeObjectURL(url);},500);
  });

  showPage("calculator-page");
  listExercises();
})();

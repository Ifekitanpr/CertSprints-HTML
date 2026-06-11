(function(){
"use strict";
var stage=document.getElementById("cm-stage"),index=0,startX=0;
var CARD_BG='https://www.figma.com/api/mcp/asset/648f0a14-8c99-4c59-9703-51cc057ec6ca';
var cards=[
 {n:"01",title:"Change Impact Diagnosis",    text:"Identify how change affects people, roles, behaviors, and performance across the organization.", icon:"https://www.figma.com/api/mcp/asset/c45053d7-1127-465d-9c56-523624a0382c"},
 {n:"02",title:"Adoption & Behavior Enablement",text:"Design strategies that drive sustained adoption and reinforce new ways of working.",           icon:"https://www.figma.com/api/mcp/asset/abe4a421-098d-4d78-a334-46dea6cdae78"},
 {n:"03",title:"Resistance Management",      text:"Anticipate, assess, and address resistance proactively to reduce disruption and risk.",            icon:"https://www.figma.com/api/mcp/asset/58d3f7b7-7a8c-4a34-ab41-f4a8e0195b48"},
 {n:"04",title:"Stakeholder Alignment",      text:"Engage leaders and stakeholders to build trust, alignment, and shared ownership of change.",       icon:"https://www.figma.com/api/mcp/asset/5b0992c3-3c0e-4410-baf5-0bc650539d7b"},
 {n:"05",title:"Leadership Readiness",       text:"Equip leaders to sponsor change effectively and prepare teams for continuous transformation.",      icon:"https://www.figma.com/api/mcp/asset/33d3eddb-8d7e-4c10-985d-cd62d0182627"},
 {n:"06",title:"Strategic Integration",      text:"Align change initiatives with business strategy, value realization, and enterprise priorities.",   icon:"https://www.figma.com/api/mcp/asset/750837b5-7118-4609-a44f-cf1b811e07de"}
];
function arrowIcon(dir){return '<img class="cm-glyph cm-glyph--arrow" src="assets/icons/'+(dir==='left'?'arrow-left-01.svg':'arrow-right-01.svg')+'" alt="">';}
function nav(){return '<div class="cm-sb"></div><nav class="cm-nav"><button class="cm-nav-btn" data-action="back" aria-label="Back"><img src="assets/icons/arrow-left-02.svg" alt=""></button><p>CAPABILITY MATRIX</p><button class="cm-nav-btn cm-help" data-action="help" aria-label="Help"><img src="assets/icons/help-circle-24.svg" alt=""></button></nav>'}
function dots(){return '<div class="cm-dots" aria-label="Capability '+(index+1)+' of 6">'+cards.map(function(_,i){return '<i class="'+(i===index?"active ":"")+(i<index?"seen":"")+'"></i>'}).join("")+'</div>'}
function render(){
  var c=cards[index],enabled=index===cards.length-1;
  stage.innerHTML=
    '<section class="cm-screen">'+nav()+
    '<div class="cm-body"><header class="cm-head"><span>ACQUISITION ROADMAP</span><h1>Strategic Capability Matrix</h1><p>A clinical inventory of the high-demand competencies and outcomes you will integrate into your professional profile during this sprint.</p></header>'+
    '<div class="cm-carousel">'+
      '<button class="cm-arrow" data-action="prev" aria-label="Previous capability"'+(index===0?' disabled':'')+'>'+arrowIcon('left')+'</button>'+
      '<article class="cm-card">'+
        '<img class="cm-card-bg" src="'+CARD_BG+'" alt="">'+
        '<div class="cm-icon-slot"><img class="cm-cap-icon" src="'+c.icon+'" alt=""></div>'+
        '<div class="cm-card-title"><span>CAPABILITY_'+c.n+'</span><h2>'+c.title+'</h2><i></i></div>'+
        '<p>'+c.text+'</p>'+
      '</article>'+
      '<button class="cm-arrow" data-action="next" aria-label="Next capability"'+(enabled?' disabled':'')+'>'+arrowIcon('right')+'</button>'+
    '</div>'+
    '<div class="cm-swipe"><img class="cm-glyph cm-glyph--touch" src="assets/icons/touchpad-02-16.svg" alt=""><span>Swipe to explore</span></div>'+
    dots()+
    '</div><footer class="cm-bnb"><button class="cm-continue" data-action="continue"'+(enabled?'':' disabled')+'>Continue <img class="cm-glyph cm-glyph--arrow" src="assets/icons/arrow-right-02.svg" alt=""></button></footer></section>';
  bind();
}
function move(delta){var next=Math.max(0,Math.min(cards.length-1,index+delta));if(next!==index){index=next;render()}}
function bind(){
  stage.querySelectorAll("[data-action]").forEach(function(el){
    el.onclick=function(){
      var a=el.dataset.action;
      if(a==="back")history.back();
      else if(a==="help")location.href="support/help-support.html?from=capability-matrix";
      else if(a==="prev")move(-1);
      else if(a==="next")move(1);
      else if(a==="continue"&&index===cards.length-1)location.href="lms/standard-evolution.html";
    };
  });
  var card=stage.querySelector(".cm-card");
  card.ontouchstart=function(e){startX=e.changedTouches[0].clientX};
  card.ontouchend=function(e){var d=e.changedTouches[0].clientX-startX;if(Math.abs(d)>36)move(d<0?1:-1)};
}
document.addEventListener("keydown",function(e){if(e.key==="ArrowRight")move(1);if(e.key==="ArrowLeft")move(-1)});
var view=Number(new URLSearchParams(location.search).get("view"));if(view>=1&&view<=6)index=view-1;render();
})();

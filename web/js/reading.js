(function(){
"use strict";
var back=document.getElementById("rd-back");
var help=document.getElementById("rd-help");
var proceed=document.getElementById("rd-continue");
var params=new URLSearchParams(location.search);

back.addEventListener("click",function(){
  if(history.length>1)history.back();
  else location.href="app/dashboard.html";
});

help.addEventListener("click",function(){
  location.href="support/help-support.html?from=reading";
});

proceed.addEventListener("click",function(){
  location.href=params.get("next")||"lms/definition-matrix.html";
});
})();

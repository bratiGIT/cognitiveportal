/*

*/
'use strict';
function Progress(){
	const ct=Progress.create();
	let val=0;
	this.getElement=function(){return ct};
	this.getValue=function(){return val};
	this.setValue=function(v){
		v=Math.abs(parseInt(v));
		if(!isNaN(v)){
			if(v>100)v%=100;
			val=v;
			let d=parseInt(v*2.64);
			ct.childNodes[0].childNodes[0].innerHTML=v+'%';
			ct.childNodes[0].childNodes[1].childNodes[0].setAttribute('stroke-dasharray',d+' '+(264-d))
		}
	}
}
Progress.create=function(){
	const ct=document.createElement('div'),
		wr=document.createElement('div'),
		vl=document.createElement('div'),
		sv=document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
		cc=document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	sv.appendChild(cc);
	wr.appendChild(vl);
	wr.appendChild(sv);
	ct.appendChild(wr);
	wr.style.cssText='position:relative';
	vl.style.cssText='position:absolute;left:0;top:0;width:100px;height:100px;line-height:100px;text-align:center;vertical-align:center;font-family:"Segoe UI",Arial,sans-serif;font-size:18px;font-weight:400';
	sv.style.cssText='position:absolute;left:0;top:0';
	sv.setAttribute('width','100');
	sv.setAttribute('height','100');
	sv.setAttribute('viewBox','0 0 100 100');
	cc.style.cssText='fill:transparent;stroke:#2196F3;stroke-width:16;stroke-dashoffset:66';
	cc.setAttribute('cx','50');
	cc.setAttribute('cy','50');
	cc.setAttribute('r','42');
	cc.setAttribute('stroke-dasharray','0 264');
	vl.innerHTML='0%';
  return ct
};

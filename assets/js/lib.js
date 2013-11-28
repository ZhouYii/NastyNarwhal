function get(id) {
    return document.getElementById(id);
}

function rand_elem(arr) {
   return arr[Math.floor(Math.random()*arr.length)];
}

/* Pulled out of the original source code from CC */
function AddEvent(html_element, event_name, event_function) 
{
   if(html_element.attachEvent) //Internet Explorer
      html_element.attachEvent("on" + event_name, function() {event_function.call(html_element);}); 
   else if(html_element.addEventListener) //Firefox & company
      html_element.addEventListener(event_name, event_function, false);
}

CanvasRenderingContext2D.prototype.fillPattern=function(img,X,Y,W,H,iW,iH)
{
    for (var y=0;y<H;y+=iH)
        for (var x=0;x<W;x+=iW)
            this.drawImage(img,X+x,Y+y,iW,iH);
}

/* Taken from Orteil's code */
function Beautify(what,floats)//turns 9999999 into 9,999,999
{
    var str='';
    if (!isFinite(what)) return 'Infinity';
    if (what.toString().indexOf('e')!=-1) return what.toString();
    what=Math.round(what*10000000)/10000000;//get rid of weird rounding errors
    if (floats>0)
    {
        var floater=what-Math.floor(what);
        floater=Math.round(floater*10000000)/10000000;//get rid of weird rounding errors
        var floatPresent=floater?1:0;
        floater=(floater.toString()+'0000000').slice(2,2+floats);//yes this is hacky (but it works)
        if (parseInt(floater)===0) floatPresent=0;
        str=Beautify(Math.floor(what))+(floatPresent?('.'+floater):'');
    }
    else
    {
        what=Math.floor(what);
        what=(what+'').split('').reverse();
        for (var i in what)
        {
            if (i%3==0 && i>0) str=','+str;
            str=what[i]+str;
        }
    }
    return str;
}

/* Courtesy of https://gist.github.com/KenanY/2354298 */
function utf8_to_b64( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
}
 
function b64_to_utf8( str ) {
    return decodeURIComponent(escape(window.atob( str )));
}


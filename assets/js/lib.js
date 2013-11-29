function get(id) {
    return document.getElementById(id);
}

function hide_div(div) {
    get(div).style.visibility = "hidden";
}

function show_div(div) {
    get(div).style.visibility = "";
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

function InvRedrawItems(){
    var target = get("inv-slots");
    for(var i = 0 ; i < Inv.items.length ; i++) {
        if(Inv.items[i] != null)
            target.appendChild(Inv.items[i].image);
    }
}

function InvAddItem(item) {
    if(Inv.items.length < Inv.size) 
        Inv.items.push(item);
    InvUpdateCapacity();
}


function removeItem(item) {
    if(item == null || Inv.items == null)
       return false;
    for(var i = 0 ; i < Inv.items.length; i++) {
        if(Inv.items[i].name == item.name && Inv.items[i].id == item.id) {
            Inv.items.splice(i, 1);
            item.image.parentNode.removeChild(item.image);
            InvUpdateCapacity();
            return true;
        }
    }
    return false;
}


function generate_item(name) {
    var tmp;
    switch(name)
    {
        case "Drugs":
            tmp = _generate_item("Drugs", "drugs.png", aDrug);
            break;

        /* Only generate a background item when it is swapped out */
        case "background_img.jpg":
        case "orbisship.png":
            tmp = _generate_item(name, "background.png", 
                                 function() {swapBg(name);});
            break;
    }
    if(tmp == null)
        return;
    InvAddItem(tmp);
    InvRedrawItems();
}

function _generate_item(itemName, itemImage, useCallback) {
    var item = {};
    item.name = itemName;
    item.id = Math.random();
    item.image = document.createElement("img");
    item.image.src = "assets/img/"+itemImage;
    item.image.id = item.id;
    item.useMe = useCallback;
    item.image.onclick = function() {
        if(!removeItem(item))
            console.log("Failedto remove item");
        item.useMe();
        InvRedrawItems();
    };
    return item;
}

function InvUpdateCapacity() {
    var target = get("inv-title"), size = Inv.items.length;
    if(size == null)
        size = 0;

    target.innerHTML = "Inventory ("+size+"/"+Inv.size+")";
}

function unlockBackground(img_name) {
    if(backgroundUnlocked(img_name) != false)
      return;
    var tmp = {};
    tmp.name = img_name;
    switch(img_name) {
        case "background_img.jpg" :
            tmp.func = aDefaultBg;
            break;
        case "orbisship.png" :
            tmp.func = aOrbisShip;
            break;
    }
    if(tmp.func != null) {
        Game.unlockedBackgrounds.push(tmp)
        return true;
    }

}

/* Returns false if background has not been unlocked. Otherwise returns reference to the 
 * background object */
function backgroundUnlocked(img_name) {
        if(Game.unlockedBackgrounds == null)
            return false;
        for(var i = 0 ; i < Game.unlockedBackgrounds.length ; i++) {
            if(Game.unlockedBackgrounds[i].name == img_name)
              return Game.unlockedBackgrounds[i];
        }
        return false;
}

function swapBg(new_bg) {
    unlockBackground(new_bg);
    var tmp = backgroundUnlocked(new_bg);
    if(tmp == false)
        return;
    var old = Game.currentBg.name;
    Game.currentBg = tmp;
    console.log(Game.currentBg.name);
    /* Spawn the item */
    generate_item(old);
}

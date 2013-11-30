var Game = {};
var Inv = {};
Inv.Init = function() {
    Inv.size = 32;
    Inv.numRows = 0;
    Inv.topImg = "inv_top.png";
    Inv.rowImg = "inv_row.png";
    Inv.botImg = "inv_bot.png";
    Inv.slotImg = "inv_slot.png";
    Inv.items = [];

    /* Set up DOM */
    var bot_img = document.createElement('img');
    bot_img.setAttribute("id", "inv-bot");
    bot_img.src = "assets/img/"+Inv.botImg;
    var top_img = document.createElement('img');
    top_img.setAttribute("id", "inv-top");
    top_img.src = "assets/img/"+Inv.topImg;
    var mid_div = document.createElement('div');
    mid_div.setAttribute("id", "inv-body");
    var slots = document.createElement('div');
    slots.setAttribute("id", "inv-slots");
    mid_div.appendChild(slots);
    var target = get("inv-anchor");
    target.appendChild(top_img);
    target.appendChild(mid_div);
    target.appendChild(bot_img);

};
Game.Construct = function() 
{
    Game.unlockedBackgrounds = [];
    Game.currentTarget = null;
    Game.baseTarget = "big/basic.png";
    Game.initialized = 0;
    Game.T = 0;
    Game.drawT = 0;
    Game.fps = 30;
    Game.targetX=0;
    Game.targetY=0;
    Game.saveName = "theGame";
    /* Game Variables */
    Game.currency = 0;
    Game.mouseEarnRate = 1;
    Game.clickEarnings = 0;
    Game.totalEarnings = 0;
    Game.earningsPerSec = 0.0;
    Game.dateStarted = parseInt(new Date().getTime());
    Game.theme = 'pokemon';

    Game.time = new Date().getTime();
    Game.lastClick = 0;
    Game.autoclickerDetected = 0;
    Game.BigCookieState = 0;
    Game.BigCookieSize = 0;
    Game.clicks = 0;
    Game.recalculateEarnRate = 1;
    Inv.Init();
    /* Init Clicknumbers */
    Game.cookieNumbers=[];
    var str='';
    for (var i=0;i<20;i++)
    {
        Game.cookieNumbers[i]={x:0,y:0,life:-1,text:''};
        str+='<div id="cookieNumber'+i+'" class="cookieNumber title"></div>';
    }
    get('cookieNumbers').innerHTML=str;

    unlockBackground("background_img.jpg");
    Game.currentBg = backgroundUnlocked("background_img.jpg");
    gLoadAssets();
    gLoad();
    /* Set listeners for the click target */
    gInitClickTarget();
    Store.Construct();
    if(Game.currentTarget==null)
        gSetCurrTarget(Game.baseTarget);
    gMain();

    
    function gCookieNumbersUpdate()
    {
        for (var i in Game.cookieNumbers)
        {
            var me=Game.cookieNumbers[i];
            if (me.life!=-1)
            {
                me.y-=me.life*0.5+Math.random()*0.5;
                me.life++;
                var el=me.l;
                el.style.left=Math.floor(me.x)+'px';
                el.style.top=Math.floor(me.y)+'px';
                el.style.opacity=1-(me.life/(Game.fps*1));
                //l('cookieNumber'+i).style.zIndex=(1000+(Game.fps*1-me.life));
                if (me.life>=Game.fps*1)
                {
                    me.life=-1;
                    me.l.style.opacity=0;
                }
            }
        }
    }
    function gCookieNumberAdd(text)
    {
        //pick the first free (or the oldest) particle to replace it
        var highest=0;
        var highestI=0;
        for (var i in Game.cookieNumbers)
        {
            if (Game.cookieNumbers[i].life==-1) {highestI=i;break;}
            if (Game.cookieNumbers[i].life>highest)
            {
                highest=Game.cookieNumbers[i].life;
                highestI=i;
            }
        }
        var i=highestI;
        var x=-100+(Math.random()-0.5)*40;
        var y=0+(Math.random()-0.5)*40;
        var me=Game.cookieNumbers[i];
        if (!me.l) me.l=get('cookieNumber'+i);
        me.life=0;
        me.x=x;
        me.y=y;
        me.text=text;
        me.l.innerHTML=text;
        me.l.style.left=Math.floor(Game.cookieNumbers[i].x)+'px';
        me.l.style.top=Math.floor(Game.cookieNumbers[i].y)+'px';
    }
    function gInitClickTarget() {
        var bigCookie = get('bigCookie');
        AddEvent(bigCookie,'click',gHandleClick);
        AddEvent(bigCookie,'mousedown',function(event){Game.BigCookieState=1;});
        AddEvent(bigCookie,'mouseup',function(event){Game.BigCookieState=2;});
        AddEvent(bigCookie,'mouseout',function(event){Game.BigCookieState=0;});
        AddEvent(bigCookie,'mouseover',function(event){Game.BigCookieState=2;});
        AddEvent(document,'mousemove', gGetMouseCoords);
    }

    function gEarn (amt) {Game.totalEarnings += amt; Game.currency += amt;};
    function gLoadAssets () {
        Game.assets = {};
        /* The things we click */
        var targets=['big/opt1.png',
                    'big/opt2.png',
                    'big/opt3.png',
                    'big/opt4.gif',
                  'big/basic.png'
                 ];
        for(var i = 0; i < targets.length; i++) {
            gLoadTarget(targets[i]);
        }
        var pics=[
                  'blackGradient.png',
                  'shadedBorders.png',
                  'target.png',
                  'shine.png',
                  'storetile.jpg',
                  'inv_top.png',
                  'inv_row.png',
                  'inv_bot.png',
                  'orbisship.png',
                  'drugs.png',
                  'inv_slot.png',
                  'background_img.jpg'
                  ];
        pics = pics.concat(targets);
        for(var i = 0 ; i < pics.length; i++) {
            var img = new Image();
            img.src = "assets/img/" + pics[i];
            img.onload = gDrawBackground;
            Game.assets[pics[i]] = img;
        }
    }

    /* Load the assets for the click targets */
    function gLoadTarget(filename) {
        if(Game.targets == null)
            Game.targets = [];
        var tmp = null;
        switch(filename) {
            case "big/basic.png":
                tmp = spawnTarget(filename, "Innocent Pikachu", 9999, function(){}, function(){},
                                  ["Pika!", "Pikapi!", "Pika", "Pi", "What does the fox say?"]);
                break;

            case "big/opt4.gif":
                tmp = spawnTarget(filename, "Slime", 60, function(){}, function(){}, 
                                  ["", ""]);
                break;
            case "big/opt3.png":
                tmp = spawnTarget(filename, "Mushmom", 80, function(){}, function(){}, 
                                  ["", ""]);
                break;
            case "big/opt2.png":
                tmp = spawnTarget(filename, "Mushroom", 40, function(){}, function(){}, 
                                  ["I am nutritious!", ""]);
                break;
            case "big/opt1.png":
                tmp = spawnTarget(filename, "Factory", 9, function(){}, function(){}, 
                                  [""]);
                break;
        }
        if(tmp != null){
            Game.targets.push(tmp);
        }

        function spawnTarget(name, popName, vitality, swapFunc, clickFunc, convo) {
            var tmp = {}
            tmp.name = name;
            tmp.popName = popName;
            tmp.vitality = vitality;
            tmp.swapFunc = swapFunc;
            tmp.clickFunc = clickFunc;
            tmp.convo = convo;
            return tmp;
        }
    }

    function gGetMouseCoords(e)
    {
        var posx=0;
        var posy=0;
        if (!e) var e=window.event;
        if (e.pageX||e.pageY)
        {
            posx=e.pageX;
            posy=e.pageY;
        }
        else if (e.clientX || e.clientY)
        {
            posx=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
            posy=e.clientY+document.body.scrollTop+document.documentElement.scrollTop;
        }
        var el=get('sectionLeft');
        var x=0;
        var y=0;
        while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop))
        {
            x+=el.offsetLeft-el.scrollLeft;
            y+=el.offsetTop-el.scrollTop;
            el=el.offsetParent;
        }
        Game.mouseX=posx-x;//Math.min(Game.w,Math.max(0,posx-x));
        Game.mouseY=posy-y;//Math.min(Game.h,Math.max(0,posy-y));
    }
    
    function gRefreshFrameSize() {
        Game.Background.canvas.width=screen.width;
        Game.Background.canvas.height=screen.height;
        Game.LeftBackground.canvas.width=Game.LeftBackground.canvas.parentNode.offsetWidth;
        Game.LeftBackground.canvas.height=Game.LeftBackground.canvas.parentNode.offsetHeight;
        /*Game.MidBackground.canvas.width=Game.MidBackground.canvas.parentNode.offsetWidth;
        Game.MidBackground.canvas.height=Game.MidBackground.canvas.parentNode.offsetHeight;*/
    }
    function gDrawBackground() {
        if (!Game.Background)
        {
            console.log("hi");
            Game.Background=get('backgroundCanvas').getContext('2d');
            Game.LeftBackground=get('backgroundLeftCanvas').getContext('2d');
            //Game.MidBackground=get('backgroundMidCanvas').getContext('2d');
            gRefreshFrameSize();
            window.addEventListener('resize', gRefreshFrameSize());
        }
        if (Game.drawT%15==0) {
            var s1=600, s2=600, x=0, y=0;
            Game.Background.fillPattern(Game.assets[Game.currentBg.name],x,y,Game.Background.canvas.width,Game.Background.canvas.height,s1,s1); 
            Game.Background.drawImage(Game.assets['shadedBorders.png'],0,0,Game.Background.canvas.width,Game.Background.canvas.height); 
        }

    }

    function gDrawCookie() {
        if (Game.BigCookieState==1) Game.BigCookieSize+=(0.98-Game.BigCookieSize)*0.5;
        else if (Game.BigCookieState==2) Game.BigCookieSize+=(1.05-Game.BigCookieSize)*0.5;
        else Game.BigCookieSize+=(1-Game.BigCookieSize)*0.5;
        Game.LeftBackground.clearRect(0,0,Game.LeftBackground.canvas.width,Game.LeftBackground.canvas.height);
        Game.targetX=Math.floor(Game.LeftBackground.canvas.width/2);
        Game.targetY=Math.floor(Game.LeftBackground.canvas.height*0.4);
        var s=512;
        var x=Game.targetX-s/2;
        var y=Game.targetY-s/2;
        Game.LeftBackground.globalAlpha=0.5;
        Game.LeftBackground.drawImage(Game.assets['shine.png'],x,y,s,s);
        Game.LeftBackground.globalAlpha=1;
        var s=256*Game.BigCookieSize;
        var x=Game.targetX-s/2;
        var y=Game.targetY-s/2;
        if(Game.currentTarget == null) {
            Game.LeftBackground.drawImage(Game.assets['target.png'],x,y,s,s);
        } else {
            Game.LeftBackground.drawImage(Game.assets[Game.currentTarget.name],x,y,s,s);
        }
    }

    function gDrawInventory() {
        /* If the middle canvas has not been initialized, initialize it */
        var row_img = Game.assets[Inv.rowImg];
        var mid_div = get("inv-body");
        
        while(Inv.numRows < Inv.size/16) {
            var row = document.createElement('img');
            row.src = "assets/img/inv_row.png";
            mid_div.appendChild(row);
            Inv.numRows++;
        }
    }

    function gDraw() 
    {
        gDrawBackground();
        gDrawCookie();
        gDrawInventory();
        get("currency").innerHTML="You have " + Beautify(Game.currency,2) + " monies." + 
          "<div style='font-size:50%;'> per second : " + Game.earningsPerSec + "</div>";
        Game.drawT++;
        gCookieNumbersUpdate();
    }
    
    function gCalcPS() {
        var d = new Date();
        var now = d.getTime();
        if(Game.lastCalcPS == null) {
            Game.lastCalcPS = now;
            return;
        }
        var diff = (now - Game.lastCalcPS)/1000.0001;
        gEarn(diff*Game.earningsPerSec);
        Game.lastCalcPS = now;
    }

    function gMain() 
    {
        /*Activate BG effects */
        Game.currentBg.func();
        gDraw();
        if((Game.time%2) == 0)
            gCalcPS();
        if((Game.time%60) == 0)
            gSave();

        refreshProducts();

        setTimeout(gMain,1000/Game.fps);
        Game.time++;
    }

    function gLoad() {
        var str = '';
        if (document.cookie.indexOf(Game.saveName)>=0)
        {
            str=unescape(document.cookie.split(Game.saveName+'=')[1]);
            if(str == null || str == '') {
              return;
            }
            str = str.split('!END!')[0];
            str = b64_to_utf8(str);
            //console.log("load:"+str);
            str = str.split('|');
            /* Only have one part of save data : the state variables */
            var p1 = str[0].split(';');
            //console.log(p1);
            Game.dateStarted = parseInt(p1[0]);
            Game.currency = parseInt(p1[1]);
            Game.totalEarnings = parseInt(p1[2]);
            Game.clicks = parseInt(p1[3]);
            Game.clickEarnings = parseInt(p1[4]);
            Inv.size = parseInt(p1[5]);
            Game.earningsPerSec = parseFloat(p1[6]);
            unlockBackground(p1[7]);
            Game.currentBg = backgroundUnlocked(p1[7]);
            gSetCurrTarget(p1[8]);
            if(Game.currentTarget != null)
                Game.currentTarget.vitality = p1[9];

            var p2 = str[1].split(';');
            for(var i = 0 ; i < p2.length; i++) {
                /* Do not generate if bg currently in use */
                if(p2[i] != p1[7])
                    generate_item(p2[i]);
            }
            var p3 = str[2].split(';');
            for(var i = 0 ; i < p3.length; i++) {
                unlockBackground(p3[i]);
            }
        }
    }

    function gSave() {
        Game.lastDate=parseInt(new Date().getTime());
        var str='';
        /* Save some state */
        str+=
        parseInt(Game.dateStarted)+';'+
        parseInt(Game.currency).toString()+';'+
        parseInt(Game.totalEarnings).toString()+';'+
        parseInt(Math.floor(Game.clicks))+';'+
        parseInt(Game.clickEarnings).toString()+';'+
        parseInt(Inv.size).toString()+';'+
        parseFloat(Game.earningsPerSec).toString()+';'+
        Game.currentBg.name+";"+
        Game.currentTarget.name+";"+
        parseInt(Game.currentTarget.vitality)+";"+
        '|';
        /* Save all item names */
        for(var i = 0 ; i < Inv.items.length; i++) {
            str += Inv.items[i].name + ";";
            /* Maybe store power later */
        }
        str += '|';
        /* Save all unlocked backgrounds TODO: save current, generate objects for noncurrent*/
        for(var i = 0 ; i < Game.unlockedBackgrounds.length; i++) {
            str += Game.unlockedBackgrounds[i].name + ";";
        }
        //console.log("Save:"+str);
        /* Encode String */
        str=utf8_to_b64(str)+'!END!';

        Game.saveData=escape(str);
        var now=new Date();
        now.setFullYear(now.getFullYear()+5);
        str=Game.saveName +'='+escape(str)+'; expires='+now.toUTCString()+';';
        document.cookie=str;
    }
    /* Handles random events */
    function gGod() {
        var playerLuck = Math.random() * 100;
        /* Drop an item */
        if(playerLuck > 30) {
            generate_item("Drugs");
        }
        /* Switch to new encounter */
        if(playerLuck > 80 && Game.currentTarget.name == Game.baseTarget) {
            gRandomEncounter();
        }
        /* Target speaks */
        if(playerLuck > 60 && Game.currentTarget != null) 
            gCookieNumberAdd(rand_elem(Game.currentTarget.convo));

    }

    function gRandomEncounter() {
        var index = Math.floor(Math.random() * Game.targets.length);
        console.log(index);
        var template = Game.targets[index];
        console.log(template);
        gCloneTarget(template);
    }
    function gHandleClick() 
    {
        if (new Date().getTime()-Game.lastClick<1000/250)
        {} 
        else {
            gGod();
            gEarn(Game.mouseEarnRate);
            /* TODO : import functionality for Game.CookieNumbers add */
            Game.clicks++;
        }
        Game.clickEarnings += Game.mouseEarnRate;
        Game.lastClick=new Date().getTime();

        if(Game.currentTarget == null || Game.currentTarget.vitality <= 0) {
            gSetCurrTarget("big/basic.png");
        } else {
            /* Randomly kill off 1-3 vitality */
            Game.currentTarget.vitality -= Math.ceil(3*Math.random());
        }
    }
    function gSetCurrTarget(name) {
        console.log("name:"+name);
        if(Game.targets == null)
            return;
        for(var i = 0; i < Game.targets.length; i++) {
            if(name == Game.targets[i].name) {
                gCloneTarget(Game.targets[i]);
                return true;
            }
        }
    }

    function gCloneTarget(template) {
        if(template == null)
            return;
        Game.currentTarget = {};
        Game.currentTarget.name = template.name;
        Game.currentTarget.popName = template.popName;
        Game.currentTarget.vitality = template.vitality;
        Game.currentTarget.convo = template.convo;
        Game.currentTarget.swapFunc = template.swapFunc;
        Game.currentTarget.clickFunc = template.clickFunc;
    }

    /* TODO : Modify later for new buildings and achievements... etc */
    function gComputeCurrencyGain() {
        var base = 0, mul = 1, raw;
        /* Calculate base and mul based on purchased stuff */
        Game.recalculateEarnRate = 0;
    }
};

function StoreProduct(name, baseCost, probability)
{
    this.productName = name;
    this.baseCost = baseCost;
    this.probability = probability;
}

function StoreUpgrade(UpgradeType, number, baseCost)
{
    this.UpgradeType = UpgradeType;
    this.number = number;
    this.baseCost = baseCost;
}


var maplestoryProducts = ['Blue Snail', 'Ribbon Pig', 'Pet Panda', 'Horse Mount', 'Dinodon', 
                    'Master Robo', 'Pet Dragon', 'Grendel The Really Old', 'Great Spirit', 'Puri Puri'];

var pokemonProducts = ['Bulbasaur', 'Charmandar', 'Squirtle', 'Venusaur', 'Charizard', 'Blastoise',
                    'Articuno', 'Raikou', 'Mewtwo', 'Pichu'];

var Store = {};
Store.Construct = function()
{
    Store.productList = [];
    Store.upgradeList = [{UpgradeType:'currency', number:0, baseCost:100}];

    var folder = 'assets/img/'+Game.theme+'/';

    switch(Game.theme)
    {
        case 'maplestory':
            for(var i = 0; i < 10; i++)
            {
                Store.productList[i] = new StoreProduct(maplestoryProducts[i], 50 + Math.pow(i,7) * 30 , (1 - Math.pow(0.90, i + 1)) );
            }

            for(var i = 0; i < Store.productList.length; i++)
            {
                AddProduct(Store.productList[i].productName, folder+'product'+i+'.png');
                get(removeSpaces(Store.productList[i].productName)+'product').alt = i;
                Store.productList[i].active = false;
                console.log(Store.productList[i].active);
            }
        break;

        case 'pokemon':
            for(var i = 0; i < 10; i++)
            {
                Store.productList[i] = new StoreProduct(pokemonProducts[i], 50 + Math.pow(i,7) * 40, (1 - Math.pow(0.93, i + 1)) );
            }

            for(var i = 0; i < Store.productList.length; i++)
            {
                AddProduct(Store.productList[i].productName, folder+'product'+i+'.gif');
                get(removeSpaces(Store.productList[i].productName)+'product').alt = i;
                Store.productList[i].active = false;
            }
        break;
    }
    
    var ProductBar = get('products');
    newDiv = document.createElement('div');
    newDiv.innerHTML = '<br><br><br><br><br>';
    ProductBar.appendChild(newDiv);

}


function generateUpgrade(probability)
{
    var luck = Math.random();
    if (luck <= probability)
    {
        var newUpgrade = randomUpgrade();
        AddUpgrade('Test', 'assets/img/upgrades/'+newUpgrade.UpgradeType+newUpgrade.number+'.png');
    }
}

function randomUpgrade()
{
    var z = Math.random();
    var size = Store.upgradeList.length;

    return Store.upgradeList[Math.floor(z * size)];
}


function refreshProducts()
{
    productList = document.getElementsByClassName('product');

    for(var i = 0; i < 10; i++)
    {
        var len = productList[i].id.length;
        var id = productList[i].id.slice(0, len-7)+'cost';
        get(id).innerHTML = '<img src=\'assets/img/'+Game.theme+'/cash.png\'>' + Beautify(Store.productList[i].baseCost,0);

        if(Store.productList[productList[i].alt].baseCost <= Game.currency)
        {
            get(productList[i].id).style.opacity = 1;
            Store.productList[i].active = true;
        }
        else
        {
            get(productList[i].id).style.opacity = 0.4;
            Store.productList[i].active = false;
        }
    }
}

function BuyProduct(productName)
{

    var index = get(removeSpaces(productName)+'product').alt;
    if(Store.productList[index].active && Store.productList[index].baseCost <= Game.currency)
    {
        Game.currency -= Store.productList[index].baseCost;
        Store.productList[index].baseCost *= 1.5;
        generateUpgrade(Store.productList[index].probability); 
        Store.productList[index].probability += (Store.productList[index].probability*0.03);
    }
}

function AddProduct(title, imageURL)
{
    var productBar = get('products');
    productBar.backgroundColor= '#000';

    var id = removeSpaces(title);

    var newDiv = document.createElement('div');

    var str;
    str = '<div class="product" id='+id+'product'+'><img src='+imageURL+'><h1 class="content">'+title+'</h1>';
    str += '<span id='+id+'cost'+' class="cost"><img src=\'assets/img/'+Game.theme+'/cash.png\'></span></div>';
    str += NewTooltip(title);
    newDiv.innerHTML = str;
    newDiv.onclick = function(){ BuyProduct(title); };

    newDiv.onmouseover = function(){ printToolTip(title); };

    productBar.appendChild(newDiv);
}

function printToolTip(productName)
{
    get(removeSpaces(productName)+'tooltip').innerHTML = productName;
}

function AddUpgrade(title, imageURL)
{
    var upgradeBar = get('upgrades');

    var newDiv = document.createElement('div');
    newDiv.className='upgrade';
    newDiv.setAttribute('id',title+'upgrade');
    str = '<img src='+imageURL+'>';
    newDiv.innerHTML = str;

    upgradeBar.appendChild(newDiv);
}

function NewTooltip(str)
{
    var id = removeSpaces(str);

    return '<div id=\''+id+'tooltip\' class="tooltip" style="height:64px;width:300px;"></div>';
}

function removeSpaces(str)
{
    var split = str.split(" ");
    var newStr = "";

    for(var i = 0; i < split.length; i++)
    {
        newStr += split[i];
    }

    return newStr;
}

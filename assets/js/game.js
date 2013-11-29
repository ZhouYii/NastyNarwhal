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

    Inv.updateCapacity = function() {
        var target = get("inv-title"), size = Inv.items.size;
        if(size == null)
            size = 0;

        target.innerHTML = "Inventory ("+size+"/"+Inv.size+")";
    };

};
Game.Construct = function() 
{
    Game.initialized = 0;
    Game.T = 0;
    Game.drawT = 0;
    Game.fps = 30;
    Game.defaultBg = 'background_img.jpg';
    Game.targetX=0;
    Game.targetY=0;
    Game.saveName = "theGame";
    /* Game Variables */
    Game.currency = 0;
    Game.mouseEarnRate = 1;
    Game.clickEarnings = 0;
    Game.totalEarnings = 0;
    Game.dateStarted = parseInt(new Date().getTime());

    Game.time = new Date().getTime();
    Game.lastClick = 0;
    Game.autoclickerDetected = 0;
    Game.BigCookieState = 0;
    Game.BigCookieSize = 0;
    Game.clicks = 0;
    Game.recalculateEarnRate = 1;
    Inv.Init();
    gLoad();
    gLoadAssets();
    /* Set listeners for the click target */
    gInitClickTarget();
    /*Store.Construct(); */
    gMain();

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
        var pics=[
                  'blackGradient.png',
                  'shadedBorders.png',
                  'target.png',
                  'shine.png',
                  'storetile.jpg',
                  'inv_top.png',
                  'inv_row.png',
                  'inv_bot.png',
                  'drugs.png',
                  'inv_slot.png',
                  'background_img.jpg'
                  ];
        for(var i = 0 ; i < pics.length; i++) {
            var img = new Image();
            img.src = "assets/img/" + pics[i];
            img.onload = gDrawBackground;
            Game.assets[pics[i]] = img;
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
            Game.Background.fillPattern(Game.assets[Game.defaultBg],x,y,Game.Background.canvas.width,Game.Background.canvas.height,s1,s1); 
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
        Game.LeftBackground.drawImage(Game.assets['target.png'],x,y,s,s);
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
        get("currency").innerHTML="You have " + Game.currency + " monies";
        Game.drawT++;
    }
    function gMain() 
    {
        gDraw();
        Game.time++;

        if((Game.time%60) == 0)
          gSave();
        setTimeout(gMain,1000/Game.fps);
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
            str = str.split('|');
            /* Only have one part of save data : the state variables */
            var p1 = str[0].split(';');
            Game.dateStarted = parseInt(p1[0]);
            Game.currency = parseInt(p1[1]);
            Game.totalEarnings = parseInt(p1[2]);
            Game.clicks = parseInt(p1[3]);
            Game.clickEarnings = parseInt(p1[4]);
            console.log(parseInt(p1[5]));
            Inv.size = parseInt(p1[5]);

            var p2 = str[1].split(';');
            console.log(str);
            for(var i = 0 ; i < p2.length; i++) {
                generate_item(p2[i]);
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
        '|';
        /* Save all item names */
        for(var i = 0 ; i < Inv.items.length; i++) {
            str += Inv.items[i].name + ";";
            /* Maybe store power later */
        }
        /* Encode String */
        str=utf8_to_b64(str)+'!END!';

        Game.saveData=escape(str);
        var now=new Date();
        now.setFullYear(now.getFullYear()+5);
        str=Game.saveName +'='+escape(str)+'; expires='+now.toUTCString()+';';
        document.cookie=str;
        console.log("Saved");
    }
    /* Handles random events */
    function gGod() {
        var playerLuck = Math.random() * 100;
        if(playerLuck > 30) {
            generate_item("Drugs");
        }
            

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
    }

    /* TODO : Modify later for new buildings and achievements... etc */
    function gComputeCurrencyGain() {
        var base = 0, mul = 1, raw;
        /* Calculate base and mul based on purchased stuff */
        Game.recalculateEarnRate = 0;
    }
};

var Store = {};
Store.Construct = function()
{
    Store.productList = [ 
    {name: 'apples', cost: 10},
    {name: 'tomatoes', cost: 20},
    {name: 'bananas', cost: 30},
    {name: 'cherries', cost: 40},
    {name: 'mangos', cost: 50}, 
    {name: 'strawberries', cost: 60},
    {name: 'oranges', cost: 70},
    {name: 'grapes', cost: 80},
    {name: 'watermelon', cost: 90},
    {name: 'dragonfruit', cost: 100}
    ];

    for(var i = 0; i < Store.productList.length; i++)
    {
        AddProduct(Store.productList[i].name, '#');
        Store.productList[i].active = false;
    }

    var ProductBar = get('products');
    newDiv = document.createElement('div');
    newDiv.innerHTML = '<br><br><br><br><br>';
    ProductBar.appendChild(newDiv);

}

function AddProduct(title, imageURL)
{
    var productBar = get('products');

    var newDiv = document.createElement('div');

    var str;
    str = '<div class="product"><img src='+imageURL+'><h1 class="content">'+title+'<h1><p>Another</p></div>';
    str += NewTooltip('Testing');
    newDiv.innerHTML=str;

    productBar.appendChild(newDiv);
}


function NewTooltip(str)
{
    return '<div class="tooltip" style="height:64px;width:300px;">'+str+'</div>';
}

var Game = {};
Game.Construct = function() 
{
    Game.initialized = 0;
    Game.T = 0;
    Game.drawT = 0;
    Game.fps = 30;
    Game.defaultBg = 'background_img.jpg';
    Game.targetX=0;
    Game.targetY=0;
    /* Game Variables */
    Game.currency = 0;
    Game.time = new Date().getTime();
    Game.lastClick = 0;
    Game.autoclickerDetected = 0;
    Game.BigCookieState = 0;
    Game.BigCookieSize = 0;
    Game.mouseEarnRate = 1;
    Game.clicks = 0;
    Game.recalculateEarnRate = 1;

    gLoadAssets();
    /* Set listeners for the click target */
    gInitClickTarget();
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
    function gEarn (amt) {Game.currency += amt;};
    function gLoadAssets () {
        Game.assets = {};
        var pics=[
                  'blackGradient.png',
                  'shadedBorders.png',
                  'target.png',
                  'shine.png',
                  'background_img.jpg'
                  ];
        for(var i in pics) {
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

    function gDrawBackground() {
        if (!Game.Background)
        {
            console.log("hi");
            Game.Background=get('backgroundCanvas').getContext('2d');
            Game.Background.canvas.width=screen.width;
            Game.Background.canvas.height=screen.height;
            Game.LeftBackground=get('backgroundLeftCanvas').getContext('2d');
            Game.LeftBackground.canvas.width=Game.LeftBackground.canvas.parentNode.offsetWidth;
            Game.LeftBackground.canvas.height=Game.LeftBackground.canvas.parentNode.offsetHeight;
            window.addEventListener('resize', function(event)
            {
                Game.Background.canvas.width=screen.width;
                Game.Background.canvas.height=screen.height;
                Game.LeftBackground.canvas.width=Game.LeftBackground.canvas.parentNode.offsetWidth;
                Game.LeftBackground.canvas.height=Game.LeftBackground.canvas.parentNode.offsetHeight;
            });
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

    function gDraw() 
    {
        gDrawBackground();
        gDrawCookie();
        get("currency").innerHTML="You have no monies";
        Game.drawT++;
    }
    function gMain() 
    {
        gDraw();
        setTimeout(gMain,1000/Game.fps);
    }
    function gHandleClick() 
    {
        console.log("hello");
        if (new Date().getTime()-Game.lastClick<1000/250)
        {} 
        else {
            gEarn(Game.mouseEarnRate);
            Game.handmadeCurrency+=gComputeCurrencyGain();
            /* TODO : import functionality for Game.CookieNumbers add */
            Game.clicks++;
        }
        Game.mouseGain += Game.mouseEarnRate;
        Game.lastClick=new Date().getTime();
    }

    /* TODO : Modify later for new buildings and achievements... etc */
    function gComputeCurrencyGain() {
        var base = 0, mul = 1, raw;
        /* Calculate base and mul based on purchased stuff */
        Game.recalculateEarnRate = 0;
    }
};

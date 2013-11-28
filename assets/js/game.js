var Game = {};
Game.Construct = function() 
{
    Game.initialized = 0;
    Game.T=0;
    Game.drawT=0;
    Game.fps=30;
    Game.defaultBg='background_img.jpg';
    gLoadAssets();
    /* Game Variables */
    Game.currency = 0;
    Game.time=new Date().getTime();

    function gAddCurrency (amt) {Game.currency += amt;};
    function gLoadAssets () {
        Game.assets = {};
        var pics=[
                  'blackGradient.png',
                  'shadedBorders.png',
                  'background_img.jpg'
                  ];
        for(var i in pics) {
            var img = new Image();
            img.src = "assets/img/" + pics[i];
            img.onload = gDrawBackground;
            Game.assets[pics[i]] = img;
        }
    }
    function gDrawBackground() {
        if (!Game.Background)
        {
            console.log("hi");
            Game.Background=get('backgroundCanvas').getContext('2d');
            Game.Background.canvas.width=Game.Background.canvas.parentNode.offsetWidth;
            Game.Background.canvas.height=Game.Background.canvas.parentNode.offsetHeight;
            Game.LeftBackground=get('backgroundLeftCanvas').getContext('2d');
            Game.LeftBackground.canvas.width=Game.LeftBackground.canvas.parentNode.offsetWidth;
            Game.LeftBackground.canvas.height=Game.LeftBackground.canvas.parentNode.offsetHeight;
            window.addEventListener('resize', function(event)
            {
                Game.Background.canvas.width=Game.Background.canvas.parentNode.offsetWidth;
                Game.Background.canvas.height=Game.Background.canvas.parentNode.offsetHeight;
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
};

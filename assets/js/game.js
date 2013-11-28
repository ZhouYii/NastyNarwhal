var Game = {};
Game.Construct = function() 
{
    Game.initialized = 0;
    Game.background=get('backgroundCanvas').getContext('2d');
    Game.background.canvas.width=Game.background.canvas.parentNode.offsetWidth;
    Game.background.canvas.height=Game.background.canvas.parentNode.offsetHeight;
    Game.leftBackground=get('backgroundLeftCanvas').getContext('2d');
    Game.leftBackground.canvas.width=Game.leftBackground.canvas.parentNode.offsetWidth;
    Game.leftBackground.canvas.height=Game.leftBackground.canvas.parentNode.offsetHeight;
    window.addEventListener('resize', function(event)
    {
        Game.background.canvas.width=Game.background.canvas.parentNode.offsetWidth;
        Game.background.canvas.height=Game.background.canvas.parentNode.offsetHeight;
        Game.leftBackground.canvas.width=Game.leftBackground.canvas.parentNode.offsetWidth;
        Game.leftBackground.canvas.height=Game.leftBackground.canvas.parentNode.offsetHeight;
    });
 
    Game.LoadAssets = function() 
    {
      Game.assets = {};
      var pics=[
                'blackGradient.png',
                'background_img.jpg',
                'download.jpeg'
                ];
        for(var i in pics) {
            var img = new Image();
            img.src = "assets/img/" + pics[i];
            Game.assets[pics[i]] = img;
        }
    };
    Game.DrawBackground = function() 
    {
        img = Game.assets['download.jpeg'];
        if(img != null) {
            console.log("Drawing background");
            var pattern = Game.background.createPattern(img, "repeat");
            Game.background.rect(0, 0, Game.background.canvas.width, Game.background.canvas.height);
            Game.background.fillStyle = pattern;
            Game.background.fill();
        } else {
            console.log("Error: Can't find background_img.jpg resource");
        }
    };

    Game.LoadAssets();
    Game.assets['background_img.jpg'].onload = Game.DrawBackground();
    Game.time=new Date().getTime();
};

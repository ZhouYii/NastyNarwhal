function aDrug() {
    var fate = 1;

    if(heads())
        fate*= -1;
    moneyPSFunctor(fate*4, 2)();

    if(heads() && heads())
        fate*= -1;
    moneyFunctor(fate*0.1*Game.currency, 2)();
}

function aDefaultBg() {
    return;
}

/* Make shop cheaper? */
/* Perm increases */

function aOrbisShip() {
    console.log("Orbis ship background did something");
}

function aAssasinate() {
    console.log("kill");
    if(Game.currentTarget != null) {
        Game.currentTarget.swapFunc();
        gSetCurrTarget("big/basic.png");
    }

}

/* Functor Suite */

function moneyFunctor(base, mult) {
    console.log("functor2");
    return function() {
        gEarn(base*rand(mult));
    };
}

function moneyPSFunctor(base, mult) {
  console.log("functor");
    return function() {
        console.log(rand(mult));
        Game.earningsPerSec += base*rand(mult);
    };
}

function attractFunctor(base, mult) {
    return function() {
        Game.attract = base*rand(mult);
    };
}

function vitalsFunctor(base, mult) {
    return function() {
        if(Game.currentTarget != null) 
            Game.currentTarget.vitality += base*rand(mult);
    };
}

function itemLuckFunctor(base, mult) {
    console.log("cool");
    return function() {
        Game.itemLuck += base * rand(mult);
    };
}
/*
function spawnRandomFunctor(item_list, count) {
    return function() {
        
    }
}*/

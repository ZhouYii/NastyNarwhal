window.onload=function()
{
    Game.Construct();
    Inv.Init();
    get("no-js").innerHTML='<div class="title">Loading</div>';
    AddProduct('Test', 'assets/img/cursoricon.png');

};

function AddProduct(title, imageURL)
{
	var productBar = document.getElementById('products');

	var newDiv = document.createElement('div');
	newDiv.className = 'product';

	var newProductImg = document.createElement('img');
	newProductImg.src = imageURL;
	var newProductContent = document.createElement('h1');
	newProductContent.innerHTML = "Hello";
	newProductContent.className = "content";

	var newDiv2 = document.createElement('div');
	newDiv2.id = 'cost';
	newDiv2.innerHTML = 'Another';

	newDiv.appendChild(newProductImg);
	newDiv.appendChild(newProductContent);
	newDiv.appendChild(newDiv2);
	productBar.appendChild(newDiv);
}

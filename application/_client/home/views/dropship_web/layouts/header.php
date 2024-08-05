<header class="mt-[20px]">
        <div id="toolsbar" class="flex justify-center gap-8">
            <div class="logo flex w-[350px] h-[50px] border"></div>
            <div class="searchbar rounded-lg flex w-[500px] h-[45px] border">
                <input placeholder="Search for products..." class="searchbar-box w-[300px] ml-[15px]"></input>
                <button class="search-button flex w-[30px] h-[30px] justify-self-center mx-auto self-center border mr-[15px] bg-yellow-300 justify-center items-center rounded"><svg width="20" height="'20" fill="white" xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                    <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
                </button>
            </div>
            <div class="cart flex items-center">
                <div class="cart-image w-[30px] h-[30px] justify-self-center mx-auto self-center mb-[5px]"><img src="./images/market.png" class="w-full h-full" alt=""></div>
                <span class="font-extrabold tracking-wide ml-[5px]">Cart</span>
                <div class="product_number font-bold flex ml-[5px] border-2 border-yellow-300 rounded-full w-[30px] h-[30px]"><span class="mx-auto my-auto text-red-500">5</span></div>
            </div>
            <div class="authenticate-button flex gap-4 font-extrabold text-[20px]">
                <button onclick="open_login_modal()" class="login flex justify-center items-center w-[150px] h-[50px] border-2 border-black rounded">Log in</button>
                <button onclick="signup_modal()" class="signup flex bg-yellow-300 justify-center items-center w-[170px] h-[50px] border-2 border-black rounded bg-yellow">Sign up</button>
            </div>
        </div>
        <hr class="my-[20px]">
        <div id="menu" class="flex mx-auto h-[30px]">
            <ul class="flex gap-16 justify-center items-center w-full font-medium text-[16.5px]">
                <li><a href="#">family Tshirt</a></li>
                <li><a href="#">Dad & Kid</a></li>
                <li><a href="#">Mom & Kid</a></li>
                <li><a href="#">Sibling Tshirt</a></li>
                <li><a href="#">Counple Tshirt</a></li>
                <li><a href="#">Kids Babies</a></li>
                <li><a href="#">Home & Living</a></li>
            </ul>
        </div>
        <hr class="my-[20px]">
    </header>
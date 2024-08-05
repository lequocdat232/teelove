<div id="login_modal" class="modal flex flex-col fixed absolute z-1 bg-white items-end">
    <button onclick="close_login_modal()" class="text-[26px] mt-0 mr-0">x</button>
    <div class="login_title font-semibold mx-auto justify-center flex">Đăng nhập</div>
    <hr class="my-[7px]">
    <div class="login_details flex flex-col gap-5 items-center mt-[50px]">
        <div class="username_group flex flex-col">
            <label for="login_username">tên đăng nhập:</label>
            <input class="login_username w-[250px] h-[30px] border border-black"></input>
        </div>
        <div class="password_group flex flex-col">
            <label for="login_password">mật khẩu:</label>
            <input class="login_password w-[250px] h-[30px] border border-black"></input>
        </div>  
    </div>
</div>
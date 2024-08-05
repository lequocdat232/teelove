<script>
var login_modal = document.getElementById("login_modal");
var signup_modal = document.getElementById("signup_modal");
// Add open class to toggle "open" mode
function open_login_modal() {
    login_modal.classList.add('open');
}

function close_login_modal() {
    login_modal.classList.remove('open');
}
// Remove open class to "hide" modal
function signup_modal() {
    signup_modal.classList.remove('open');
}
</script>
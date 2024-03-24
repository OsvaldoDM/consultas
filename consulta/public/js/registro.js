
const btnAccept = document.getElementById("btnAccept")

function login() {
    const password = document.getElementById('password').value;
    if (password === "123") location.href='/consultas'
}

btnAccept.onclick = login

const btnAccept = document.getElementById("btnAccept")

function login() {
    const password = document.getElementById('password').value;
    if (password === "mifer280294") location.href='/consultas'
}

btnAccept.onclick = login
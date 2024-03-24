/* Codigo para Pop Up */
const windowBackground = document.getElementById('window-background'),
    windowContainer = document.getElementById('window-container'),
    openButton = document.getElementById('open-button'),
    closeButton = document.getElementById('close-button')

openButton.addEventListener('click', () => windowBackground.style.display = 'flex')

const closeWindow = () => {
    windowContainer.classList.add('close')
    setTimeout(() => {
        windowContainer.classList.remove('close')
        windowBackground.style.display = 'none'
    }, 900);
}

closeButton.addEventListener('click', () => closeWindow())

window.addEventListener('click', e => e.target == windowBackground && closeWindow())

//Formato de fecha
var fechaActual = new Date();

var dia = fechaActual.getDate();
var mes = fechaActual.getMonth() + 1; 
var anio = fechaActual.getFullYear();

var fechaFormateada = (dia < 10 ? '0' : '') + dia + '/' + (mes < 10 ? '0' : '') + mes + '/' + anio;


function displayData(jsonData) {
    var consultasContainer = document.getElementById('consultasContainer');
    jsonData.forEach(function(paciente) {
        var pacienteDiv = document.createElement('div');
        pacienteDiv.classList.add('paciente');
        pacienteDiv.innerHTML += "<p>Nombre: " + paciente.nombre + "</p>";
        pacienteDiv.innerHTML += "<p>Edad: " + paciente.edad + "</p>";
        pacienteDiv.innerHTML += "<p>Motivo: " + paciente.motivo + "</p>";
        pacienteDiv.innerHTML += "<p>Diagnóstico: " + paciente.diagnostico + "</p>";
        pacienteDiv.innerHTML += "<p>TA: " + paciente.ta + "</p>";
        pacienteDiv.innerHTML += "<p>FC: " + paciente.fc + "</p>";
        pacienteDiv.innerHTML += "<p>Temperatura: " + paciente.temperatura + "</p>";
        pacienteDiv.innerHTML += "<p>Peso: " + paciente.peso + "</p>";
        pacienteDiv.innerHTML += "<p>Talla: " + paciente.talla + "</p>";
        if (paciente.costo !== undefined) {
            pacienteDiv.innerHTML += "<p>Costo: " + paciente.costo + "</p>";
        }
        consultasContainer.appendChild(pacienteDiv);
    });
}

// Fetch data from JSON file
fetch('../../datos.json')
  .then(response => response.json())
  .then(jsonData => displayData(jsonData))
  .catch(error => console.error('Error fetching JSON:', error));
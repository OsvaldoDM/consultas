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

//Codigo para el filtro de nombres
document.addEventListener('DOMContentLoaded', function() {
    const filtroNombre = document.getElementById('filtroNombre');
    filtroNombre.addEventListener('input', function() {
      const nombreBuscado = filtroNombre.value.trim().toLowerCase();
      const consultasContainer = document.querySelectorAll('.consultas');
      consultasContainer.forEach(consulta => {
        const nombrePaciente = consulta.querySelector('.name').textContent.trim().toLowerCase();
        if (nombrePaciente.includes(nombreBuscado)) {
          consulta.style.display = 'flex';
        } else {
          consulta.style.display = 'none';
        }
      });
    });
});
  
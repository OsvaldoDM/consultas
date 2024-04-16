//Codigo para exportar PDF
document.getElementById('btnExportPDF').addEventListener('click', async () => {
    const urlActual = window.location.href;
    const idMatch = urlActual.match(/https?:\/\/[^/]+\/paciente\/([\w-]+)/);
    if (!idMatch || idMatch.length < 2) {
        console.error('No se pudo extraer el ID completo del paciente de la URL.');
        return;
    }
    const id = idMatch[1];

    const response = await fetch('/otroPdf/'+id);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // Nombre del archivo PDF
    a.download = 'archivo.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);

    // Mostrar la alerta personalizada
    document.getElementById('customAlert').style.display = 'block';
    // Ocultar la alerta después de 3 segundos (3000 milisegundos)
    setTimeout(() => {
        document.getElementById('customAlert').style.display = 'none';
    }, 3000);
});

function closeCustomAlert() {
    document.getElementById('customAlert').style.display = 'none';
}
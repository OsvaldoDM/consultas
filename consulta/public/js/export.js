//Codigo para exportar PDF
document.getElementById('btnExportPDF').addEventListener('click', async () => {
    const urlActual = window.location.href;
    const idMatch = urlActual.match(/https?:\/\/([^/]+)\/paciente\/(\d+)/);
    if (!idMatch || idMatch.length < 3) {
        console.error('No se pudo extraer el ID del paciente de la URL.');
        return;
    }
    const id = idMatch[0].split('/').pop(); // Tomamos el último segmento de la URL

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
});



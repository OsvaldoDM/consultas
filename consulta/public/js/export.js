document.getElementById('btnExportPDF').addEventListener('click', async () => {
    const response = await fetch('/exportar-pdf/:id');
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
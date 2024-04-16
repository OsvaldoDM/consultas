const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path'); // Importar el módulo 'path'
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const pdf = require('html-pdf');

const app = express();
const port = 3000;

// Configurar la ruta de las vistas
app.set('views', path.join(__dirname, 'public', 'views'));
// TODO: Si usas estilos, js, etc. debes configurar para servir archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));
// Configurar el middleware para parsear el cuerpo de las solicitudes POST
app.use(bodyParser.urlencoded({ extended: true }));


// Configurar el motor de plantillas EJS
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('main');
});

// Ruta para mostrar los datos del ejs
app.get('/consultas', (req, res) => {
    // Leer el archivo JSON
    fs.readFile('datos.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        try {
            const pacientes = JSON.parse(data);
            
            // Renderizar el archivo EJS y enviarlo como respuesta
            res.render('consultas', { pacientes });
        } catch (error) {
            console.error('Error al analizar el archivo JSON:', error);
            res.status(500).send('Error interno del servidor');
        }
    });
});


// Ruta para manejar la solicitud POST y agregar el paciente al archivo JSON
app.post('/addpaciente', (req, res) => {
    // Leer el contenido actual del archivo JSON
    fs.readFile('datos.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        try {
            // Parsear el JSON
            const pacientes = JSON.parse(data);

            // Obtener la fecha actual
            const fechaActual = new Date();
            const formattedDate = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;

            // Agregar el nuevo paciente
            const nuevoPaciente = {
                id: uuidv4(),
                nombre: req.body.name,
                motivo: req.body.description,
                costo: req.body.cost,
                diagnostico: "",
                edad: "",
                ta: "",
                fr: "",
                fc: "",
                temperatura: null,
                peso: null,
                talla: null,
                fecha: formattedDate,
                receta:""
                // Agrega más campos según sea necesario
            };

            pacientes.push(nuevoPaciente);

            // Convertir de nuevo a JSON
            const nuevoJSON = JSON.stringify(pacientes, null, 2);

            // Escribir los cambios en el archivo
            fs.writeFile('datos.json', nuevoJSON, 'utf8', (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo JSON:', err);
                    res.status(500).send('Error interno del servidor');
                    return;
                }
                console.log('Datos agregados exitosamente al archivo JSON.');
                res.redirect('/consultas');
            });
        } catch (error) {
            console.error('Error al analizar el archivo JSON:', error);
            res.status(500).send('Error interno del servidor');
        }
    });
});


// Ruta para mostrar los datos del paciente según su ID
app.get('/paciente/:id', (req, res) => {
    const pacienteId = req.params.id; // Obtener el ID del paciente de la URL

    // Leer el archivo JSON
    fs.readFile('datos.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        try {
            // Parsear el JSON
            const pacientes = JSON.parse(data);

            // Buscar el paciente por su ID
            const paciente = pacientes.find(p => p.id === pacienteId);

            if (!paciente) {
                res.status(404).send('Paciente no encontrado');
                return;
            }

            const todosCamposLlenos = Object.values(paciente).every(value => value !== '' && value !== null && value !== undefined);

            // Renderizar la vista EJS y enviar los datos del paciente
            res.render('infoConsultas', { paciente, todosCamposLlenos });
            console.log(paciente)
        } catch (error) {
            console.error('Error al analizar el archivo JSON:', error);
            res.status(500).send('Error interno del servidor');
        }
    });
});

app.post('/guardar/:id', (req, res) => {
    const pacienteId = req.params.id;

    // Leer el archivo JSON
    fs.readFile('datos.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        try {
            // Parsear el JSON
            let pacientes = JSON.parse(data);

            // Encontrar el paciente por su ID
            const pacienteIndex = pacientes.findIndex(p => p.id === pacienteId);

            if (pacienteIndex === -1) {
                res.status(404).send('Paciente no encontrado');
                return;
            }

            // Actualizar los datos del paciente con los datos enviados en la solicitud POST
            pacientes[pacienteIndex] = {
                ...pacientes[pacienteIndex],
                diagnostico: req.body.diagnostico,
                edad: req.body.edad,
                ta: req.body.ta,
                fr: req.body.fr,
                fc: req.body.fc,
                temperatura: req.body.temperatura,
                peso: req.body.peso,
                talla: req.body.talla,
                receta: req.body.receta
            };

            // Convertir de nuevo a JSON
            const nuevoJSON = JSON.stringify(pacientes, null, 2);

            // Escribir los cambios en el archivo
            fs.writeFile('datos.json', nuevoJSON, 'utf8', (err) => {
                if (err) {
                    console.error('Error al escribir en el archivo JSON:', err);
                    res.status(500).send('Error interno del servidor');
                    return;
                }
                console.log('Datos actualizados exitosamente en el archivo JSON.');
                res.redirect('/paciente/' + pacienteId);
            });
        } catch (error) {
            console.error('Error al analizar el archivo JSON:', error);
            res.status(500).send('Error interno del servidor');
        }
    });
});

app.get('/archivo/:id', (req, res) => {
    
    const pacienteId = req.params.id;
    // Leer el archivo JSON
    fs.readFile('datos.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        try {
            const pacientes = JSON.parse(data);

            const fechaActual = new Date();
            const formattedDate = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;

            const paciente = pacientes.find(p => p.id === pacienteId);

            if (!pacientes) {
                res.status(404).send('Paciente no encontrado');
                return;
            }

            // Renderizar la vista EJS y enviar los datos del paciente actualizado
            res.render('archivoPdf', { paciente, fechaActual: formattedDate });
        } catch (error) {
            console.error('Error al analizar el archivo JSON:', error);
            res.status(500).send('Error interno del servidor');
        }
    });
});

app.get('/otroPdf/:id', async (req, res) => {

    const pacienteId = req.params.id;
    
    try {

        const data = await fs.promises.readFile('datos.json', 'utf8');

        console.log(data)
        
        // Parsear el JSON
        const pacientes = JSON.parse(data);

        const paciente = pacientes.find(p => p.id === pacienteId);
        
        if (!pacientes) {
            res.status(404).send('Paciente no encontrado');
            return;
        }

        // Renderizamos el archivo EJS con las variables necesarias
        const htmlContent = await ejs.renderFile('./public/views/archivoPdf.ejs', {
            paciente: {
                nombre: paciente.nombre,
                diagnostico: paciente.diagnostico,
                edad: paciente.edad,
                ta: paciente.ta,
                fc: paciente.fc,
                fr: paciente.fr,
                temperatura: paciente.temperatura,
                peso: paciente.peso,
                talla: paciente.talla,
                receta: paciente.receta
            },
            fechaActual: new Date().toLocaleDateString()
        });

        // Opciones para la generación del PDF
        const options = {
            format: 'Letter'
        };

        // Generamos el PDF
        pdf.create(htmlContent, options).toFile('otroPdf.pdf', (err, response) => {
            if (err) {
                console.error('Error al generar el PDF:', err);
                res.status(500).send('Hubo un error al generar el PDF');
            } else {
                console.log('PDF generado exitosamente:', response.filename);
                res.download('otroPdf.pdf', 'archivo.pdf');
            }
        });
    } catch (error) {
        console.error('Error al renderizar el archivo EJS:', error);
        res.status(500).send('Hubo un error al renderizar el archivo EJS');
    }

});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor web iniciado en http://localhost:${port}`);
});

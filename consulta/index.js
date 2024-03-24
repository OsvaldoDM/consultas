const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path'); // Importar el módulo 'path'
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');

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
            const fechaActual = new Date();
            const formattedDate = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;
            
            // Renderizar el archivo EJS y enviarlo como respuesta
            res.render('consultas', { pacientes, fechaActual: formattedDate });
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
                talla: null
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

            const fechaActual = new Date();
            const formattedDate = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;

            // Buscar el paciente por su ID
            const paciente = pacientes.find(p => p.id === pacienteId);

            if (!paciente) {
                res.status(404).send('Paciente no encontrado');
                return;
            }

            // Renderizar la vista EJS y enviar los datos del paciente
            res.render('infoConsultas', { paciente, fechaActual: formattedDate });
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
                talla: req.body.talla
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
                res.redirect('/consultas');
            });
        } catch (error) {
            console.error('Error al analizar el archivo JSON:', error);
            res.status(500).send('Error interno del servidor');
        }
    });
});


app.get('/detalles/:id', (req, res) => {
    
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
            res.render('detalles', { paciente, fechaActual: formattedDate });
        } catch (error) {
            console.error('Error al analizar el archivo JSON:', error);
            res.status(500).send('Error interno del servidor');
        }
    });
});



// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor web iniciado en http://localhost:${port}`);
});

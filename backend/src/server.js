const app = require('./app')
const PORT = 3000;

// Servidor
app.listen(PORT, () => {
    console.log(`El servidor se esta escuchado por:http://localhost:${PORT}`);
});

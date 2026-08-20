const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '.')));

// Rutas específicas que sirven archivos HTML sin extensión
app.get('/eventos-corporativos', (req, res) => {
  res.sendFile(path.join(__dirname, 'eventos-corporativos', 'index.html'));
});

app.get('/fiestas-familiares', (req, res) => {
  res.sendFile(path.join(__dirname, 'fiestas-familiares', 'index.html'));
});

app.get('/blog/ideas-convivio-empresa-bajio', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog', 'ideas-convivio-empresa-bajio', 'index.html'));
});

app.get('/blog/que-es-casino-entretenimiento', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog', 'que-es-casino-entretenimiento', 'index.html'));
});

app.get('/blog/quinceañera-diferente-querétaro', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog', 'quinceañera-diferente-querétaro', 'index.html'));
});

// Para cualquier otra ruta no encontrada, servir el index principal
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✓ Fiesta Fantasy server corriendo en puerto ${PORT}`);
});

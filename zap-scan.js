const ZAPClient = require('zaproxy');
const zap = new ZAPClient({ proxy: 'http://localhost:8080' });

const targetUrl = 'http://localhost:3000'; // Cambia esto a la URL de tu app

async function scan() {
  try {
    console.log('Iniciando escaneo de OWASP ZAP...');
    
    // Iniciar el escaneo
    const scanId = await zap.spider.scan(targetUrl);
    console.log(`Escaneo iniciado. ID: ${scanId}`);

    // Esperar a que termine el escaneo
    let status = '0';
    do {
      status = await zap.spider.status(scanId);
      console.log(`Progreso del escaneo: ${status}%`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Espera 5 segundos
    } while (status < 100);

    console.log('Escaneo completado. Obteniendo reportes...');
    
    // Obtener los resultados
    const alerts = await zap.core.alerts(targetUrl);
    console.log('Vulnerabilidades detectadas:', alerts);
  } catch (error) {
    console.error('Error en el escaneo:', error);
  }
}

scan();
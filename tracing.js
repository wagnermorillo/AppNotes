const {trace} = require('@opentelemetry/api');
const {NodeTracerProvider} = require('@opentelemetry/node');
const {SimpleSpanProcessor} = require('@opentelemetry/tracing');
const {ZipkinExporter} = require('@opentelemetry/exporter-zipkin');

const provider = new NodeTracerProvider();

const zipkinOptions = {
  // URL del servidor Zipkin al que enviar los datos
  url: 'http://localhost:9411/api/v2/spans',
  // El nombre de servicio es una identificación para tu aplicación
  serviceName: 'nodeApp',
};
const exporter = new ZipkinExporter(zipkinOptions);

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

// Inicializa el proveedor de trazas
provider.register();

console.log('Tracing initialized');

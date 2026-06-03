import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
) {
  // Capturamos el path exacto de la petición
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Construye el destino exacto usando la IP completa
  const destinationUrl = `https://159.60.154.238${pathname}`;

  const headers = new Headers(request.headers);
  
  // Forzamos el Host legítimo firmado en el certificado SSL del F5
  headers.set("Host", "digitalservices.att.com.mx");

  // Enviamos ignorando el desajuste de IP vs texto del certificado en local
  return fetch(destinationUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
    // El truco de tipado para engañar al compilador y quitar la línea roja
    allowInsecureCertificates: true
  } as any);
}

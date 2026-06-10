import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (
  request: ZuploRequest,
  context: ZuploContext,
) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 1. Apuntamos a la IP física completa del F5 para Evitar el Loop con Akamai
  const destinationUrl = `https://159.60.154.238${pathname}`;

  const headers = new Headers(request.headers);
  
  // 2. Inyectamos el host limpio firmado en el certificado corporativo
  headers.set("Host", "digitalservices.att.com.mx");

  // 3. Evaluamos si la petición entrante lleva cuerpo (solo para POST/PUT)
  const fetchOptions: any = {
    method: request.method,
    headers: headers,
    allowInsecureCertificates: true
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    fetchOptions.body = request.body;
  }

  // 4. Disparamos usando el fetch global con bypass de tipos para la nube
  return fetch(destinationUrl, fetchOptions as any);
}

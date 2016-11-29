import httpstat from 'httpstat';

export default async (request) => {
  const method = { method: request.method };
  const params = [
    request.url,
    method,
    request.headers,
    request.data,
    request.form,
  ];
  const response = await httpstat(...params);
  return response;
};

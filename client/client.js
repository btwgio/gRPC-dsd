const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../proto/convert.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const convertProto = grpc.loadPackageDefinition(packageDefinition);

const client = new convertProto.ConverterService('localhost:50051', grpc.credentials.createInsecure());

const filePath = path.join(__dirname, 'teste.pdf');

const fileBytes = fs.readFileSync(filePath);

client.ConvertPdfToWord({ content: fileBytes, filename: 'teste.pdf' }, (err, response) => {
  if (err) return console.error('Erro:', err);

  const output = path.join(__dirname, response.filename);
  fs.writeFileSync(output, response.content);
  console.log('Arquivo Word salvo em:', output);
});

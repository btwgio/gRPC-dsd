const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');
const path = require('path');

const PROTO_PATH = path.join(__dirname, '../proto/convert.proto');

// diretórios 
const INPUT_DIR = path.join(__dirname, 'input');
const OUTPUT_DIR = path.join(__dirname, 'output');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const convertProto = grpc.loadPackageDefinition(packageDefinition);

const client = new convertProto.ConverterService('localhost:50051', grpc.credentials.createInsecure());

// conversor do pdf
function convertPdfFile(filename) {
  const filePath = path.join(INPUT_DIR, filename);
  
  try {
    const fileBytes = fs.readFileSync(filePath);
    console.log(`Convertendo: ${filename}...`);
    
    client.ConvertPdfToWord({ content: fileBytes, filename: filename }, (err, response) => {
      if (err) {
        console.error(`Erro ao converter ${filename}:`, err.message);
        return;
      }

      // gera nome do arquivo de saída com extensão .docx
      const baseName = path.parse(filename).name;
      const outputFilename = `${baseName}.docx`;
      const outputPath = path.join(OUTPUT_DIR, outputFilename);
      
      fs.writeFileSync(outputPath, response.content);
      console.log(`Arquivo convertido: ${outputFilename} salvo em output/`);
    });
  } catch (error) {
    console.error(`Erro ao ler arquivo ${filename}:`, error.message);
  }
}


try {
  const files = fs.readdirSync(INPUT_DIR);
  const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
  
  if (pdfFiles.length === 0) {
    console.log('Nenhum arquivo PDF encontrado na pasta "input".');
    console.log('Coloque seus arquivos PDF na pasta "input" e execute novamente.');
  } else {
    console.log(`Encontrados ${pdfFiles.length} arquivo(s) PDF para conversão:`);
    pdfFiles.forEach(file => console.log(`  - ${file}`));
    console.log('');
    
    
    pdfFiles.forEach(convertPdfFile);
  }
} catch (error) {
  console.error('Erro ao ler pasta input:', error.message);
}

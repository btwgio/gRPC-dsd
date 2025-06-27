# Conversor PDF → Word com gRPC

Projeto desenvolvido para a disciplina de Desenvolvimento de Sistemas Distribuídos no IFRN. Trata-se de um sistema cliente-servidor usando gRPC, onde um cliente em Node.js envia um arquivo PDF para um servidor Python, que converte esse PDF em um arquivo Word (.docx) e devolve ao cliente.

## Alunos participantes
- Giovanna Moura ([@btwgio](https://github.com/btwgio))
- Samuel Medeiros ([@samuell19](https://github.com/samuell19))
- Luiz Felipe Lopes ([@llopes05](https://github.com/llopes05))

## Tecnologias utilizadas
- 🐍 **Python 3.10+** com:
  - grpcio
  - grpcio-tools
  - pdf2docx
- 🟩 **Node.js 18+** com:
  - @grpc/grpc-js
  - @grpc/proto-loader
- 📄 **gRPC + Protocol Buffers**

## Pré-requisitos
Certifique-se de ter instalado:
- Python 3.10 ou superior
- Node.js 18 ou superior
- Virtualenv ou venv
- npm

## Estrutura do projeto

```
GRPC-DSD/
├── client/                # cliente Node.js
│   ├── client.js
│   ├── package.json
│   └── teste.pdf
├── server/                # servidor Python
│   ├── server.py
│   ├── requirements.txt
│   ├── convert_pb2.py     # gerado pelo proto
│   └── convert_pb2_grpc.py # gerado pelo proto
├── proto/
│   └── convert.proto
├── venv/                  # ambiente virtual Python
└── README.md
```

## Como executar

### 🔧 1. Rodar o servidor (Python)
Acesse a pasta:
```bash
cd server
```

Crie o ambiente virtual (se necessário) e ative-o:
```bash
python3 -m venv ../venv
source ../venv/bin/activate
```

Instale as dependências:
```bash
pip install -r requirements.txt
```

Gere os arquivos gRPC:
```bash
python -m grpc_tools.protoc -I ../proto --python_out=. --grpc_python_out=. ../proto/convert.proto
```

Inicie o servidor:
```bash
python server.py
```
O output será: "Servidor rodando em localhost:50051"

### 🟢 2. Rodar o cliente (Node.js)
Acesse a pasta client:
```bash
cd client
```

Instale as dependências:
```bash
npm install
```

Insira um arquivo PDF dentro da pasta `input`.

Execute o cliente:
```bash
node client.js
```
O servidor irá fazer a conversão do PDF salvá-lo em formato `.docx` no diretório `output`.

## Arquivo `convert.proto`
```proto
syntax = "proto3";

package converter;

service ConverterService {
  rpc ConvertPdfToWord (PdfFile) returns (WordFile);
}

message PdfFile {
  bytes content = 1;
  string filename = 2;
}

message WordFile {
  bytes content = 1;
  string filename = 2;
}
```

## Funcionalidades alcançadas
- Envio de arquivo PDF via gRPC
- Conversão do PDF em documento Word (.docx)
- Retorno binário do .docx para o cliente
- Modularização por camadas (cliente, servidor, proto)

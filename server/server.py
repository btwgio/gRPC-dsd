import grpc
from concurrent import futures
import convert_pb2
import convert_pb2_grpc
import tempfile
import os
from pdf2docx import Converter

class ConverterService(convert_pb2_grpc.ConverterServiceServicer):
    def ConvertPdfToWord(self, request, context):
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_pdf:
            tmp_pdf.write(request.content)
            pdf_path = tmp_pdf.name

        docx_path = pdf_path.replace(".pdf", ".docx")
        cv = Converter(pdf_path)
        cv.convert(docx_path)
        cv.close()

        with open(docx_path, "rb") as f:
            word_bytes = f.read()

        os.remove(pdf_path)
        os.remove(docx_path)

        return convert_pb2.WordFile(content=word_bytes, filename=request.filename.replace(".pdf", ".docx"))

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    convert_pb2_grpc.add_ConverterServiceServicer_to_server(ConverterService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Servidor rodando em localhost:50051")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()

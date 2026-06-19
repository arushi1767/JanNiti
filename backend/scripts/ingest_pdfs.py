import os
import sys
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Add backend root to Python path
sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

from services.rag_service import rag_service


#PDF_DIR = "./data/chroma/policies"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_DIR = os.path.join(BASE_DIR, "data", "chroma", "policies")


def ingest_pdfs():

    # Split large documents into chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    total_chunks = 0

    if not os.path.exists(PDF_DIR):
        print(f"Folder not found: {PDF_DIR}")
        return

    pdf_files = [
        f for f in os.listdir(PDF_DIR)
        if f.endswith(".pdf")
    ]

    if not pdf_files:
        print("No PDF files found.")
        return

    print(f"Found {len(pdf_files)} PDF files\n")

    for pdf_file in pdf_files:

        pdf_path = os.path.join(PDF_DIR, pdf_file)

        print(f"Processing: {pdf_file}")

        try:

            reader = PdfReader(pdf_path)

            text = ""

            for page in reader.pages:

                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

            if not text.strip():
                print(f"Skipping {pdf_file} (no text found)")
                continue

            chunks = splitter.split_text(text)

            metadatas = [
                {
                    "source": pdf_file,
                    "type": "policy_pdf"
                }
                for _ in chunks
            ]

            ids = [
                f"{pdf_file}_{i}"
                for i in range(len(chunks))
            ]

            rag_service.add_documents_batch(
                documents=chunks,
                metadatas=metadatas,
                ids=ids
            )

            total_chunks += len(chunks)

            print(f"Added {len(chunks)} chunks\n")

        except Exception as e:
            print(f"Error processing {pdf_file}: {e}")

    print("=" * 50)
    print(f"Ingestion Complete")
    print(f"Total Chunks Added: {total_chunks}")
    print("=" * 50)

    print(
        f"Total Documents In ChromaDB: "
        f"{rag_service.count_documents()}"
    )


if __name__ == "__main__":
    ingest_pdfs()

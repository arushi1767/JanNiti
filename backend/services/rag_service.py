import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import os
from typing import List, Optional
import hashlib
import logging

logger = logging.getLogger("janniti.rag")

class RAGService:
    def __init__(self, persist_dir: str = "./data/chroma"):
        self.persist_dir = persist_dir
        self._available = False
        self.collection = None
        self.embedder = None
        self.collection_name = "janNiti_policies"
        try:
            os.makedirs(persist_dir, exist_ok=True)
            self.client = chromadb.PersistentClient(
                path=persist_dir,
                settings=Settings(anonymized_telemetry=False)
            )
            self.embedder = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
            self.collection = self._get_or_create_collection()
            self._available = True
            logger.info(f"RAGService initialized. Documents in store: {self.count_documents()}")
        except Exception as e:
            logger.error(f"RAGService init failed: {e}. Running in degraded mode.")

    def _get_or_create_collection(self):
        try:
            return self.client.get_collection(self.collection_name)
        except Exception:
            return self.client.create_collection(
                name=self.collection_name,
                metadata={"hnsw:space": "cosine"}
            )

    def add_document(self, text: str, metadata: dict, doc_id: Optional[str] = None):
        if not self._available:
            return None
        if doc_id is None:
            doc_id = hashlib.md5(text.encode()).hexdigest()
        embedding = self.embedder.encode(text).tolist()
        self.collection.add(
            embeddings=[embedding],
            documents=[text],
            metadatas=[metadata],
            ids=[doc_id]
        )
        return doc_id

    def add_documents_batch(self, documents: List[str], metadatas: List[dict], ids: List[str]):
        if not self._available:
            return
        embeddings = self.embedder.encode(documents).tolist()
        self.collection.add(
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )

    def search(self, query: str, top_k: int = 5, language: str = "en") -> List[dict]:
        if not self._available:
            return []
        try:
            count = self.count_documents()
            if count == 0:
                return []
            n = min(top_k, count)
            query_embedding = self.embedder.encode(query).tolist()
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n
            )
            documents = []
            if results["documents"]:
                for i, doc in enumerate(results["documents"][0]):
                    documents.append({
                        "text": doc,
                        "metadata": results["metadatas"][0][i] if results["metadatas"] else {},
                        "distance": results["distances"][0][i] if results["distances"] else 0,
                    })
            return documents
        except Exception as e:
            logger.error(f"RAG search failed: {e}")
            return []

    def get_policy_context(self, policy_name: str) -> Optional[dict]:
        """Simple semantic search for a policy by name."""
        if not self._available:
            return None
        results = self.search(policy_name, top_k=1)
        if results:
            return {"text": results[0]["text"], "metadata": results[0]["metadata"]}
        return None

    '''def count_documents(self) -> int:
        if not self._available:
            return 0
        try:
            return self.collection.count()
        except Exception:
            return 0
'''
    def count_documents(self) -> int:
        print("AVAILABLE =", self._available)

        if not self._available:
            return 0

        try:
            count = self.collection.count()
            print("COUNT =", count)
            return count
        except Exception as e:
            print("COUNT ERROR =", repr(e))
            raise 

    def delete_collection(self):
        if not self._available:
            return
        self.client.delete_collection(self.collection_name)
        self.collection = self._get_or_create_collection()


rag_service = RAGService()

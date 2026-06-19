import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import os
from typing import List, Optional
import hashlib

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
            self.embedder = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
            self.collection = self._get_or_create_collection()
            self._available = True
        except Exception as e:
            print(f"[RAGService] WARNING: Failed to initialize: {e}. Running in degraded mode.")

    def _get_or_create_collection(self):
        try:
            return self.client.get_collection(self.collection_name)
        except:
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
        query_embedding = self.embedder.encode(query).tolist()
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )
        documents = []
        if results['documents']:
            for i, doc in enumerate(results['documents'][0]):
                documents.append({
                    'text': doc,
                    'metadata': results['metadatas'][0][i] if results['metadatas'] else {},
                    'distance': results['distances'][0][i] if results['distances'] else 0
                })
        return documents

    def get_policy_context(self, policy_name: str) -> Optional[dict]:
        if not self._available:
            return None
        query_embedding = self.embedder.encode(policy_name).tolist()
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=1,
            where={"$or": [{"name": policy_name}, {"name": {"$contains": policy_name}}]}
        )
        if results['documents'] and results['documents'][0]:
            return {
                'text': results['documents'][0][0],
                'metadata': results['metadatas'][0][0] if results['metadatas'] else {}
            }
        return None

    def count_documents(self) -> int:
        if not self._available:
            return 0
        return self.collection.count()

    def delete_collection(self):
        if not self._available:
            return
        self.client.delete_collection(self.collection_name)
        self.collection = self._get_or_create_collection()

rag_service = RAGService()

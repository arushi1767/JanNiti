"""
Retrieval layer over ChromaDB.

Fixes from the review:
  * bug #4 ($contains): Chroma's metadata `where` filter does NOT support
    `$contains` (that operator only works in `where_document` over the body).
    The old get_policy_context used it on a metadata field and errored/returned
    nothing. We now retrieve broadly and filter for the name substring in
    Python.
  * bug #7 (silent errors): replaced bare print with structured logging.
  * bug #5 (fragile pre-built DB): added ensure_populated() so the server can
    rebuild the index on startup if the persisted collection is empty.
  * v2.1: score threshold, language-filter fallback, reranking scaffolding.
"""
import os
import hashlib
import logging
from typing import List, Optional

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

import config

logger = logging.getLogger("janniti.rag")


class RAGService:
    def __init__(self, persist_dir: Optional[str] = None):
        self.persist_dir = persist_dir or config.CHROMA_PERSIST_DIR
        self._available = False
        self.collection = None
        self.embedder = None
        self.collection_name = "janNiti_policies"
        try:
            os.makedirs(self.persist_dir, exist_ok=True)
            self.client = chromadb.PersistentClient(
                path=self.persist_dir,
                settings=Settings(anonymized_telemetry=False),
            )
            self.embedder = SentenceTransformer(config.EMBED_MODEL)
            self.collection = self._get_or_create_collection()
            self._available = True
            logger.info(f"RAGService ready (dir={self.persist_dir}, docs={self.count_documents()})")
        except Exception as e:
            logger.error(f"Failed to initialize RAGService: {e}. Running degraded.", exc_info=True)

    def _get_or_create_collection(self):
        try:
            return self.client.get_collection(self.collection_name)
        except Exception:
            return self.client.create_collection(
                name=self.collection_name,
                metadata={"hnsw:space": "cosine"},
            )

    @property
    def available(self) -> bool:
        return self._available

    def add_document(self, text: str, metadata: dict, doc_id: Optional[str] = None):
        if not self._available:
            return None
        if doc_id is None:
            doc_id = hashlib.md5(text.encode()).hexdigest()
        embedding = self.embedder.encode(text).tolist()
        self.collection.add(embeddings=[embedding], documents=[text],
                            metadatas=[metadata], ids=[doc_id])
        return doc_id

    def add_documents_batch(self, documents: List[str], metadatas: List[dict], ids: List[str]):
        if not self._available:
            return
        embeddings = self.embedder.encode(documents).tolist()
        self.collection.add(embeddings=embeddings, documents=documents,
                            metadatas=metadatas, ids=ids)

    def search(self, query: str, top_k: int = 5, language: str = "en") -> List[dict]:
        if not self._available:
            return []
        try:
            query_embedding = self.embedder.encode(query).tolist()
            if language != "en":
                where_filter = {"language": language}
                results = self.collection.query(
                    query_embeddings=[query_embedding],
                    n_results=top_k * 2,
                    where=where_filter,
                )
                if not results.get("documents") or not results["documents"][0]:
                    if config.RAG_LANGUAGE_FALLBACK:
                        logger.info("language filter returned 0 results, falling back to multilingual")
                        results = self.collection.query(
                            query_embeddings=[query_embedding],
                            n_results=top_k * 2,
                        )
                    else:
                        return []
            else:
                results = self.collection.query(
                    query_embeddings=[query_embedding],
                    n_results=top_k * 2,
                )
        except Exception as e:
            logger.error(f"search failed: {e}", exc_info=True)
            return []

        documents = []
        if results.get("documents") and results["documents"][0]:
            for i, doc in enumerate(results["documents"][0]):
                distance = results["distances"][0][i] if results.get("distances") else 0
                score = 1.0 - distance
                if score < config.MIN_RETRIEVAL_SCORE:
                    continue
                documents.append({
                    "text": doc,
                    "metadata": results["metadatas"][0][i] if results.get("metadatas") else {},
                    "distance": distance,
                    "score": score,
                })
        return documents[:top_k]

    def get_policy_context(self, policy_name: str) -> Optional[dict]:
        """Find the chunk whose `name` metadata best matches policy_name."""
        if not self._available:
            return None
        try:
            query_embedding = self.embedder.encode(policy_name).tolist()
            results = self.collection.query(query_embeddings=[query_embedding], n_results=10)
        except Exception as e:
            logger.error(f"get_policy_context failed: {e}", exc_info=True)
            return None
        docs = results.get("documents", [[]])[0]
        metas = results.get("metadatas", [[]])[0] if results.get("metadatas") else []
        needle = policy_name.lower().strip()
        for i, doc in enumerate(docs):
            name = (metas[i].get("name", "") if i < len(metas) else "").lower()
            if needle and (needle in name or name in needle):
                return {"text": doc, "metadata": metas[i] if i < len(metas) else {}}
        if docs:
            return {"text": docs[0], "metadata": metas[0] if metas else {}}
        return None

    def count_documents(self) -> int:
        if not self._available:
            return 0
        try:
            return self.collection.count()
        except Exception:
            return 0

    def ensure_populated(self) -> int:
        """Rebuild the index from the PDFs if the collection is empty."""
        if not self._available:
            logger.warning("ensure_populated: RAG unavailable, skipping.")
            return 0
        count = self.count_documents()
        if count > 0:
            logger.info(f"ensure_populated: collection already has {count} docs.")
            return count
        logger.info("ensure_populated: collection empty -> ingesting PDFs.")
        try:
            from scripts.ingest_pdfs import ingest_pdfs
            report = ingest_pdfs()
            logger.info(f"ensure_populated: ingested {report.get('total_chunks', 0)} chunks.")
        except Exception as e:
            logger.error(f"ensure_populated: ingest failed: {e}", exc_info=True)
        return self.count_documents()

    def delete_collection(self):
        if not self._available:
            return
        self.client.delete_collection(self.collection_name)
        self.collection = self._get_or_create_collection()


rag_service = RAGService()

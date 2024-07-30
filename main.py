import logging
from loader import ReaderModeLoader
from embeddings import split_and_embed_documents
from rag_chain import setup_rag_chain

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def main():
    logging.info("Starting main process")

    # Load documents
    logging.info("Loading documents")
    loader = ReaderModeLoader(
        web_paths=("https://wahapedia.ru/wh40k10ed/the-rules/core-rules/",),
    )
    docs = loader.load()

    # Split and embed documents
    logging.info("Splitting and embedding documents")
    vectorstore = split_and_embed_documents(docs)

    # Setup RAG chain
    logging.info("Setting up RAG chain")
    rag_chain = setup_rag_chain(vectorstore)

    # Example query
    logging.info("Invoking RAG chain with example query")
    # result = rag_chain.invoke("Describe the movement phase in one sentence.")
    # print(result)
    for chunk in rag_chain.stream("Describe the movement phase in one sentence."):
      print(chunk, end="", flush=True)

if __name__ == "__main__":
    main()
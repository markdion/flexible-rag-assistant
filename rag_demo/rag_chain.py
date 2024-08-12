import logging
import os
from dotenv import load_dotenv
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from pydantic import SecretStr

from rag_demo.embeddings import split_and_embed_documents
from rag_demo.loader import ReaderModeLoader

def get_rag_chain(api_key: SecretStr, resource_links: list):
    logging.info("Starting RAG process")

    # Load environment variables from .env file
    load_dotenv()

    # Load, chunk and index the contents of the blog.
    logging.info("Loading documents")
    loader = ReaderModeLoader(
        web_paths=resource_links,
    )
    docs = loader.load()

    # Split and embed documents
    logging.info("Splitting and embedding documents")
    vectorstore = split_and_embed_documents(docs)
    
    # Retrieve and generate using the relevant snippets of the sources.
    retriever = vectorstore.as_retriever()
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        api_key=api_key.get_secret_value(),
    )

    # Setup context from chat history and relevant snippets.
    contextualize_q_system_prompt = """Given a chat history and the latest user question \
    which might reference context in the chat history, formulate a standalone question \
    which can be understood without the chat history. Do NOT answer the question, \
    just reformulate it if needed and otherwise return it as is."""
    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    history_aware_retriever = create_history_aware_retriever(
        llm, retriever, contextualize_q_prompt
    )

    # Setup question-answering chain.
    qa_system_prompt = """You are an assistant for question-answering tasks. \
    Use the following pieces of retrieved context to answer the question. \
    If you don't know the answer, just say that you don't know. \
    Use three sentences maximum and keep the answer concise.\

    {context}"""
    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )

    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
    return rag_chain
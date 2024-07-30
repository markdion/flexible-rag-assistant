import os
import bs4
from dotenv import load_dotenv
from langchain import hub
from langchain_chroma import Chroma
from langchain_community.document_loaders import WebBaseLoader
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

def extract_main_content(element):
    # Remove unwanted elements
    for unwanted in element.find_all(['script', 'style', 'nav', 'header', 'footer']):
        unwanted.decompose()
    
    # Extract text
    text = element.get_text(separator='\n', strip=True)
    
    # Clean up the text
    text = re.sub(r'\n\s*\n', '\n\n', text)
    return text.strip()

class ReaderModeLoader(WebBaseLoader):
    def parse(self, html):
        soup = bs4.BeautifulSoup(html, 'html.parser')
        
        # Try to find the main content
        main_content = (
            soup.find('main') or 
            soup.find('article') or 
            soup.find('div', class_='content') or 
            soup.find('div', id='content') or
            soup.body  # Fallback to body if no main content is found
        )
        
        if main_content:
            return extract_main_content(main_content)
        return ""

llm = ChatOpenAI(model="gpt-4o-mini")

# Load environment variables from .env file
load_dotenv()

# Extract the WEB_PATHS variable and split it into a tuple
web_paths = tuple(os.getenv('RULES_WEB_PATHS', '').split(','))

# Load, chunk and index the contents of the blog.
loader = ReaderModeLoader(
    web_paths=web_paths,
)
docs = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
splits = text_splitter.split_documents(docs)
vectorstore = Chroma.from_documents(documents=splits, embedding=OpenAIEmbeddings())

# Retrieve and generate using the relevant snippets of the blog.
retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 6})
prompt = hub.pull("rlm/rag-prompt")


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

rag_chain.invoke("What is Task Decomposition?")
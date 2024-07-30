import bs4
import re
from langchain_community.document_loaders import WebBaseLoader

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
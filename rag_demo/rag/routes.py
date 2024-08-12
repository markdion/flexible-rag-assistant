from flask import Blueprint, make_response, request, session
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
import openai
from rag_demo.rag_chain import get_rag_chain
from langchain.load import dumps, loads
from pydantic import BaseModel, SecretStr
from urllib.parse import urlparse

class DataModel(BaseModel):
  secret: SecretStr

# Blueprint Configuration
rag_bp = Blueprint(
  'rag_bp', __name__,
  template_folder='templates',
  static_folder='static'
)

def message_to_dict(message: BaseMessage) -> dict:
  return {
    "type": message.__class__.__name__,
    "content": message.content
  }

def dict_to_message(message_dict: dict) -> BaseMessage:
  if message_dict["type"] == "HumanMessage":
    return HumanMessage(content=message_dict["content"])
  elif message_dict["type"] == "AIMessage":
    return AIMessage(content=message_dict["content"])
  else:
    raise ValueError(f"Unknown message type: {message_dict['type']}")
  
def is_valid_url(url):
  try:
    result = urlparse(url)
    return all([result.scheme, result.netloc])
  except ValueError:
    return False

@rag_bp.route('/chat', methods=['POST'])
def chat():
  if request.method != 'POST':
    return make_response('Malformed request', 400)
  
  data = request.get_json()
  prompt = data.get("prompt", "")
  api_key_data = DataModel(secret=data.get("apiKey", ""))
  resource_links = data.get("resourceLinks", [])

  if (prompt == ""):
    return make_response("No prompt provided", 400)
  if (api_key_data.secret.get_secret_value() == ""):
    return make_response("No API key provided", 400)
  if (len(resource_links) == 0):
    return make_response("No resource links provided", 400)
  for link in resource_links:
    if not is_valid_url(link):
      return make_response(f"Invalid URL provided: {link}", 400)
  

  rag_chain = get_rag_chain(api_key_data.secret, resource_links)

  # Convert stored chat history back to Message objects
  chat_history = [dict_to_message(msg) for msg in session.get("chat_history", [])]

  try:
    ai_msg = rag_chain.invoke({"input": prompt, "chat_history": chat_history})
  except openai.AuthenticationError:
    return make_response("OpenAI API key is invalid", 401)
  
  chat_history.extend([HumanMessage(content=prompt), AIMessage(content=ai_msg["answer"])])
  session["chat_history"] = [message_to_dict(msg) for msg in chat_history]

  # Extract relevant document information
  documents = ai_msg.get("context", [])
  formatted_documents = [
      {
        "source": doc.metadata["source"],
        "title": doc.metadata["title"],
        "description": doc.metadata["description"],
        "page_content": doc.page_content
      }
      for doc in documents
  ]

  response_data = {
    "answer": ai_msg["answer"],
    "context": formatted_documents
  }

  print(ai_msg["answer"])
  return make_response(response_data, 200)
  
@rag_bp.route('/reset', methods=['POST'])
def reset():
  if request.method != 'POST':
    return make_response('Malformed request', 400)
  
  session.pop("chat_history", None)
  return make_response("Chat history reset", 200)
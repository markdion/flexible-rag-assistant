from flask import Blueprint, make_response, request, session
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from rag_demo.rag_chain import get_rag_chain
from langchain.load import dumps, loads

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

@rag_bp.route('/chat', methods=['POST'])
def chat():
  if request.method != 'POST':
    return make_response('Malformed request', 400)
  
  data = request.get_json()
  prompt = data.get("prompt", "")
  if (prompt == ""):
    return make_response("No prompt provided", 400)

  rag_chain = get_rag_chain()

  # Convert stored chat history back to Message objects
  chat_history = [dict_to_message(msg) for msg in session.get("chat_history", [])]

  ai_msg = rag_chain.invoke({"input": prompt, "chat_history": chat_history})
  chat_history.extend([HumanMessage(content=prompt), AIMessage(content=ai_msg["answer"])])
  session["chat_history"] = [message_to_dict(msg) for msg in chat_history]

  print(ai_msg["answer"])
  return make_response(ai_msg["answer"], 200)
  
@rag_bp.route('/reset', methods=['POST'])
def reset():
  if request.method != 'POST':
    return make_response('Malformed request', 400)
  
  session.pop("chat_history", None)
  return make_response("Chat history reset", 200)
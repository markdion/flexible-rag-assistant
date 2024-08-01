from json import JSONEncoder
from rag_demo import create_app
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = create_app()

if __name__ == '__main__':
    app.run(port=8000, debug=True)
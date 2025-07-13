from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


from dotenv import load_dotenv
import os
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage, SystemMessage, HumanMessage, ToolMessage
from operator import add as add_messages
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings

from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_core.tools import tool

load_dotenv()

embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")

llm=ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0# I want to minimize hallucination - temperature = 0 makes the model output more deterministic 
)

pdf_path="D:\\Transit_Chatbot.pdf"

pdf_loader = PyPDFLoader(pdf_path) # This loads the PDF


# Checks if the PDF is there
try:
    pages = pdf_loader.load()
    print(f"PDF has been loaded and has {len(pages)} pages")
except Exception as e:
    print(f"Error loading PDF: {e}")
    raise

# Chunking Process
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=200
)

pages_split = text_splitter.split_documents(pages) # We now apply this to our pages

# Here, we actually create the chroma database using our embeddigns model
try:
    vectorstore = Chroma.from_documents(
        documents=pages_split,
        embedding=embeddings,
        collection_name="BRTS_TimeTable"
    )
    print(f"Created ChromaDB vector store!")
except Exception as e:
    print(f"Error setting up ChromaDB: {str(e)}")
    raise

# Now we create our retriever 
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 5} # K is the amount of chunks to return
)

@tool
def retriever_tool(query: str) -> str:
    """
Retrieves relevant information from the TransitFlow knowledge base using semantic search.

    This tool queries an embedded document index (via LangGraph's retriever) for chunks of 
    information related to the user's query. It returns the top matching document segments 
    from the TransitFlow knowledge base, which contains details about:

    - City transportation systems (BRTS, local buses, railway routes)
    - Real-time schedules and service alerts
    - Fare calculation tools
    - Smart parking and ride-sharing recommendations
    - Platform features and developer credits

    Args:
        query (str): A natural language query about urban transit, smart commuting, or platform features.

    Returns:
        str: A formatted string containing one or more relevant document segments. If no results are found,
             a fallback message is returned.    """

    docs = retriever.invoke(query)

    if not docs:
        return "I found no relevant information."
    
    results = []
    for i, doc in enumerate(docs):
        results.append(f"Document {i+1}:\n{doc.page_content}")
    
    return "\n\n".join(results)

tools = [retriever_tool]

llm = llm.bind_tools(tools)

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]


def should_continue(state: AgentState):
    """Check if the last message contains tool calls."""
    result = state['messages'][-1]
    return hasattr(result, 'tool_calls') and len(result.tool_calls) > 0

system_prompt = """
Your name is "Saarthi".You are Transit ChatBot, the smart travel companion for the website "TransitFlow"—a user-centric web app focused on city transportation.

Your role is to assist users in navigating city transit options efficiently. Provide helpful, accurate, and concise responses based on the following knowledge:

- The site offers an interactive map showing local and BRTS bus routes, as well as railway routes. Users can click on routes to view schedules, stops, and live tracking.
- You provide real-time bus/train arrival times, traffic-based dynamic updates, and service alerts (e.g., route changes, delays, detours).
- There is a fare calculator to estimate costs between stops and across transport types.
- For smart parking solutions, direct users to **[amazon.com](https://amazon.com)**.
- For carpooling and ride-sharing solutions, direct users to **[flipkart.com](https://flipkart.com)**.
- You also assist with futuristic transit queries involving smart mobility, AI-powered traffic optimization, or sustainable transport ideas.
- The site is called TransitFlow, developed by Jenil Prajapati, Krishna Tahiliani, Ayushman Singh, and Vineet Gupta.

If users ask questions outside this domain, politely inform them that your expertise is limited to the TransitFlow platform and urban transit-related topics.
Always aim to be clear, concise, and helpful.
"""

tools_dict = {our_tool.name: our_tool for our_tool in tools} # Creating a dictionary of our tools

# LLM Agent
def call_llm(state: AgentState) -> AgentState:
    """Function to call the LLM with the current state."""
    messages = list(state['messages'])
    messages = [SystemMessage(content=system_prompt)] + messages
    message = llm.invoke(messages)
    return {'messages': [message]}

def take_action(state: AgentState) -> AgentState:
    """Execute tool calls from the LLM's response."""

    tool_calls = state['messages'][-1].tool_calls
    results = []
    for t in tool_calls:
        print(f"Calling Tool: {t['name']} with query: {t['args'].get('query', 'No query provided')}")
        
        if not t['name'] in tools_dict: # Checks if a valid tool is present
            print(f"\nTool: {t['name']} does not exist.")
            result = "Incorrect Tool Name, Please Retry and Select tool from List of Available tools."
        
        else:
            result = tools_dict[t['name']].invoke(t['args'].get('query', ''))
            print(f"Result length: {len(str(result))}")
            

        # Appends the Tool Message
        results.append(ToolMessage(tool_call_id=t['id'], name=t['name'], content=str(result)))

    print("Tools Execution Complete. Back to the model!")
    return {'messages': results}

# this function just checks whether the tool is valid, if it is than invoke that tool

graph = StateGraph(AgentState)
graph.add_node("llm", call_llm)
graph.add_node("retriever_agent", take_action)

graph.add_conditional_edges(
    "llm",
    should_continue,
    {True: "retriever_agent", False: END}
)
graph.add_edge("retriever_agent", "llm")
graph.set_entry_point("llm")

rag_agent = graph.compile()


def ask_question(user_input):
    print("\n=== RAG AGENT===")
                
    messages = [HumanMessage(content=user_input)] # converts back to a HumanMessage type

    result = rag_agent.invoke({"messages": messages})
    
    return result['messages'][-1].content


app = FastAPI()

# ✅ CORS so Express can call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or limit to ["http://localhost:3000"]
    allow_methods=["*"],
    allow_headers=["*"],
)

class Question(BaseModel):
    question: str

@app.post("/ask")
def query(question: Question):
    try:
        response = ask_question(question.question)
        return {"answer": response}
    except Exception as e:
        return {"error": str(e)}

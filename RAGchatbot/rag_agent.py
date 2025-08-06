# from dotenv import load_dotenv
# import os

# load_dotenv()

# from typing import TypedDict, Annotated, Sequence, List
# from langgraph.graph import StateGraph, END
# from langchain_core.messages import BaseMessage, HumanMessage, ToolMessage, SystemMessage
# from operator import add as add_messages
# from langchain_core.tools import tool
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain_tavily import TavilySearch

# from vectorstore_setup import get_vectorstore

# # Load vectorstore and retriever
# vectorstore = get_vectorstore()
# retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 5})

# @tool
# def retriever_tool(query: str) -> str:
#     """
#     Retrieves relevant information from the TransitFlow knowledge base using semantic search.

#     This tool queries an embedded document index (via LangGraph's retriever) for chunks of 
#     information related to the user's query. It returns the top matching document segments 
#     from the TransitFlow knowledge base, which contains details about:

#     - City transportation systems (BRTS, local buses, railway routes)
#     - Real-time schedules and service alerts
#     - Fare calculation tools
#     - Smart parking and ride-sharing recommendations
#     - Platform features and developer credits

#     Args:
#         query (str): A natural language query about urban transit, smart commuting, or platform features.

#     Returns:
#         str: A formatted string containing one or more relevant document segments. If no results are found,
#              than search using tavily search tool, and if it is not related to transportation or commute, return a fallback answer.    """
#     docs = retriever.invoke(query)
#     if not docs:
#         return "I found no relevant information."
#     return "\n\n".join([f"Document {i+1}:\n{doc.page_content}" for i, doc in enumerate(docs)])

# search_tool = TavilySearch(max_results=2, tavily_api_key="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")

# tools = [retriever_tool, search_tool]
# tools_dict = {tool_.name: tool_ for tool_ in tools}

# # LLM and tool binding
# llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0).bind_tools(tools=tools)

# # system_prompt = """
# # Your name is "Saarthi".You are Transit ChatBot, the smart travel companion for the website "TransitFlow"—a user-centric web app focused on city transportation.

# # Your role is to assist users in navigating city transit options efficiently. Provide helpful, accurate, and concise responses based on the following knowledge:

# # - The site offers an interactive map showing local and BRTS bus routes, as well as railway routes. Users can click on routes to view schedules, stops, and live tracking.
# # - You provide real-time bus/train arrival times, traffic-based dynamic updates, and service alerts (e.g., route changes, delays, detours).
# # - There is a fare calculator to estimate costs between stops and across transport types.
# # - You also assist with futuristic transit queries involving smart mobility, AI-powered traffic optimization, or sustainable transport ideas.
# # - The site is called TransitFlow, developed by Jenil Prajapati, Krishna Tahiliani, Ayushman Singh, and Vineet Gupta.

# # The above is the overview of the site. Use the document provided and answer as per it, if you cant find the ans in the pdf, than you can search using the tavily search tool if the topic is related to the site.

# # If users ask questions outside this domain, politely inform them that your expertise is limited to the TransitFlow platform and urban transit-related topics.
# # Always aim to be clear, concise, and helpful.
# # """
# # ###  Your Core Mission:
# # Assist users in navigating public transportation systems efficiently, providing real-time, reliable, and context-aware guidance through the TransitFlow platform.

# system_prompt = """
# You are "Saarthi", a smart and helpful transit chatbot for the website "TransitFlow" — a user-centric platform designed to simplify city transportation.

# TransitFlow was developed by Jenil Prajapati, Krishna Tahiliani, Ayushman Singh, and Vineet Gupta.

# ###  Your Knowledge Base Includes:
# - An interactive map displaying local buses, BRTS routes, and railway lines.
#   - Users can click on a route to view: schedules, stops, and live tracking.
# - Real-time updates:
#   - Arrival times for buses/trains
#   - Service alerts (e.g. delays, detours, cancellations)
#   - Traffic-based dynamic rerouting or travel time adjustments.
# - A fare calculator that estimates travel costs across different modes and stops.
# - Insightful support for futuristic and smart mobility topics, such as:
#   - AI-driven traffic optimization
#   - Sustainable transport
#   - Urban mobility innovation

# ###  Your Behavior:
# - Be concise, helpful, and accurate.
# - Use the provided documentation as your primary source.
# - If the answer is not in the documentation , use the Tavily search tool to find reliable information.
# - If a question is outside the scope of transportation and commute, kindly inform the user that your expertise is limited to those topics.

# ###  Tone & Style:
# - Be clear, friendly, and professional.
# - Focus on making the user experience easy and informative.
# - Avoid speculation or unsupported answers.

# NOTE : If the internal documentation does not provide a useful answer, call the 'TavilySearch' tool directly with the same query.

# Always stay focused on empowering users to navigate urban transport with ease through TransitFlow.
# """

# class AgentState(TypedDict):
#     messages: Annotated[Sequence[BaseMessage], add_messages]

# def should_continue(state: AgentState):
#     """Check if the last message contains tool calls."""
#     result = state['messages'][-1]
#     return hasattr(result, 'tool_calls') and len(result.tool_calls) > 0

# def call_llm(state: AgentState) -> AgentState:
#     """Function to call the LLM with the current state."""
#     messages = [SystemMessage(content=system_prompt)] + list(state["messages"])
#     response = llm.invoke(messages)
#     return {"messages": [response]}

# def take_action(state: AgentState) -> AgentState:
#     """Execute tool calls from the LLM's response."""
#     tool_calls = state['messages'][-1].tool_calls
#     results = []

#     for call in tool_calls:
#         result = tools_dict[call["name"]].invoke(call["args"].get("query", ""))
#         results.append(ToolMessage(tool_call_id=call["id"], name=call["name"], content=str(result)))
    
#     return {"messages": results}

# graph = StateGraph(AgentState)
# graph.add_node("llm", call_llm)
# graph.add_node("retriever_agent", take_action)
# graph.add_conditional_edges("llm", should_continue, {True: "retriever_agent", False: END})
# graph.add_edge("retriever_agent", "llm")
# graph.set_entry_point("llm")

# rag_agent = graph.compile()

# def ask_question(messages: List[BaseMessage]) -> str:
#     result = rag_agent.invoke({"messages": messages})
#     return result["messages"][-1].content

from dotenv import load_dotenv
import os
import logging  # ✅ New: Added for logging tool usage
from typing import TypedDict, Annotated, Sequence, List
from langgraph.graph import StateGraph, END
from langchain_core.messages import BaseMessage, HumanMessage, ToolMessage, SystemMessage
from operator import add as add_messages
from langchain_core.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_tavily import TavilySearch
# from vectorstore_setup import get_vectorstore

# ✅ Load environment variables
load_dotenv()
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

# ✅ Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("saarthi")

# ✅ Load vectorstore and retriever
# vectorstore = get_vectorstore()
# retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 5})

# ✅ Initialize Tavily Search tool
search_tool = TavilySearch(max_results=2, tavily_api_key=TAVILY_API_KEY)

# ✅ Tool 1: Retriever Tool - tries RAG, then Tavily, then fallback
@tool
def retriever_tool(query: str) -> str:
    """
        Search fallback tool for unanswered queries using Tavily.
        Invoked when the LLM lacks sufficient context to respond.
        Returns formatted Tavily results if found.
        Logs a warning if no relevant results are available.
        Helps extend chatbot coverage beyond local knowledge.
    """
    tavily_results = search_tool.invoke(query)
    if tavily_results:
        return f"[Tavily Search Result]\n{tavily_results}"
    
    logger.info("⚠️ Tavily returned no results.")
    return "Sorry, I couldn’t find relevant information for your query in either the documentation or web."

tools = [retriever_tool, search_tool]
# ✅ Tool registry
tools = [search_tool]
tools_dict = {tool_.name: tool_ for tool_ in tools}

# ✅ LLM + Tool binding
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0).bind_tools(tools=tools)

# ✅ System Prompt (enhanced)
system_prompt = """
You are Saarthi, a smart and helpful transit chatbot built for TransitFlow — a user-centric platform designed to simplify urban transportation. TransitFlow is developed by Jenil Prajapati, Krishna Tahiliani, Ayushman Singh, and Vineet Gupta, and it serves as a comprehensive digital guide for navigating city mobility.

Saarthi is equipped with knowledge of an interactive transit map that displays local bus routes, BRTS corridors, and railway lines. Users can explore this map to view schedules, stop details, and live tracking of public transport options. The platform also delivers real-time updates on bus and train arrivals, service alerts including delays, detours, or cancellations, and dynamic travel time adjustments based on current traffic conditions.

TransitFlow also offers a fare calculator to estimate travel costs across various modes of transport and route segments. In addition to these core features, Saarthi provides insightful assistance on futuristic mobility topics such as AI-driven traffic optimization, sustainable transportation practices, and innovations in urban mobility.

As a specialist Transport Assistant, your role is to assist users with both intra-city and inter-city transportation needs. Whenever a transport-related query arises—whether it concerns local commuting, long-distance travel, fare structures, or operator details—you must access up-to-date information using the Tavily search tool. This tool allows you to retrieve accurate and current data on travel modes, schedules, ticket pricing, service providers, and more.

You are expected to be concise, friendly, and professional in your tone, while delivering accurate and reliable responses. Your primary knowledge domain is transportation, and you should avoid answering questions outside this scope. Do not speculate or provide unsupported answers.

When using Tavily, you are capable of gathering detailed information across several categories: inter-city routes by bus, train, flight, or carpool; intra-city systems like metro, tram, and local rail; and fare details including breakdowns by class or eligibility for discounts. You can also retrieve information on terminal facilities, station amenities, and real-time service status such as delays or platform changes.

If multiple options are found through Tavily, you should present the best two or three, comparing them by travel time, cost (in Indian Rupees), and convenience. In complex, multimodal journeys, break down each segment of the trip, detailing optimal transfers and layovers. When a user asks for the best way to travel between two points, be explicit in comparing modes by duration, fare, and overall ease.

If no information is available via Tavily, offer reasonable next steps such as checking official transport websites or considering alternative modes. However, always ensure that for all transport-related queries, Tavily is invoked and cited appropriately. For example: “Train 123 departs at 15:30…”

Your core mission is to help users navigate urban and regional transport through the features and capabilities of TransitFlow, delivering up-to-date and user-friendly guidance that enhances every journey.

Always use tavily search to search for the information. If you dont get any relevant information with respect to transport and commute than give response accordingly. Also if the question of the user doesn't seem appropriate with respect to the topic, inform them about it kindly.
"""


# ✅ Agent state definition
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]

# ✅ Decision condition for graph
def should_continue(state: AgentState):
    result = state['messages'][-1]
    return hasattr(result, 'tool_calls') and len(result.tool_calls) > 0

# ✅ LLM node
def call_llm(state: AgentState) -> AgentState:
    messages = [SystemMessage(content=system_prompt)] + list(state["messages"])
    response = llm.invoke(messages)
    logger.info("💬 LLM invoked.")
    return {"messages": [response]}

# ✅ Tool execution node
def take_action(state: AgentState) -> AgentState:
    tool_calls = state['messages'][-1].tool_calls
    results = []

    for call in tool_calls:
        tool_name = call["name"]
        tool_args = call["args"].get("query", "")
        result = tools_dict[tool_name].invoke(tool_args)
        
        logger.info(f"🔧 Tool used: {tool_name} | Query: {tool_args}")
        logger.info(f"📥 Tool result: {str(result)[:200]}...")  # Shorten long output
        
        results.append(
            ToolMessage(
                tool_call_id=call["id"],
                name=tool_name,
                content=str(result)
            )
        )
    
    return {"messages": results}

# ✅ LangGraph setup
graph = StateGraph(AgentState)
graph.add_node("llm", call_llm)
graph.add_node("retriever_agent", take_action)
graph.add_conditional_edges("llm", should_continue, {True: "retriever_agent", False: END})
graph.add_edge("retriever_agent", "llm")
graph.set_entry_point("llm")

rag_agent = graph.compile()

# ✅ Interface function
def ask_question(messages: List[BaseMessage]) -> str:
    result = rag_agent.invoke({"messages": messages})
    return result["messages"][-1].content

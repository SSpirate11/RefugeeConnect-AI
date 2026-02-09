from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.voice_service import voice_service
import json

router = APIRouter()

@router.websocket("/ws/advocate/{client_id}")
async def advocate_websocket(websocket: WebSocket, client_id: str):
    print(f"Attempting connection for client: {client_id}")
    await websocket.accept()
    print(f"Accepted connection for client: {client_id}")
    await websocket.send_text(json.dumps({"type": "ai_response", "text": "Connection established."}))
    history = [] # In-memory history for this session
    
    try:
        while True:
            # Receive data (assuming JSON with text for MVP, could be binary audio later)
            data = await websocket.receive_text()
            
            try:
                message_data = json.loads(data)
                user_text = message_data.get("text", "")
            except:
                user_text = data
                
            if not user_text:
                continue

            # Process with AI
            response_text = await voice_service.processed_advocate_response(user_text, history)
            
            # Update history (MVP simplified)
            history.append({"role": "user", "parts": [user_text]})
            history.append({"role": "model", "parts": [response_text]})

            # Send back response
            await websocket.send_text(json.dumps({
                "type": "ai_response",
                "text": response_text
            }))
            
    except WebSocketDisconnect:
        print(f"Client #{client_id} disconnected")

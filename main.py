import os
import base64
import serial
import google.generativeai as genai
from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import datetime
load_dotenv()
app=FastAPI(
    title="PrakritiX Smart Waste API",
    description="API for classifying waste and controlling Arduino hardware",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*","http://localhost:3000","http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
API_KEY=os.getenv("GEMINI_API_KEY","YOUR_PLACEHOLDER_API_KEY")
genai.configure(api_key=API_KEY)
import serial.tools.list_ports
SERIAL_PORT=os.getenv("SERIAL_PORT","COM10")
BAUD_RATE=9600
arduino_serial=None
def connect_arduino():
    global arduino_serial
    if arduino_serial and arduino_serial.is_open:
        try:
            arduino_serial.in_waiting
            return True
        except serial.SerialException:
            if arduino_serial is not None:
                try:
                    arduino_serial.close()
                except Exception:
                    pass
            arduino_serial=None
    ports=serial.tools.list_ports.comports()
    arduino_port=None
    for port in ports:
        desc=port.description.lower()
        if "arduino" in desc or "ch340" in desc or "usb serial" in desc or "usbmodem" in desc:
            arduino_port=port.device
            break
    if not arduino_port and os.getenv("SERIAL_PORT"):
        arduino_port=os.getenv("SERIAL_PORT")
    if arduino_port:
        try:
            arduino_serial=serial.Serial(arduino_port,BAUD_RATE,timeout=1)
            print(f"✅ Successfully connected to Arduino on {arduino_port}")
            return True
        except serial.SerialException as e:
            print(f"⚠️ WARNING: Could not connect to Arduino on {arduino_port}.")
            print(f"Error details: {e}")
            arduino_serial=None
            return False
    return False
connect_arduino()
class ImagePayload(BaseModel):
    image_base64:str
recent_scans=[]
COMMAND_MAP={
    "DEGRADABLE":b'D',
    "NON_DEGRADABLE":b'N',
    "METAL":b'M',
    "HAZARDOUS":b'H',
    "UNKNOWN":b'U'
}
@app.post("/api/classify-waste")
async def classify_waste(payload:ImagePayload):
    global arduino_serial
    try:
        base64_data=payload.image_base64
        if "," in base64_data:
            base64_data=base64_data.split(",")[1]
        image_bytes=base64.b64decode(base64_data)
        image_parts=[
            {
                "mime_type":"image/jpeg",
                "data":image_bytes
            }
        ]
        model=genai.GenerativeModel('gemini-2.5-flash')
        prompt=(
            "Analyze this image. First, classify it strictly as DEGRADABLE, NON_DEGRADABLE, METAL, or HAZARDOUS. "
            "Second, identify the specific item. Third, if it is DEGRADABLE, estimate the number of days it takes "
            "to decompose into biogas. Return ONLY a JSON object in this exact format: "
            '{"category": "DEGRADABLE", "item_name": "apple core", "days_to_decompose": 18}'
        )
        response=model.generate_content([prompt,image_parts[0]], request_options={"retry": None})
        import json
        try:
            response_text=response.text.strip()
            if response_text.startswith("```json"):
                response_text=response_text[7:-3].strip()
            elif response_text.startswith("```"):
                response_text=response_text[3:-3].strip()
            result_data=json.loads(response_text)
            category=result_data.get("category","UNKNOWN").upper()
            item_name=result_data.get("item_name","Unknown Item")
            days_to_decompose=result_data.get("days_to_decompose",0)
        except Exception as e:
            print(f"JSON parsing error: {e}")
            category="UNKNOWN"
            item_name="Unknown Item"
            days_to_decompose=0
        if category not in COMMAND_MAP:
            category="UNKNOWN"
        command=COMMAND_MAP[category]
        scan_record={
            "category":category,
            "item_name":item_name,
            "days_to_decompose":days_to_decompose,
            "timestamp":datetime.now().isoformat()
        }
        recent_scans.insert(0,scan_record)
        if len(recent_scans)>20:
            recent_scans.pop()
        command_sent=False
        if connect_arduino():
            try:
                if arduino_serial is not None:
                    arduino_serial.write(command)
                    command_sent=True
            except Exception as e:
                print(f"Error writing to serial port: {e}")
                try:
                    if arduino_serial is not None:
                        arduino_serial.close()
                except Exception:
                    pass
                arduino_serial=None
        return{
            "status":"success",
            "category":category,
            "item_name":item_name,
            "days_to_decompose":days_to_decompose,
            "command_sent":command.decode('utf-8')if command_sent else None,
            "hardware_active":command_sent
        }
    except Exception as e:
        import traceback
        error_details=traceback.format_exc()
        print(f"Classification error: {e}")
        print(error_details)
        with open("debug_error.log","a")as f:
            f.write(f"Error: {str(e)}\n{error_details}\n")
        raise HTTPException(status_code=500,detail=str(e))
@app.get("/api/scans/recent")
async def get_recent_scans():
    return{"scans":recent_scans}
@app.get("/api/health")
async def health_check():
    is_connected=connect_arduino()
    return{
        "status":"healthy",
        "arduino_connected":is_connected
    }
if __name__=="__main__":
    import uvicorn
    uvicorn.run("main:app",host="0.0.0.0",port=8000,reload=True)

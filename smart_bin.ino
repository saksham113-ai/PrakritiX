#include <Servo.h>
const int PIN_DEGRADABLE=3;
const int PIN_NON_DEGRADABLE=5;
const int PIN_METAL=6;
const int PIN_HAZARDOUS=9;
const int ANGLE_CLOSED=0;
const int ANGLE_OPEN=90;
const unsigned long OPEN_DURATION=3000;
Servo degradableServo;
Servo nonDegradableServo;
Servo metalServo;
Servo hazardousServo;
void setup(){
Serial.begin(9600);
degradableServo.attach(PIN_DEGRADABLE);
nonDegradableServo.attach(PIN_NON_DEGRADABLE);
metalServo.attach(PIN_METAL);
hazardousServo.attach(PIN_HAZARDOUS);
degradableServo.write(ANGLE_CLOSED);
nonDegradableServo.write(ANGLE_CLOSED);
metalServo.write(ANGLE_CLOSED);
hazardousServo.write(ANGLE_CLOSED);
Serial.println("PrakritiX Smart Bin Controller Initialized.");
Serial.println("Waiting for commands (D, N, M, H)...");
}
void loop(){
if(Serial.available()>0){
char command=Serial.read();
switch(command){
case 'D':
Serial.println("Command Received: DEGRADABLE. Opening Degradable Bin.");
openBin(degradableServo);
break;
case 'N':
Serial.println("Command Received: NON_DEGRADABLE. Opening Non-Degradable Bin.");
openBin(nonDegradableServo);
break;
case 'M':
Serial.println("Command Received: METAL. Opening Metal Bin.");
openBin(metalServo);
break;
case 'H':
Serial.println("Command Received: HAZARDOUS. Opening Hazardous Bin.");
openBin(hazardousServo);
break;
case 'U':
Serial.println("Command Received: UNKNOWN. No bin opened.");
break;
case '\n':
case '\r':
break;
default:
Serial.print("Invalid command received: ");
Serial.println(command);
break;
}
}
}
void openBin(Servo&targetServo){
targetServo.write(ANGLE_OPEN);
delay(OPEN_DURATION);
targetServo.write(ANGLE_CLOSED);
Serial.println("Bin closed. Ready for next item.");
}

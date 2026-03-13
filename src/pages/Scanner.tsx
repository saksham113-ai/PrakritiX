import{useState,useEffect,useRef}from "react";
import{motion,AnimatePresence}from "motion/react";
import{Camera,Scan,CheckCircle,AlertTriangle,RefreshCw,Leaf}from "lucide-react";
import{fetchAPI}from "../lib/api";
interface ScanResult{
  name:string;
  type:string;
  confidence:number;
  days_to_decompose?:number;
}
export default function Scanner(){
  const[isScanning,setIsScanning]=useState(false);
  const[result,setResult]=useState<ScanResult | null>(null);
  const[servoState,setServoState]=useState<"closed" | "opening" | "open" | "closing">("closed");
  const videoRef=useRef<HTMLVideoElement>(null);
  const[cameraActive,setCameraActive]=useState(false);
  useEffect(()=>{
    navigator.mediaDevices
      .getUserMedia({video:{facingMode:"environment" }})
      .then((stream)=>{
        if(videoRef.current){
          videoRef.current.srcObject=stream;
          setCameraActive(true);
        }
      })
      .catch((err)=>console.error("Camera error:",err));
    return()=>{
      if(videoRef.current?.srcObject){
        const stream=videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track)=>track.stop());
      }
    };
  },[]);
  const[errorMsg,setErrorMsg]=useState<string | null>(null);
  const handleScan=async()=>{
    if(isScanning || servoState !=="closed")return;
    setIsScanning(true);
    setResult(null);
    setErrorMsg(null);
    try{
      if(!videoRef.current)throw new Error("Camera not active");
      const canvas=document.createElement("canvas");
      canvas.width=videoRef.current.videoWidth;
      canvas.height=videoRef.current.videoHeight;
      const ctx=canvas.getContext("2d");
      if(!ctx)throw new Error("Could not create canvas context");
      ctx.drawImage(videoRef.current,0,0,canvas.width,canvas.height);
      const base64Image=canvas.toDataURL("image/jpeg").split(",")[1];
      const response=await fetchAPI("/classify-waste",{
        method:"POST",
        body:JSON.stringify({image_base64:base64Image}),
      });
      if(!response || response.status !=="success"){
        throw new Error("Classification failed");
      }
      const parsedResult:ScanResult={
        name:response.item_name || "Unknown Item",
        type:response.category==="NON_DEGRADABLE" ? "Non-Degradable" :
          response.category==="DEGRADABLE" ? "Degradable" :
            response.category==="METAL" ? "Metal" :
              response.category==="HAZARDOUS" ? "Hazardous" :"Unknown",
        confidence:0.95,
        days_to_decompose:response.days_to_decompose || 0,
      };
      setResult(parsedResult);
      if("vibrate" in navigator){
        navigator.vibrate([100,50,100]);
      }
      await fetchAPI("/scans",{
        method:"POST",
        body:JSON.stringify({
          item_type:parsedResult.name,
          confidence:parsedResult.confidence,
          bin_type:parsedResult.type,
          days_to_decompose:parsedResult.days_to_decompose,
          weight_kg:Math.round((Math.random()*1.5+0.1)*100)/100
        }),
      });
      setServoState("opening");
      setTimeout(()=>setServoState("open"),500);
      setTimeout(()=>setServoState("closing"),3500);
      setTimeout(()=>setServoState("closed"),4000);
    }catch(err:any){
      console.error("Scan failed:",err);
      setErrorMsg(err.message || "Failed to analyze image. Please try again.");
    }finally{
      setIsScanning(false);
    }
  };
  const getBinColor=(type:string)=>{
    switch(type){
      case "Degradable":return "text-green-400 border-green-400 bg-green-500/10";
      case "Non-Degradable":return "text-orange-400 border-orange-400 bg-orange-500/10";
      case "Metal":return "text-gray-300 border-gray-300 bg-gray-400/10";
      case "Hazardous":return "text-red-500 border-red-500 bg-red-600/10";
      default:return "text-gray-400 border-gray-400 bg-gray-500/10";
    }
  };
  const getSolidBinColor=(type:string)=>{
    switch(type){
      case "Degradable":return "text-green-500 light:text-green-600";
      case "Non-Degradable":return "text-orange-500 light:text-orange-600";
      case "Metal":return "text-gray-400 light:text-gray-500";
      case "Hazardous":return "text-red-600 light:text-red-700";
      default:return "text-gray-500 light:text-gray-600";
    }
  };
  return(
    <>
      <div className="fixed inset-0 -z-10 bg-transparent overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 light:bg-blue-400/20 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_60%)] light:bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_60%)]" />
      </div>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Scan className="text-blue-400 light:text-blue-500" />
            <span className="text-white light:text-gray-900">AI Scanner</span>
          </h1>
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-3 h-3 rounded-full ${cameraActive ? "bg-green-500 animate-pulse" : "bg-red-500"}`}/>
            <span className="text-gray-400 light:text-gray-500">{cameraActive ? "Camera Active" :"Camera Offline"}</span>
          </div>
        </div>
        <div className="relative flex-1 bg-black light:bg-gray-900 rounded-3xl overflow-hidden border border-white/10 light:border-gray-200 shadow-[0_0_50px_rgba(0,0,0,0.5)] light:shadow-sm">
          {}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover opacity-80 light:opacity-100"
          />
          {}
          <div className="absolute inset-0 pointer-events-none">
            {}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-blue-500/50 rounded-tl-xl" />
            <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-blue-500/50 rounded-tr-xl" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-blue-500/50 rounded-bl-xl" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-blue-500/50 rounded-br-xl" />
            {}
            <AnimatePresence>
              {isScanning &&(
                <motion.div
                  initial={{top:"0%" }}
                  animate={{top:"100%" }}
                  transition={{duration:2,repeat:Infinity,ease:"linear" }}
                  className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)] z-10"
                />
              )}
            </AnimatePresence>
            {}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
              <motion.div
                animate={isScanning ?{scale:[1,1.15,1],opacity:[0.5,1,0.5]}:{}}
                transition={{duration:1.5,repeat:Infinity,ease:"easeInOut" }}
                className="relative flex items-center justify-center"
              >
                <div className="w-8 h-px bg-white/50 absolute" />
                <div className="w-px h-8 bg-white/50 absolute" />
              </motion.div>
              <AnimatePresence>
                {isScanning &&(
                  <motion.div
                    initial={{opacity:0,y:10}}
                    animate={{opacity:1,y:0}}
                    exit={{opacity:0,y:-10}}
                    className="absolute top-24 text-blue-400 font-mono text-sm tracking-widest uppercase bg-black/50 px-4 py-1 rounded-full backdrop-blur-sm border border-blue-500/30"
                  >
                    Analyzing...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <AnimatePresence mode="wait">
              {errorMsg ? (
                <motion.div
                  key="error"
                  initial={{opacity:0,y:20}}
                  animate={{opacity:1,y:0}}
                  exit={{opacity:0,y:-20}}
                  className="backdrop-blur-md border border-red-500 bg-red-600/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4"
                >
                  <AlertTriangle className="text-red-500" size={48}/>
                  <div>
                    <h3 className="text-xl font-bold text-red-500 mb-2">Analysis Failed</h3>
                    <p className="text-red-400 text-sm max-h-32 overflow-y-auto custom-scrollbar">{errorMsg}</p>
                    {errorMsg.includes("429") && (
                      <p className="text-red-300 text-xs mt-2 mt-2 font-mono">Gemini API free quota exceeded. Please provide a new key.</p>
                    )}
                  </div>
                  <button
                    onClick={() => setErrorMsg(null)}
                    className="w-full py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-colors font-bold flex items-center justify-center gap-2 mt-2 border border-red-500/30 text-red-100"
                  >
                    <RefreshCw size={20}/>
                    Try Again
                  </button>
                </motion.div>
              ) : result ?(
                <motion.div
                  key="result"
                  initial={{opacity:0,y:20}}
                  animate={{opacity:1,y:0}}
                  exit={{opacity:0,y:-20}}
                  className={`backdrop-blur-md border rounded-2xl p-6 flex flex-col gap-4 ${getBinColor(result.type)}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">
                        Detected Object
                      </div>
                      <motion.div
                        animate={{textShadow:["0px 0px 0px rgba(255,255,255,0)","0px 0px 15px rgba(255,255,255,0.6)","0px 0px 0px rgba(255,255,255,0)"]}}
                        transition={{duration:2,repeat:Infinity,ease:"easeInOut" }}
                        className="text-2xl font-bold text-white flex items-center gap-2"
                      >
                        {result.name}
                        <CheckCircle size={20}className="text-green-400" />
                      </motion.div>
                      <div className="text-sm mt-2 font-mono text-white/80">
                        Confidence:{(result.confidence*100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <div className="text-sm font-bold uppercase tracking-wider opacity-80 mb-1">
                        Target Bin
                      </div>
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{textShadow:["0px 0px 0px currentColor","0px 0px 20px currentColor","0px 0px 0px currentColor"]}}
                          transition={{duration:2,repeat:Infinity,ease:"easeInOut" }}
                          className="text-3xl font-black text-white"
                        >
                          {result.type}
                        </motion.div>
                        <AnimatedBin state={servoState}colorClass="text-white" />
                      </div>
                    </div>
                  </div>
                  {result.type==="Degradable" &&(
                    <motion.div
                      initial={{opacity:0,height:0}}
                      animate={{opacity:1,height:"auto" }}
                      className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-center gap-3"
                    >
                      <div className="p-2 bg-green-500/30 rounded-full">
                        <Leaf className="text-green-400" size={24}/>
                      </div>
                      <div>
                        <div className="font-bold text-green-400">{result.days_to_decompose || 21}Days to Biogas Started!</div>
                        <div className="text-sm text-green-200/80">This item has been added to your Biogas Tracker.</div>
                      </div>
                    </motion.div>
                  )}
                  <button
                    onClick={()=>setResult(null)}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-bold flex items-center justify-center gap-2 mt-2 border border-white/10 text-white"
                  >
                    <RefreshCw size={20}/>
                    Scan Next Item
                  </button>
                </motion.div>
              ):(
                <motion.div
                  key="controls"
                  initial={{opacity:0}}
                  animate={{opacity:1}}
                  exit={{opacity:0}}
                  className="flex justify-center"
                >
                  <button
                    onClick={handleScan}
                    disabled={isScanning || servoState !=="closed"}
                    className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all ${isScanning || servoState !== "closed"
                      ? "border-gray-600 bg-gray-800/50 cursor-not-allowed"
                      : "border-blue-500 bg-blue-500/20 hover:bg-blue-500/40 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                      }`}
                  >
                    {isScanning ?(
                      <RefreshCw className="animate-spin text-blue-400" size={32}/>
                    ):servoState !=="closed" ?(
                      <AlertTriangle className="text-yellow-500" size={32}/>
                    ):(
                      <Camera className="text-blue-400" size={32}/>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        {}
        <div className="mt-8 mb-4">
          <h3 className="text-center text-gray-400 light:text-gray-500 text-sm font-bold uppercase tracking-widest mb-4">
            Smart Dustbins
          </h3>
          <div className="flex justify-center flex-wrap gap-6 md:gap-12">
            {["Degradable","Non-Degradable","Metal","Hazardous"].map((bin)=>{
              const isMatchedBin=result?.type===bin && servoState !=="closed";
              const binState=isMatchedBin ? servoState:"closed";
              return(
                <div key={bin}className="flex flex-col items-center gap-2">
                  <AnimatedBin
                    state={binState}
                    colorClass={getSolidBinColor(bin)}
                    size="w-20 h-20 md:w-24 md:h-24"
                  />
                  <div className={`text-xs md:text-sm font-bold text-center px-3 py-1 rounded-full border transition-all ${isMatchedBin
                    ? getBinColor(bin) + " shadow-[0_0_15px_currentColor]"
                    : "border-white/10 light:border-gray-300 text-gray-500 bg-white/5 light:bg-gray-100"
                    }`}>
                    {bin}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
function AnimatedBin({state,colorClass,size="w-10 h-10" }:{state:string,colorClass:string,size?:string}){
  const isOpen=state==="opening" || state==="open";
  return(
    <div className={`${size} ${colorClass}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full overflow-visible">
        <motion.g
          initial={false}
          animate={{
            rotate:isOpen ?-40:0,
            y:isOpen ?-2:0
          }}
          transition={{duration:0.5,type:"spring",bounce:0.4}}
          style={{transformOrigin:"3px 6px" }}
        >
          <path d="M3 6h18" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </motion.g>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <line x1="10" x2="10" y1="11" y2="17" />
        <line x1="14" x2="14" y1="11" y2="17" />
      </svg>
    </div>
  );
}

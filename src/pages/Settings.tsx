import{useState,useEffect}from "react";
import{motion}from "motion/react";
import{
  Settings as SettingsIcon,
  Monitor,
  Cpu,
  Trash2,
  Brain,
  Database,
  ShieldCheck,Shield,
  Download,
  RefreshCw
}from "lucide-react";
import{useTheme}from "../context/ThemeContext";
export default function Settings(){
  const[notifications,setNotifications]=useState(true);
  const{theme,toggleTheme}=useTheme();
  const[arduinoConnected,setArduinoConnected]=useState(false);
  const[isCheckingConnection,setIsCheckingConnection]=useState(false);
  const[binThreshold,setBinThreshold]=useState(80);
  const[autoSort,setAutoSort]=useState(true);
  const[aiConfidence,setAiConfidence]=useState(85);
  const checkArduinoConnection=async()=>{
    setIsCheckingConnection(true);
    try{
      const response=await fetch("http://localhost:8000/api/health");
      const data=await response.json();
      setArduinoConnected(data.arduino_connected);
    }catch(error){
      console.error("Failed to check Arduino connection:",error);
      setArduinoConnected(false);
    }finally{
      setIsCheckingConnection(false);
    }
  };
  useEffect(()=>{
    checkArduinoConnection();
  },[]);
  return(
    <>
      <div className="fixed inset-0 -z-10 bg-transparent overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 light:bg-blue-400/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-purple-500/10 light:bg-purple-400/20 rounded-full blur-[100px]" />
      </div>
      <div className="max-w-6xl mx-auto space-y-8 relative z-10 pb-12">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white light:text-gray-900">
            <SettingsIcon className="text-gray-400 light:text-gray-500" />
            System Configuration
          </h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {}
          <motion.section
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            className="bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white light:text-gray-900">
              <Monitor className="text-blue-400 light:text-blue-500" />
              Preferences
            </h2>
            <div className="space-y-6 flex-grow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white light:text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-400 light:text-gray-500">Receive alerts when bins are full.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications}
                    onChange={()=>setNotifications(!notifications)}
                  />
                  <div className="w-11 h-6 bg-gray-700 light:bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white light:text-gray-900">Dark Mode</h3>
                  <p className="text-sm text-gray-400 light:text-gray-500">Toggle dark/light theme.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={theme==="dark"}
                    onChange={toggleTheme}
                  />
                  <div className="w-11 h-6 bg-gray-700 light:bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          </motion.section>
          {}
          <motion.section
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{delay:0.1}}
            className="bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white light:text-gray-900">
              <Cpu className="text-green-400 light:text-green-500" />
              Hardware Integration
            </h2>
            <div className="space-y-6 flex-grow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white light:text-gray-900">Arduino Connection</h3>
                  <p className="text-sm text-gray-400 light:text-gray-500">Status of the smart bin controller.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold uppercase ${arduinoConnected ? "text-green-400 light:text-green-600" : "text-red-400 light:text-red-600"}`}>
                    {arduinoConnected ? "Connected" :"Offline"}
                  </span>
                  <button
                    onClick={checkArduinoConnection}
                    disabled={isCheckingConnection}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 light:bg-gray-100 hover:bg-white/10 light:hover:bg-gray-200 text-sm font-medium transition-colors border border-white/10 light:border-gray-300 text-white light:text-gray-900 disabled:opacity-50"
                  >
                    <RefreshCw size={14}className={isCheckingConnection ? "animate-spin" :""}/>
                    {isCheckingConnection ? "Checking..." :"Refresh"}
                  </button>
                </div>
              </div>
              <div className="pt-4 border-t border-white/10 light:border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-white light:text-gray-900 flex items-center gap-2">
                      <Trash2 size={16}className="text-emerald-400 light:text-emerald-500" />
                      Bin Full Threshold
                    </h3>
                    <p className="text-sm text-gray-400 light:text-gray-500">Alert level for capacity.</p>
                  </div>
                  <span className="text-2xl font-black text-green-400 light:text-green-600">{binThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={binThreshold}
                  onChange={(e)=>setBinThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 light:bg-gray-300 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>50%</span>
                  <span>75%</span>
                  <span>95%</span>
                </div>
              </div>
            </div>
          </motion.section>
          {}
          <motion.section
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{delay:0.2}}
            className="bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white light:text-gray-900">
              <Brain className="text-purple-400 light:text-purple-500" />
              AI Classification
            </h2>
            <div className="space-y-6 flex-grow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white light:text-gray-900">Auto-Sorting</h3>
                  <p className="text-sm text-gray-400 light:text-gray-500">Trigger servos automatically.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={autoSort}
                    onChange={()=>setAutoSort(!autoSort)}
                  />
                  <div className="w-11 h-6 bg-gray-700 light:bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>
              <div className="pt-4 border-t border-white/10 light:border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-white light:text-gray-900">Confidence Threshold</h3>
                    <p className="text-sm text-gray-400 light:text-gray-500">Min. AI certainty required.</p>
                  </div>
                  <span className="text-2xl font-black text-purple-400 light:text-purple-600">{aiConfidence}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="99"
                  value={aiConfidence}
                  onChange={(e)=>setAiConfidence(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 light:bg-gray-300 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Lenient</span>
                  <span>Strict</span>
                </div>
              </div>
            </div>
          </motion.section>
          {}
          <motion.section
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{delay:0.3}}
            className="bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white light:text-gray-900">
              <Database className="text-cyan-400 light:text-cyan-500" />
              Data Management
            </h2>
            <div className="space-y-4 flex-grow">
              <p className="text-sm text-gray-400 light:text-gray-500 mb-4">
                Manage your scanned waste logs and local cache data.
              </p>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition-colors font-medium">
                <Download size={18}/>
                Export Analytics(CSV)
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors font-medium">
                <RefreshCw size={18}/>
                Clear Local Cache
              </button>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
}

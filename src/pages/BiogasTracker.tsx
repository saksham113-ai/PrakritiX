import{useState,useEffect}from "react";
import{motion,AnimatePresence}from "motion/react";
import{Activity,Zap,Droplets,Leaf,RefreshCw,CheckCircle2}from "lucide-react";
import{fetchAPI}from "../lib/api";
interface DigesterItem{
  id:string;
  itemName:string;
  aiEstimatedDays:number;
  daysActive:number;
  weightKg:number;
}
export default function BiogasTracker(){
  const[items,setItems]=useState<DigesterItem[]>([]);
  const[isLoading,setIsLoading]=useState(true);
  const fetchBiogasData=async()=>{
    try{
      const data=await fetchAPI("/biogas/active");
      setItems(data);
    }catch(err){
      console.error("Error fetching biogas data:",err);
    }finally{
      setIsLoading(false);
    }
  };
  useEffect(()=>{
    fetchBiogasData();
  },[]);
  const[isResetting,setIsResetting]=useState(false);
  const[showSuccess,setShowSuccess]=useState(false);
  const maxDaysRequired=items.length>0 ? Math.max(...items.map(item=>item.aiEstimatedDays-item.daysActive)):0;
  const totalWeight=items.reduce((sum,item)=>sum+item.weightKg,0);
  const estimatedMethaneLiters=totalWeight*100;
  const energyEquivalentKwh=(estimatedMethaneLiters/1000)*6;
  const totalEstimatedDays=items.length>0 ? Math.max(...items.map(item=>item.aiEstimatedDays)):0;
  const maxDaysActive=items.length>0 ? Math.max(...items.map(item=>item.daysActive)):0;
  const progressPercentage=totalEstimatedDays>0 ? Math.min(100,(maxDaysActive/totalEstimatedDays)*100):0;
  let stage="Idle";
  if(items.length>0){
    if(progressPercentage<33)stage="Hydrolysis";
    else if(progressPercentage<66)stage="Acidogenesis";
    else if(progressPercentage<90)stage="Acetogenesis";
    else stage="Methanogenesis";
  }
  const handleHarvest=async()=>{
    setIsResetting(true);
    try{
      await fetchAPI("/biogas/harvest",{method:"POST" });
      setItems([]);
      setShowSuccess(true);
      setTimeout(()=>setShowSuccess(false),3000);
    }catch(err){
      console.error("Harvest failed:",err);
      alert("Failed to harvest. Please try again.");
    }finally{
      setIsResetting(false);
    }
  };
  return(
    <>
      <div className="fixed inset-0 -z-10 bg-transparent overflow-hidden pointer-events-none">
        {}
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-green-500/10 light:bg-green-400/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-yellow-500/10 light:bg-yellow-400/20 rounded-full blur-[100px] mix-blend-screen" />
      </div>
      <div className="min-h-[calc(100vh-5rem)] text-white p-6 rounded-3xl relative overflow-hidden flex flex-col z-10">
        {}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex-1 flex flex-col max-w-6xl mx-auto w-full gap-8">
          {}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-white light:text-gray-900">
                <Leaf className="text-green-400 light:text-green-500" size={32}/>
                Biogas Digester<span className="text-green-400 light:text-green-500 font-mono font-light">v2.0</span>
              </h1>
              <p className="text-gray-400 light:text-gray-600 mt-1">Advanced Methane Yield Monitoring Station</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
              <div className={`w-3 h-3 rounded-full ${items.length > 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}/>
              <span className="text-sm font-mono text-gray-300">
                {items.length>0 ? 'SYSTEM ACTIVE' :'SYSTEM IDLE'}
              </span>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 flex-1">
            {}
            <div className="flex flex-col gap-4">
              <MetricCard
                title="Total Degradable Matter"
                value={`${totalWeight.toFixed(2)} kg`}
                icon={Leaf}
                color="text-green-400"
              />
              <MetricCard
                title="Est. Methane (CH4) Output"
                value={`${estimatedMethaneLiters.toFixed(1)} L`}
                icon={Droplets}
                color="text-blue-400"
              />
              <MetricCard
                title="Energy Equivalent"
                value={`${energyEquivalentKwh.toFixed(2)} kWh`}
                icon={Zap}
                color="text-yellow-400"
              />
              <div className="mt-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Current Stage</h3>
                <div className="flex items-center gap-4">
                  <Activity className="text-purple-400" size={32}/>
                  <div>
                    <div className="text-2xl font-bold text-white light:text-gray-900">{stage}</div>
                    <div className="text-sm text-gray-400 light:text-gray-600">Biological Process</div>
                  </div>
                </div>
              </div>
            </div>
            {}
            <div className="flex flex-col items-center justify-center relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
              <div className="text-center mb-8">
                <div className="text-sm font-bold text-gray-400 light:text-gray-600 uppercase tracking-wider mb-2">Estimated Batch Yield In</div>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                  {Math.max(0,maxDaysRequired)}DAYS
                </div>
              </div>
              {}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  <motion.circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{strokeDasharray:"0 283" }}
                    animate={{strokeDasharray:`${(progressPercentage / 100) * 283} 283` }}
                    transition={{duration:1.5,ease:"easeOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4ade80" />
                      <stop offset="100%" stopColor="#eab308" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-4 rounded-full bg-[#0a0e27] light:bg-white border-4 border-white/5 light:border-gray-200 flex items-center justify-center shadow-inner">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white light:text-gray-900">{progressPercentage.toFixed(0)}%</div>
                    <div className="text-xs text-gray-400 light:text-gray-500 uppercase tracking-widest mt-1">Capacity</div>
                  </div>
                </div>
                {}
                <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(34,197,94,0.3)] pointer-events-none" />
              </div>
              <div className="mt-12 w-full">
                <button
                  onClick={handleHarvest}
                  disabled={items.length===0 || isResetting}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all relative overflow-hidden group ${items.length === 0
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]'
                    }`}
                >
                  {isResetting ?(
                    <RefreshCw className="animate-spin" size={24}/>
                  ):(
                    <>
                      <Zap size={24}/>
                      Harvest Biogas & Empty Bin
                    </>
                  )}
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                </button>
              </div>
              <AnimatePresence>
                {showSuccess &&(
                  <motion.div
                    initial={{opacity:0,y:10}}
                    animate={{opacity:1,y:0}}
                    exit={{opacity:0}}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                  >
                    <CheckCircle2 size={16}/>
                    System Reset Successful
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {}
            <motion.div
              initial={{opacity:0,x:20}}
              animate={{opacity:1,x:0}}
              transition={{delay:0.3}}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col h-full max-h-[calc(100vh-16rem)]"
            >
              <h3 className="text-lg font-bold text-white light:text-gray-900 mb-4 flex items-center justify-between shrink-0">
                <span>Active Biomass</span>
                <span className="text-sm font-mono bg-white/10 light:bg-gray-200 light:text-gray-800 px-2 py-1 rounded-md">{items.length}Items</span>
              </h3>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {isLoading ?(
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                    <RefreshCw size={32}className="animate-spin text-gray-500" />
                    <p>Loading active biomass...</p>
                  </div>
                ):items.length===0 ?(
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                    <Leaf size={48}className="opacity-20" />
                    <p>Digester is empty.</p>
                  </div>
                ):(
                  items.map((item,idx)=>(
                    <motion.div
                      key={item.id}
                      initial={{opacity:0,y:10}}
                      animate={{opacity:1,y:0}}
                      transition={{delay:0.4+(idx*0.1)}}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-white light:text-gray-900">{item.itemName}</div>
                        <div className="text-xs font-mono text-green-400 light:text-green-700 bg-green-400/10 light:bg-green-500/20 px-2 py-1 rounded">
                          {item.weightKg}kg
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400 light:text-gray-600">
                        <span>Active:{item.daysActive}d</span>
                        <span>Est. Total:{item.aiEstimatedDays}d</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-800 light:bg-gray-200 rounded-full mt-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-yellow-500"
                          style={{width:`${Math.min(100, (item.daysActive / item.aiEstimatedDays) * 100)}%` }}
                        />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
function MetricCard({title,value,icon:Icon,color}:{title:string,value:string,icon:any,color:string}){
  return(
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-300">
        <Icon size={64}className={color}/>
      </div>
      <div className="relative z-10">
        <div className="text-sm font-bold text-gray-400 light:text-gray-600 uppercase tracking-wider mb-2">{title}</div>
        <div className={`text-3xl font-black ${color}`}>{value}</div>
      </div>
    </div>
  );
}

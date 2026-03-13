import{useState,useEffect}from "react";
import{motion}from "motion/react";
import{fetchAPI}from "../lib/api";
import{BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,LineChart,Line,AreaChart,Area,ComposedChart,Legend,Scatter}from "recharts";
import{Activity,PieChart as PieChartIcon,TrendingUp,Layers,Zap}from "lucide-react";
const COLORS=["#3b82f6","#10b981","#ef4444","#f59e0b"];
export default function Analytics(){
  const[data,setData]=useState<any>(null);
  const[loading,setLoading]=useState(true);
  useEffect(()=>{
    fetchAPI("/analytics")
      .then((res)=>{
        setData(res);
        setLoading(false);
      })
      .catch((err)=>{
        console.error(err);
        setLoading(false);
      });
  },[]);
  if(loading){
    return(
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return(
    <>
      <div className="fixed inset-0 -z-10 bg-transparent overflow-hidden pointer-events-none">
        {}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 light:bg-blue-400/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-500/10 light:bg-green-400/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-purple-500/10 light:bg-purple-400/20 rounded-full blur-[100px]" />
      </div>
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white light:text-gray-900">
            <Activity className="text-green-400 light:text-green-500" />
            Analytics Dashboard
          </h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {}
          <motion.div
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            className="bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] light:shadow-sm lg:col-span-1"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white light:text-gray-900">
              <PieChartIcon className="text-blue-400 light:text-blue-500" />
              Waste Distribution
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.typeDistribution ||[]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data?.typeDistribution?.map((entry:any,index:number)=>(
                      <Cell key={`cell-${index}`}fill={COLORS[index % COLORS.length]}/>
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{backgroundColor:"#0a0e27",borderColor:"#1a1f3a",borderRadius:"12px" }}
                    itemStyle={{color:"#fff" }}
                    formatter={(value:number,name:string)=>{
                      const total=data?.typeDistribution?.reduce((acc:number,entry:any)=>acc+entry.value,0)|| 1;
                      const percentage=((value/total)*100).toFixed(1);
                      return[`${value} (${percentage}%)`,name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {data?.typeDistribution?.map((entry:any,index:number)=>(
                <div key={entry.name}className="flex items-center gap-2 text-sm text-gray-400 light:text-gray-600">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor:COLORS[index % COLORS.length]}}/>
                  {entry.name}({entry.value})
                </div>
              ))}
            </div>
          </motion.div>
          {}
          <motion.div
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{delay:0.1}}
            className="bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] light:shadow-sm lg:col-span-2"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white light:text-gray-900">
              <TrendingUp className="text-green-400 light:text-green-500" />
              Recent Activity
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.recentActivity ||[]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false}/>
                  <XAxis dataKey="date" stroke="#9ca3af" tick={{fill:"#9ca3af" }}/>
                  <YAxis stroke="#9ca3af" tick={{fill:"#9ca3af" }}/>
                  <Tooltip
                    cursor={{fill:"#ffffff05" }}
                    contentStyle={{backgroundColor:"#0a0e27",borderColor:"#1a1f3a",borderRadius:"12px" }}
                  />
                  <Bar dataKey="count" fill="url(#colorCount)" radius={[4,4,0,0]}/>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          {}
          <motion.div
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{delay:0.2}}
            className="bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] light:shadow-sm lg:col-span-2"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white light:text-gray-900">
              <Layers className="text-purple-400 light:text-purple-500" />
              Cumulative Processed Volume
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.cumulativeVolume ||[
                  {date:'Mon',volume:40},{date:'Tue',volume:65},
                  {date:'Wed',volume:110},{date:'Thu',volume:160},
                  {date:'Fri',volume:230},{date:'Sat',volume:290},{date:'Sun',volume:380}
                ]}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false}/>
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{backgroundColor:"#0a0e27",borderColor:"#1a1f3a",borderRadius:"12px" }}/>
                  <Area type="monotone" dataKey="volume" stroke="#a855f7" strokeWidth={3}fillOpacity={1}fill="url(#colorVolume)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          {}
          <motion.div
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{delay:0.3}}
            className="bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] light:shadow-sm lg:col-span-1"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white light:text-gray-900">
              <Zap className="text-amber-400 light:text-amber-500" />
              System Efficiency
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data?.systemMetrics ||[
                  {hour:'08:00',accuracy:98,speed:1.2},
                  {hour:'12:00',accuracy:95,speed:1.5},
                  {hour:'16:00',accuracy:92,speed:1.8},
                  {hour:'20:00',accuracy:97,speed:1.4},
                  {hour:'00:00',accuracy:99,speed:1.1}
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false}/>
                  <XAxis dataKey="hour" stroke="#9ca3af" />
                  <YAxis yAxisId="left" stroke="#10b981" />
                  <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" />
                  <Tooltip contentStyle={{backgroundColor:"#0a0e27",borderColor:"#1a1f3a",borderRadius:"12px" }}/>
                  <Legend verticalAlign="top" height={36}/>
                  <Bar yAxisId="left" dataKey="accuracy" name="Accuracy (%)" fill="#10b981" radius={[4,4,0,0]}barSize={20}/>
                  <Line yAxisId="right" type="monotone" dataKey="speed" name="Speed (s/item)" stroke="#f59e0b" strokeWidth={3}dot={{r:4}}/>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          {}
          <motion.div
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{delay:0.4}}
            className="md:col-span-2 lg:col-span-3 bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.3)] light:shadow-sm"
          >
            <h2 className="text-xl font-bold mb-6 text-white light:text-gray-900">Scan History Timeline</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.recentActivity ||[]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false}/>
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{backgroundColor:"#0a0e27",borderColor:"#1a1f3a",borderRadius:"12px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{r:4,fill:"#3b82f6",strokeWidth:2,stroke:"#0a0e27" }}
                    activeDot={{r:6,fill:"#60a5fa",strokeWidth:0}}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

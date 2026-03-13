import{motion}from "motion/react";
import{Link}from "react-router-dom";
import{Camera,BarChart2,Trash2,ShieldCheck,Leaf}from "lucide-react";
export default function Home(){
  const features=[
    {
      icon:Camera,
      title:"AI Classification",
      desc:"Real-time object detection and sorting using advanced neural networks.",
      color:"from-blue-500 to-cyan-400",
      link:"/scanner"
    },
    {
      icon:Leaf,
      title:"Biogas Tracker",
      desc:"Monitor the decomposition of your degradable waste into biogas.",
      color:"from-green-600 to-yellow-500",
      link:"/biogas"
    },
    {
      icon:BarChart2,
      title:"Smart Analytics",
      desc:"Track your environmental impact with detailed recycling statistics.",
      color:"from-green-500 to-emerald-400",
      link:"/analytics"
    },
    {
      icon:Trash2,
      title:"Bin Monitoring",
      desc:"Live status updates and fill levels for all connected smart bins.",
      color:"from-purple-500 to-pink-400",
      link:"/bins"
    },
  ];
  return(
    <>
      <div className="fixed inset-0 -z-10 bg-transparent overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 light:opacity-5 mix-blend-overlay"></div>
      </div>
      <div className="w-full space-y-12 pb-12">
        {}
        <section className="relative w-full h-[80vh] min-h-[600px] flex items-center">
          {}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('/home_hero_bg.png')] bg-cover bg-center bg-no-repeat" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e27] via-[#0a0e27]/80 to-transparent light:from-transparent light:via-transparent light:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] via-transparent to-transparent light:from-transparent light:via-transparent light:to-transparent" />
          </div>
          <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10 flex flex-col items-start justify-center h-full">
            <motion.div
              initial={{opacity:0,x:-30}}
              animate={{opacity:1,x:0}}
              className="max-w-2xl text-left"
            >
              <h2 className="text-green-400 font-bold tracking-widest text-sm mb-4 uppercase">REDUCING. REUSING. RECYCLING.</h2>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white leading-tight">
                Efficient AI Waste<br/>
                Disposal for a<br/>
                Cleaner Tomorrow.
              </h1>
              <div className="flex flex-col sm:flex-row items-center justify-start gap-4 mt-8">
                <Link
                  to="/scanner"
                  className="px-8 py-4 rounded-full bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                >
                  <Camera size={24}/>
                  Launch Scanner
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 rounded-full bg-transparent text-white font-bold text-lg hover:bg-white/10 transition-colors border-2 border-white/20"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16 relative z-10">
          {}
          <section className="grid md:grid-cols-2 gap-6">
            {features.map((feature,idx)=>{
              const Icon=feature.icon;
              return(
                <motion.div
                  key={idx}
                  initial={{opacity:0,y:20}}
                  whileInView={{opacity:1,y:0}}
                  viewport={{once:true,margin:"-50px" }}
                  transition={{delay:idx*0.1}}
                >
                  <Link
                    to={feature.link}
                    className="block h-full bg-[#1a1f3a]/40 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 p-8 rounded-3xl hover:bg-[#1a1f3a]/60 light:hover:bg-white transition-all hover:-translate-y-2 group shadow-sm"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon size={28}className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white light:text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-400 light:text-gray-600 leading-relaxed">{feature.desc}</p>
                  </Link>
                </motion.div>
              );
            })}
          </section>
          {}
          <motion.section
            initial={{opacity:0}}
            whileInView={{opacity:1}}
            viewport={{once:true,margin:"-50px" }}
            transition={{delay:0.2}}
            className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 light:from-blue-50 light:to-purple-50 border border-white/10 light:border-gray-200 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm"
          >
            <div>
              <h2 className="text-3xl font-bold text-white light:text-gray-900 mb-2 flex items-center gap-3">
                <ShieldCheck className="text-green-400 light:text-green-500" size={32}/>
                Secure & Private
              </h2>
              <p className="text-gray-400 light:text-gray-600">All scans are processed locally or securely encrypted.</p>
            </div>
            <div className="flex gap-8 text-center">
              <div>
                <div className="text-4xl font-black text-white light:text-gray-900">99.9%</div>
                <div className="text-sm text-gray-400 light:text-gray-500 uppercase tracking-wider mt-1">Uptime</div>
              </div>
              <div>
                <div className="text-4xl font-black text-white light:text-gray-900">4</div>
                <div className="text-sm text-gray-400 light:text-gray-500 uppercase tracking-wider mt-1">Core Categories</div>
              </div>
              <div>
                <div className="text-4xl font-black text-white light:text-gray-900">&lt;1s</div>
                <div className="text-sm text-gray-400 light:text-gray-500 uppercase tracking-wider mt-1">Latency</div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
}

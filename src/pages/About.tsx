import{motion}from "motion/react";
import{Info,Cpu,Leaf,ShieldCheck,Github,Globe,PlayCircle}from "lucide-react";
export default function About(){
  const techStack=[
    {name:"React",icon:Globe,color:"text-blue-400" },
    {name:"Tailwind CSS",icon:Globe,color:"text-cyan-400" },
    {name:"Express.js",icon:Cpu,color:"text-green-400" },
    {name:"SQLite",icon:Cpu,color:"text-blue-300" },
    {name:"Framer Motion",icon:Globe,color:"text-purple-400" },
    {name:"Recharts",icon:BarChartIcon,color:"text-orange-400" },
  ];
  return(
    <>
      <div className="fixed inset-0 -z-10 bg-transparent overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 light:bg-blue-400/20 rounded-full blur-[120px]" />
      </div>
      <div className="max-w-4xl mx-auto space-y-12 pb-12 relative z-10">
        {}
        <div className="text-center space-y-4">
          <motion.div
            initial={{scale:0}}
            animate={{scale:1}}
            className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)] light:shadow-sm"
          >
            <Leaf size={40}className="text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-400 to-amber-600 light:from-orange-500 light:to-amber-700 bg-clip-text text-transparent">
            About PrakritiX
          </h1>
          <p className="text-xl text-gray-400 light:text-gray-600 max-w-2xl mx-auto">
            Revolutionizing waste management through artificial intelligence and smart hardware integration.
          </p>
        </div>
        {}
        <motion.section
          initial={{opacity:0,y:20}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true,margin:"-50px" }}
          className="bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-8 md:p-12 shadow-[0_0_30px_rgba(0,0,0,0.3)] light:shadow-sm"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white light:text-gray-900">
            <Info className="text-blue-400 light:text-blue-500" />
            Our Mission
          </h2>
          <div className="space-y-4 text-gray-300 light:text-gray-700 leading-relaxed text-lg">
            <p>
              PrakritiX was built with a singular goal:to make recycling accurate,effortless,and measurable.
              By combining computer vision with smart bin technology,we eliminate the confusion of waste sorting.
            </p>
            <p>
              Improper recycling leads to contaminated waste streams,sending otherwise recyclable materials to landfills.
              Our system ensures that every item ends up in the correct bin,maximizing recycling efficiency and minimizing environmental impact.
            </p>
          </div>
        </motion.section>
        {}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step:"01",
              title:"Scan",
              desc:"Hold the item in front of the camera. Our AI model instantly analyzes the object.",
              icon:CameraIcon,
              color:"from-blue-500 to-cyan-400"
            },
            {
              step:"02",
              title:"Classify",
              desc:"The system determines the correct category (Degradable, Non-Degradable, Metal, Hazardous).",
              icon:Cpu,
              color:"from-purple-500 to-pink-400"
            },
            {
              step:"03",
              title:"Sort",
              desc:"The smart bin automatically opens the correct compartment for disposal.",
              icon:TrashIcon,
              color:"from-green-500 to-emerald-400"
            }
          ].map((item,idx)=>(
            <motion.div
              key={idx}
              initial={{opacity:0,y:20}}
              whileInView={{opacity:1,y:0}}
              viewport={{once:true,margin:"-50px" }}
              transition={{delay:idx*0.1}}
              className="bg-[#1a1f3a]/40 light:bg-white/80 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-3xl p-8 relative overflow-hidden group shadow-sm flex flex-col items-center text-center"
            >
              <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <item.icon size={28}className="text-white" />
              </div>
              <h3 className="relative z-10 text-2xl font-bold text-white light:text-gray-900 mb-4">{item.title}</h3>
              <p className="relative z-10 text-gray-400 light:text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
        {}
        <motion.section
          initial={{opacity:0,y:20}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true,margin:"-50px" }}
          transition={{delay:0.2}}
          className="pt-8"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white light:text-gray-900 mb-4 flex items-center justify-center gap-3">
              <ShieldCheck className="text-green-400" size={32}/>
              Meet the Makers
            </h2>
            <p className="text-gray-400 light:text-gray-600">The innovative minds behind PrakritiX.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {name:"Saksham Shreyans",role:"Team Leader",image:"/saksham.jpeg",color:"from-blue-500/20 to-cyan-500/20",border:"border-blue-500/30" },
              {name:"Deepanwita Khaskel",role:"Developer",image:"/deepanwita.jpeg",color:"from-purple-500/20 to-pink-500/20",border:"border-purple-500/30" },
              {name:"Aryan Gupta",role:"Developer",image:"/aryan.jpeg",color:"from-green-500/20 to-emerald-500/20",border:"border-green-500/30" },
              {name:"Aratrik Biswas",role:"Developer",image:"/aratrik.jpeg",color:"from-orange-500/20 to-yellow-500/20",border:"border-orange-500/30" },
            ].map((member,idx)=>(
              <motion.div
                key={idx}
                initial={{opacity:0,scale:0.9}}
                whileInView={{opacity:1,scale:1}}
                viewport={{once:true,margin:"-50px" }}
                transition={{delay:0.3+(idx*0.1)}}
                className="group relative h-full"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${member.color} rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100 z-0`}/>
                <div className={`relative z-10 h-full bg-[#1a1f3a]/60 light:bg-white/80 backdrop-blur-2xl border ${member.border} light:border-gray-200 rounded-3xl p-10 flex flex-col items-center text-center shadow-lg hover:-translate-y-2 transition-transform duration-300`}>
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-[3px] border-white/20 light:border-gray-300 shadow-inner bg-[#0a0e27]/80 flex items-center justify-center shrink-0">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e)=>{
                        (e.target as HTMLImageElement).src=`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff&size=200`;
                      }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white light:text-gray-900 mb-2 flex-1 flex items-center">{member.name}</h3>
                  <div className={`mt-auto text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-white/5 border border-white/10 ${member.role === 'Team Leader' ? 'text-amber-400 border-amber-400/30 bg-amber-400/10' : 'text-gray-400'}`}>
                    {member.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
        {}
        <motion.section
          initial={{opacity:0,y:20}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true,margin:"-50px" }}
          transition={{delay:0.3}}
          className="bg-gradient-to-br from-[#0a0e27] to-[#1a1f3a] light:from-gray-50 light:to-gray-100 border border-white/10 light:border-gray-200 rounded-3xl p-8 md:p-12 text-center shadow-sm"
        >
          <h2 className="text-2xl font-bold mb-8 text-white light:text-gray-900 z-10 relative">Powered By</h2>
          <div className="relative w-full max-w-4xl mx-auto overflow-hidden custom-mask-image">
            <div className="flex w-[200%] animate-marquee hover:[animation-play-state:paused] pointer-events-auto">
              {}
              <div className="flex w-1/2 justify-around items-center">
                {techStack.map((tech,idx)=>{
                  const Icon=tech.icon;
                  return(
                    <div key={`set1-${idx}`}className="flex flex-col items-center justify-center p-4 group hover:scale-110 transition-transform cursor-default">
                      <div className="flex flex-col items-center gap-3">
                        <Icon size={48}className={tech.color}/>
                        <span className="font-bold text-sm text-center text-gray-300 light:text-gray-700">{tech.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {}
              <div className="flex w-1/2 justify-around items-center">
                {techStack.map((tech,idx)=>{
                  const Icon=tech.icon;
                  return(
                    <div key={`set2-${idx}`}className="flex flex-col items-center justify-center p-4 group hover:scale-110 transition-transform cursor-default">
                      <div className="flex flex-col items-center gap-3">
                        <Icon size={48}className={tech.color}/>
                        <span className="font-bold text-sm text-center text-gray-300 light:text-gray-700">{tech.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {}
            <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#0a0e27] light:from-gray-50 to-transparent pointer-events-none z-10" />
            <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#131731] light:from-gray-100 to-transparent pointer-events-none z-10" />
          </div>
        </motion.section>
      </div>
    </>
  );
}
function CameraIcon(props:any){
  return(
    <svg{...props}xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}
function TrashIcon(props:any){
  return(
    <svg{...props}xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
function BarChartIcon(props:any){
  return(
    <svg{...props}xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

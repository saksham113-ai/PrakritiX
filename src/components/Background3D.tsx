import React,{useRef,useMemo}from 'react';
import{Canvas,useFrame}from '@react-three/fiber';
import{EffectComposer,Bloom}from '@react-three/postprocessing';
import*as THREE from 'three';
import{useTheme}from '../context/ThemeContext';
const PARTICLE_COUNT=150;
function EcoParticles({isLightMode}:{isLightMode:boolean}){
  const meshRef=useRef<THREE.InstancedMesh>(null);
  const{positions,velocities,colors,rotations,rotVelocities}=useMemo(()=>{
    const positions=new Float32Array(PARTICLE_COUNT*3);
    const colors=new Float32Array(PARTICLE_COUNT*3);
    const velocities=[];
    const rotations=new Float32Array(PARTICLE_COUNT*3);
    const rotVelocities=[];
    const palette=[
      new THREE.Color('#34d399'),
      new THREE.Color('#a3e635'),
      new THREE.Color('#4ade80'),
      new THREE.Color('#fbbf24'),
      new THREE.Color('#60a5fa'),
    ];
    for(let i=0;i<PARTICLE_COUNT;i++){
      positions[i*3]=(Math.random()-0.5)*40;
      positions[i*3+1]=(Math.random()-0.5)*40;
      positions[i*3+2]=(Math.random()-0.5)*20-5;
      const color=palette[Math.floor(Math.random()*palette.length)];
      colors[i*3]=color.r;
      colors[i*3+1]=color.g;
      colors[i*3+2]=color.b;
      velocities.push(new THREE.Vector3(
        (Math.random()-0.5)*0.015,
        Math.random()*0.02+0.005,
        (Math.random()-0.5)*0.015
      ));
      rotations[i*3]=Math.random()*Math.PI;
      rotations[i*3+1]=Math.random()*Math.PI;
      rotations[i*3+2]=Math.random()*Math.PI;
      rotVelocities.push(new THREE.Vector3(
        (Math.random()-0.5)*0.02,
        (Math.random()-0.5)*0.02,
        (Math.random()-0.5)*0.02
      ));
    }
    return{positions,velocities,colors,rotations,rotVelocities};
  },[]);
  const dummy=useMemo(()=>new THREE.Object3D(),[]);
  useFrame((state)=>{
    if(!meshRef.current)return;
    for(let i=0;i<PARTICLE_COUNT;i++){
      positions[i*3]+=velocities[i].x+Math.sin(state.clock.elapsedTime*0.5+i)*0.005;
      positions[i*3+1]+=velocities[i].y;
      positions[i*3+2]+=velocities[i].z;
      if(positions[i*3+1]>20)positions[i*3+1]=-20;
      if(positions[i*3]>20)positions[i*3]=-20;
      if(positions[i*3]<-20)positions[i*3]=20;
      rotations[i*3]+=rotVelocities[i].x;
      rotations[i*3+1]+=rotVelocities[i].y;
      rotations[i*3+2]+=rotVelocities[i].z;
      dummy.position.set(positions[i*3],positions[i*3+1],positions[i*3+2]);
      dummy.rotation.set(rotations[i*3],rotations[i*3+1],rotations[i*3+2]);
      const scale=0.5+Math.sin(positions[i*3+1]*0.5+i)*0.2;
      dummy.scale.set(scale,scale,scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i,dummy.matrix);
      const baseColor=new THREE.Color(colors[i*3],colors[i*3+1],colors[i*3+2]);
      if(isLightMode){
        meshRef.current.setColorAt(i,baseColor.multiplyScalar(0.7));
      }else{
        const glow=(Math.sin(state.clock.elapsedTime*2+i)+1)*0.5;
        meshRef.current.setColorAt(i,baseColor.multiplyScalar(0.8+glow*0.6));
      }
    }
    meshRef.current.instanceMatrix.needsUpdate=true;
    if(meshRef.current.instanceColor)meshRef.current.instanceColor.needsUpdate=true;
  });
  return(
    <instancedMesh ref={meshRef}args={[null as any,null as any,PARTICLE_COUNT]}>
      {}
      <dodecahedronGeometry args={[0.3,0]}/>
      <meshStandardMaterial
        vertexColors={false}
        transparent
        opacity={isLightMode ? 0.4:0.8}
        roughness={0.3}
        metalness={0.1}
      />
    </instancedMesh>
  );
}
export default function Background3D(){
  const{theme}=useTheme();
  const isLightMode=theme==='light';
  return(
    <div className={`fixed inset-0 -z-10 transition-colors duration-1000 ${isLightMode ? 'bg-[#f4fbf7]' : 'bg-[#06140d]'}`}>
      <Canvas camera={{position:[0,0,15],fov:60}}>
        {}
        <color attach="background" args={[isLightMode ? '#f4fbf7' :'#06140d']}/>
        {}
        <ambientLight intensity={isLightMode ? 1.0:0.1}/>
        <directionalLight position={[10,20,10]}intensity={isLightMode ? 1.5:0.3}color="#ffffff" />
        {}
        <pointLight position={[-10,5,-10]}intensity={isLightMode ? 0.3:1.5}color="#4ade80" />
        <pointLight position={[5,-10,5]}intensity={isLightMode ? 0:1.0}color="#3b82f6" />
        <pointLight position={[0,10,-5]}intensity={isLightMode ? 0:0.5}color="#fbbf24" />
        <EcoParticles isLightMode={isLightMode}/>
        {!isLightMode &&(
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              intensity={2.5}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}

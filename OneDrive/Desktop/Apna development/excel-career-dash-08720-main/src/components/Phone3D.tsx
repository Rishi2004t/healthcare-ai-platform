import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, PresentationControls, ContactShadows, Html, Center, Bounds } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/models/iphone.glb';

class ErrorBoundary extends React.Component<{ children: React.ReactNode, fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any) { console.error("3D Model Error:", error); }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function RotatingModel({ url, scale, children }: any) {
  const { scene } = useGLTF(url) as any;
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Very smooth continuous auto-rotation on Y-axis
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={groupRef} scale={scale} position={[0, -1.2, 0]}>
      {/* Center component ensures the model's geometric center is at the group origin */}
      <Center>
        {/* Orientation fix: -Math.PI/2 on X-axis makes the model stand upright */}
        <primitive object={scene} rotation={[-Math.PI / 2, 0, 0]} />
      </Center>
      
      {children && (
        <Html
          transform
          position={[0, 1.28, 0.1]} // Perfectly aligned with the screen in portrait mode
          distanceFactor={1.14}
          portal={undefined}
          style={{
            width: "375px",
            height: "812px",
            background: "#000",
            borderRadius: "44px",
            overflow: "hidden",
            pointerEvents: "auto",
            boxShadow: "0 0 30px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="w-full h-full relative pointer-events-auto flex flex-col bg-background">
            {children}
            {/* Real device bezel effect */}
            <div className="absolute inset-0 pointer-events-none rounded-[44px] ring-1 ring-inset ring-white/10" />
            
            {/* Premium glass reflection overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-[44px] bg-gradient-to-tr from-white/10 via-transparent to-white/20 opacity-30 mix-blend-overlay" />
            
            {/* Dynamic Island / Speaker Area */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20 flex items-center justify-center opacity-90">
              <div className="w-1 h-1 bg-white/20 rounded-full mr-1" />
              <div className="w-8 h-1 bg-white/10 rounded-full" />
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Preload the model
useGLTF.preload(MODEL_PATH);

interface Phone3DProps {
  className?: string;
  cameraPosition?: [number, number, number];
  scale?: number;
  showIframe?: boolean;
  iframeUrl?: string;
  children?: React.ReactNode;
}

export const Phone3D: React.FC<Phone3DProps> = ({ 
  className = "w-full h-[600px]",
  cameraPosition = [0, 0, 5],
  scale = 1.2, // Slightly larger for better detail
  showIframe = false,
  iframeUrl = typeof window !== 'undefined' ? window.location.origin : '',
  children
}) => {
  const [mounted, setMounted] = useState(false);
  const [inIframe, setInIframe] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setInIframe(window.self !== window.top);
    } catch(e) {
      setInIframe(true);
    }
  }, []);

  if (!mounted) return null;

  if (inIframe && showIframe) {
    return (
      <div className={`flex items-center justify-center bg-muted/20 rounded-xl ${className}`}>
        <p className="text-sm text-muted-foreground">3D Preview Disabled (Iframe limit)</p>
      </div>
    );
  }

  const staticFallback = (
    <div className={`flex items-center justify-center bg-transparent ${className}`}>
      <div className="relative w-full max-w-[400px] aspect-[9/19] flex items-center justify-center">
        <img 
          src="/images/iphone_fallback.png" 
          alt="Phone Showcase" 
          className="w-full h-full object-contain drop-shadow-2xl opacity-80"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        {/* Simple overlay if 3D fails to load */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-black/40 backdrop-blur-[2px] rounded-[50px] m-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium text-white/80">Enhancing experience...</p>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={staticFallback}>
      <div className={`relative cursor-grab active:cursor-grabbing ${className}`}>
        <Canvas
          camera={{ position: cameraPosition, fov: 35 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          shadows
        >
          {/* Professional Minimalist Lighting */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Suspense fallback={<Html center>{staticFallback}</Html>}>
            <Environment preset="city" />
            
            <PresentationControls
              global
              config={{ mass: 2, tension: 500 }}
              snap={{ mass: 4, tension: 1500 }}
              rotation={[0, 0.4, 0]} // Initial front-angle view
              polar={[-0.1, 0.1]}   // Very restricted vertical tilt
              azimuth={[-0.4, 0.4]} // Restricted horizontal pan
            >
              <RotatingModel 
                url={MODEL_PATH} 
                scale={scale} 
                children={children}
              />
            </PresentationControls>

            {/* Premium Soft Shadow Below Device */}
            <ContactShadows 
              position={[0, -2.5, 0]} 
              opacity={0.4} 
              scale={12} 
              blur={2.8} 
              far={4.5} 
            />
          </Suspense>
        </Canvas>
      </div>
    </ErrorBoundary>
  );
};

import React, { useEffect, useRef, useState } from 'react';

interface Block {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  glow: number;
  hasData: boolean;
  dataProgress: number;
  validated: boolean;
  validationProgress: number;
  size: number;
  rotation: number;
  pulsePhase: number;
  transactions: number;
}

interface DataParticle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  fromBlock: number;
  toBlock: number;
  opacity: number;
  type: 'data' | 'validation' | 'transaction';
  speed: number;
  trail: { x: number; y: number }[];
}

interface NetworkNode {
  x: number;
  y: number;
  connections: number[];
  activity: number;
  pulsePhase: number;
}

const ArbitrumBlockchainAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const blocksRef = useRef<Block[]>([]);
  const dataParticlesRef = useRef<DataParticle[]>([]);
  const networkNodesRef = useRef<NetworkNode[]>([]);
  const lastTimeRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(true);

  // Enhanced Arbitrum brand colors
  const colors = {
    arbitrumBlue: '#28A0F0',
    arbitrumBlueGlow: '#28A0F0',
    arbitrumBlueDark: '#1E88D2',
    dataBlue: '#0052FF',
    dataBlueDark: '#003DB8',
    networkGreen: '#00D4AA',
    networkGreenDark: '#00B894',
    background: '#0B0E11',
    backgroundAlt: '#161A1E',
    blockBase: '#1E2329',
    blockActive: '#2B3139',
    connectionLine: '#2B3139',
    connectionActive: '#28A0F0',
    textPrimary: '#FAFAFA',
    textSecondary: '#B7BDC6'
  };

  // Rest of the component implementation remains the same but using colors.arbitrumBlue instead of colors.binanceYellow
  // ...

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Enhanced overlay elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top indicators */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-blue-400/80 font-medium">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
            <span>Arbitrum Sepolia</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-blue-400/70">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Layer 2 Validation</span>
          </div>
        </div>
        
        {/* Bottom indicators */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-green-400/80 font-medium">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <span>Fast Settlement</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400/60">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <span>L2 Rollup Network</span>
          </div>
        </div>
        
        {/* Performance metrics */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 text-right">
          <div className="text-xs text-blue-400/70">
            <span className="text-blue-400 font-mono font-bold">99.9%</span> Uptime
          </div>
          <div className="text-xs text-green-400/70">
            <span className="text-green-400 font-mono font-bold">&lt;1s</span> Settlement
          </div>
          <div className="text-xs text-blue-400/70">
            <span className="text-blue-400 font-mono font-bold">10K+</span> TPS
          </div>
        </div>
        
        {/* Security indicator */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 text-xs text-blue-400/60">
          <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 1L5 4v6c0 5.55 3.84 10.74 9.09 12 .93-.22 1.91-.71 2.91-1.49V4l-5-3z" clipRule="evenodd" />
          </svg>
          <span>L2 Security</span>
        </div>
      </div>
    </div>
  );
};

export default ArbitrumBlockchainAnimation;

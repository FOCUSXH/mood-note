import React, { useEffect, useRef } from 'react';

interface SakuraEffectProps {
  active: boolean;
}

const SakuraEffect: React.FC<SakuraEffectProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const sakuraListRef = useRef<any[]>([]);
  const stopRef = useRef<number | null>(null);
  const staticxRef = useRef<boolean>(false);

  // 樱花数量
  const sakuraNum = 50; // 增加数量使效果更明显
  // 樱花越界限制次数, -1不做限制,无限循环
  const limitTimes = -1; // 设置为不限制，让樱花一直飘落
  // 定义限制数组
  const limitArray = useRef<number[]>([]);

  console.log('SakuraEffect active state:', active);

  // 初始化限制数组
  useEffect(() => {
    for (let index = 0; index < sakuraNum; index++) {
      limitArray.current[index] = limitTimes;
    }
  }, []);

  // 樱花类
  class Sakura {
    x: number;
    y: number;
    s: number;
    r: number;
    fn: { x: (x: number, y: number) => number; y: (x: number, y: number) => number; r: (r: number) => number };
    idx: number;
    
    constructor(x: number, y: number, s: number, r: number, fn: any, idx: number) {
      this.x = x;
      this.y = y;
      this.s = s;
      this.r = r;
      this.fn = fn;
      this.idx = idx;
    }

    draw(cxt: CanvasRenderingContext2D, img: HTMLImageElement) {
      cxt.save();
      const xc = 40 * this.s / 4;
      cxt.translate(this.x, this.y);
      cxt.rotate(this.r);
      cxt.drawImage(img, 0, 0, 40 * this.s, 40 * this.s);
      cxt.restore();
    }

    update() {
      this.x = this.fn.x(this.x, this.y);
      this.y = this.fn.y(this.y, this.y);
      this.r = this.fn.r(this.r);

      // 如果樱花越界, 重新调整位置
      if (this.x > window.innerWidth || this.x < 0 ||
        this.y > window.innerHeight || this.y < 0) {

        // 如果樱花不做限制
        if (limitArray.current[this.idx] === -1) {
          this.r = getRandom('fnr');
          if (Math.random() > 0.4) {
            this.x = getRandom('x');
            this.y = 0;
            this.s = getRandom('s');
            this.r = getRandom('r');
          } else {
            this.x = window.innerWidth;
            this.y = getRandom('y');
            this.s = getRandom('s');
            this.r = getRandom('r');
          }
        }
        // 否则樱花有限制
        else {
          if (limitArray.current[this.idx] > 0) {
            this.r = getRandom('fnr');
            if (Math.random() > 0.4) {
              this.x = getRandom('x');
              this.y = 0;
              this.s = getRandom('s');
              this.r = getRandom('r');
            } else {
              this.x = window.innerWidth;
              this.y = getRandom('y');
              this.s = getRandom('s');
              this.r = getRandom('r');
            }
            // 该越界的樱花限制数减一
            limitArray.current[this.idx]--;
          }
        }
      }
    }
  }

  // 位置随机策略
  function getRandom(option: string): any {
    let ret: any, random: number;
    switch (option) {
      case 'x':
        ret = Math.random() * window.innerWidth;
        break;
      case 'y':
        ret = Math.random() * window.innerHeight;
        break;
      case 's':
        ret = Math.random();
        break;
      case 'r':
        ret = Math.random() * 6;
        break;
      case 'fnx':
        random = -0.5 + Math.random() * 1;
        ret = function(x: number, y: number) {
          return x + 0.5 * random - 1.7;
        };
        break;
      case 'fny':
        random = 1.5 + Math.random() * 0.7;
        ret = function(x: number, y: number) {
          return y + random;
        };
        break;
      case 'fnr':
        random = Math.random() * 0.03;
        ret = function(r: number) {
          return r + random;
        };
        break;
      default:
        ret = 0;
    }
    return ret;
  }

  useEffect(() => {
    if (active) {
      startSakura();
    } else {
      stopSakura();
    }

    return () => {
      stopSakura();
    };
  }, [active]);

  const startSakura = () => {
    console.log('Starting sakura effect');
    // 先移除可能存在的旧canvas
    const existingCanvas = document.getElementById('canvas_sakura');
    if (existingCanvas) {
      document.body.removeChild(existingCanvas);
    }

    const requestAnimationFrame = window.requestAnimationFrame ||
      (window as any).mozRequestAnimationFrame ||
      (window as any).webkitRequestAnimationFrame ||
      (window as any).msRequestAnimationFrame ||
      (window as any).oRequestAnimationFrame;

    const canvas = document.createElement('canvas');
    canvas.id = 'canvas_sakura';
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const cxt = canvas.getContext('2d');
    if (!cxt) {
      console.error('Failed to get canvas context');
      return;
    }

    // 调整缩放以支持高DPI屏幕
    cxt.scale(window.devicePixelRatio, window.devicePixelRatio);

    staticxRef.current = true;

    // 创建樱花图片
    const img = new Image();
    // 使用Base64编码的樱花图片数据（简化版）
    img.src = 'data:image/png;base64,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';

    // 为了确保即使图片加载失败也能运行，使用一个备用绘制方法
    const drawSakura = (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, r: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(r);
      
      // 使用更自然的樱花粉色
      ctx.fillStyle = '#ffc0cb';
      ctx.strokeStyle = '#ff9aa2';
      ctx.lineWidth = 0.5 * s;
      
      // 绘制5个花瓣的樱花
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5;
        ctx.save();
        ctx.rotate(angle);
        
        // 绘制一个更自然的花瓣形状
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          15 * s, -5 * s,  // 控制点1
          12 * s, 10 * s,  // 控制点2
          0, 8 * s         // 终点
        );
        ctx.bezierCurveTo(
          -12 * s, 10 * s, // 控制点3
          -15 * s, -5 * s, // 控制点4
          0, 0             // 回到起点
        );
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      
      // 绘制花蕊
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(0, 0, 2 * s, 0, Math.PI * 2);
      ctx.fill();
      
      // 绘制花丝
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 1 * s;
      for (let i = 0; i < 10; i++) {
        const angle = (i * 2 * Math.PI) / 10;
        const length = 6 * s;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
        ctx.stroke();
        
        // 绘制花药
        ctx.fillStyle = '#8b4513';
        ctx.beginPath();
        ctx.arc(
          Math.cos(angle) * length,
          Math.sin(angle) * length,
          1.5 * s,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      
      ctx.restore();
    };

    // 初始化樱花
    sakuraListRef.current = [];
    for (let i = 0; i < sakuraNum; i++) {
      const randomX = getRandom('x');
      const randomY = getRandom('y');
      const randomR = getRandom('r');
      const randomS = getRandom('s');
      const randomFnx = getRandom('fnx');
      const randomFny = getRandom('fny');
      const randomFnR = getRandom('fnr');
      
      const sakura = new Sakura(randomX, randomY, randomS, randomR, {
        x: randomFnx,
        y: randomFny,
        r: randomFnR
      }, i);
      
      // 使用备用绘制方法立即绘制
      drawSakura(cxt, sakura.x, sakura.y, sakura.s, sakura.r);
      sakuraListRef.current.push(sakura);
    }

    const render = () => {
      if (!cxt || !canvas) return;
      
      cxt.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
      
      sakuraListRef.current.forEach(sakura => {
        sakura.update();
        // 使用备用绘制方法
        drawSakura(cxt, sakura.x, sakura.y, sakura.s, sakura.r);
      });
      
      stopRef.current = requestAnimationFrame(render);
    };
    
    render();
    console.log('Sakura effect initialized with', sakuraNum, 'petals');
  };

  const stopSakura = () => {
    console.log('Stopping sakura effect');
    
    if (stopRef.current) {
      cancelAnimationFrame(stopRef.current);
      stopRef.current = null;
    }
    
    const canvas = document.getElementById('canvas_sakura') as HTMLCanvasElement;
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
    
    canvasRef.current = null;
    sakuraListRef.current = [];
  };

  return null;
};

export default SakuraEffect;
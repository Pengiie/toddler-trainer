
import type p5Types from "p5";
import dynamic from 'next/dynamic';
//import Sketch from "react-p5"

const shapetracing = {
  score: 0,
  disabled: 0,
  prevMouse: {
    x: 0,
    y: 0,
  },
  currentShape: {
    type: "",
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0,
    pixels: new Array(500).fill(0).map(() => new Array(500).fill(0)),
    count: 0
  },
  drawing: new Array(500).fill(0).map(() => new Array(500).fill(0)),
  drawingCount: 0,
  correct: 0, 
  newShape: () => {
    const px = new Array(500).fill(0).map(() => new Array(500).fill(0));
    let count = 0;
    let x0 = 0;
    let y0 = 0;
    let x1 = 0;
    let y1 = 0;

    const type = ["square", "circle", "triangle"][Math.floor(Math.random() * 3)];
    if(type === "square") {
      const x = Math.floor(Math.random() * 300) + 20;
      const y = Math.floor(Math.random() * 300) + 20;
      const length = Math.floor(Math.random() * 100) + 50;
      
      for(let i = x; i < x + length; i++) {
        if(px[i][y] == 0)
          count++;
        if(px[i][y + length] == 0)
          count++;
        px[i][y] = 1;
        px[i][y + length] = 1;
       
      }
      for(let i = y; i < y + length; i++) {
        if(px[x][i] == 0)
          count++;
        if(px[x + length][i] == 0)
          count++;
        px[x][i] = 1;
        px[x + length][i] = 1;
      }

      x0 = x;
      y0 = y;
      x1 = x + length;
      y1 = y + length;
    } else if(type === "circle") {
      let x = Math.floor(Math.random() * 250) + 10;
      let y = Math.floor(Math.random() * 250) + 10;
      const radius = Math.floor(Math.random() * 50) + 50;
      x += radius;
      y += radius;
      for(let i = x - radius; i < x + radius; i++) {
        for(let j = y - radius; j < y + radius; j++) {
          if(Math.abs(Math.sqrt((i - x) * (i - x) + (j - y) * (j - y)) - radius) <= 0.65) {
            if(px[i][j] == 0)
              count++;
            px[i][j] = 1;
          }
        }
      }
      x0 = x;
      y0 = y;
      x1 = radius;
    } else if(type === "triangle") {
      x0 = Math.floor(Math.random() * 250);
      y0 = Math.floor(Math.random() * 250) + 250;
      x1 = Math.floor(Math.random() * 250) + 250;
      y1 = Math.floor(Math.random() * 250);
      
      const lines = [
        {x0, y0, x1, y1: y0},
        {x0, y0, x1: x0 + (x1 - x0) / 2, y1: y1},
        {x0: x0 + (x1 - x0) / 2, y0: y1, x1, y1: y0}
      ]

      for(let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const distance = Math.sqrt((line.x1 - line.x0) ** 2 + (line.y1 - line.y0) ** 2);
        for(let j = 0; j < distance; j+= 0.5) {
          const x = Math.floor(line.x0 + (line.x1 - line.x0) * (j / distance));
          const y = Math.floor(line.y0 + (line.y1 - line.y0) * (j / distance));
          if(px[x][y] == 0) {
            count++;
          }
          px[x][y] = 1;
        }
      }
    }
    shapetracing.currentShape = {
      type,
      x0,
      y0,
      x1,
      y1,
      pixels: px,
      count
    };
    shapetracing.drawingCount = 0;
    shapetracing.correct = 0;
    shapetracing.drawing = new Array(500).fill(0).map(() => new Array(500).fill(0));
    shapetracing.disabled = 1000;
  },
  drawShape: (p5: p5Types) => {
    p5.background(0);
    p5.stroke(0, 255, 0);
    p5.strokeWeight(5);
    p5.noFill();
    if(shapetracing.currentShape.type === "square") {
      p5.rect(shapetracing.currentShape.x0, shapetracing.currentShape.y0, shapetracing.currentShape.x1 - shapetracing.currentShape.x0, shapetracing.currentShape.y1 - shapetracing.currentShape.y0);
    } else if(shapetracing.currentShape.type === "circle") {
      p5.circle(shapetracing.currentShape.x0, shapetracing.currentShape.y0, shapetracing.currentShape.x1 * 2);
    } else if(shapetracing.currentShape.type === "triangle") {
      p5.triangle(shapetracing.currentShape.x0, shapetracing.currentShape.y0, shapetracing.currentShape.x1, shapetracing.currentShape.y0, shapetracing.currentShape.x0 + (shapetracing.currentShape.x1-shapetracing.currentShape.x0) / 2, shapetracing.currentShape.y1);  
    }
  },
  sound: null
};

//const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), { ssr: false }); 


const ShapeTracing = () => {
  const Sketch = dynamic(() => import('react-p5').then((mod) => {
    require('p5/lib/addons/p5.sound');
    return mod.default;
  }), { ssr: false });

  const preload = (p5: p5Types & { loadSound: (s: string) => any}) => {
    shapetracing.sound = p5.loadSound('/ding.mp3');

  }

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(500, 500).parent(canvasParentRef);
    shapetracing.newShape();
    shapetracing.drawShape(p5);
  }
  
  const draw = (p5: p5Types) => {
    if(shapetracing.disabled > 0) {
      shapetracing.disabled -= p5.deltaTime;
      if(shapetracing.disabled <= 0) {
        shapetracing.disabled = 0;
      }
    }
    p5.stroke(0);
    p5.fill(255);
    p5.textSize(20);
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.text(`Score: ${shapetracing.score}`, 2, 2)
    p5.textAlign(p5.RIGHT, p5.TOP);
    p5.fill(0);
    p5.rect(p5.width - 202, 5, 202, 45);
    p5.fill(255);
    p5.text(`Completion: %${Math.floor((shapetracing.drawingCount / shapetracing.currentShape.count) * 100)}`, 498, 2);
    p5.text(`Grade: %${Math.floor(Math.min(shapetracing.correct / shapetracing.drawingCount || 0, 0.42) * (10/4.2) * 100)}`, 498, 22);
  
  
    p5.stroke(255, 0, 0);
    p5.strokeWeight(5);
    if(p5.mouseIsPressed && p5.mouseX > 0 && p5.mouseX < 500 && p5.mouseY > 0 && p5.mouseY < 500 && shapetracing.prevMouse.x > 0 && shapetracing.prevMouse.x < 500 && shapetracing.prevMouse.y > 0 && shapetracing.prevMouse.y < 500 && shapetracing.disabled == 0) {
      p5.line(shapetracing.prevMouse.x, shapetracing.prevMouse.y, p5.mouseX, p5.mouseY);
      const distance = Math.sqrt((p5.mouseX - shapetracing.prevMouse.x) ** 2 + (p5.mouseY - shapetracing.prevMouse.y) ** 2);
      for(let i = 0; i < distance; i+= 0.5) {
        const x = Math.floor(shapetracing.prevMouse.x + (p5.mouseX - shapetracing.prevMouse.x) * i / distance);
        const y = Math.floor(shapetracing.prevMouse.y + (p5.mouseY - shapetracing.prevMouse.y) * i / distance);
        if(shapetracing.drawing[x][y] == 0) {
          shapetracing.drawingCount++;
          if(shapetracing.currentShape.pixels[x][y] == 1 || shapetracing.currentShape.pixels[x+1][y] == 1 || shapetracing.currentShape.pixels[x-1][y] == 1 || shapetracing.currentShape.pixels[x][y+1] == 1 || shapetracing.currentShape.pixels[x][y-1] == 1) {
            console.log("correct");
            shapetracing.correct++;
          }
        }
        shapetracing.drawing[x][y] = 1;
      }
      if(shapetracing.drawingCount > shapetracing.currentShape.count) {
        console.log(shapetracing.correct / shapetracing.drawingCount);
        if(shapetracing.correct / shapetracing.drawingCount > 0.3) {
          shapetracing.score += 1;
          (shapetracing.sound as unknown as { play: () => void }).play();
        }
        shapetracing.newShape();
        shapetracing.drawShape(p5);
      }
    }
    shapetracing.prevMouse.x = p5.mouseX;
    shapetracing.prevMouse.y = p5.mouseY;
  }

  return <Sketch preload={preload as (p5: p5Types) => void }  setup={setup} draw={draw} />;
}

export default ShapeTracing;
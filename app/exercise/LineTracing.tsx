
import type p5Types from "p5";
import dynamic from 'next/dynamic';
//import Sketch from "react-p5"

const linetracing = {
  score: 0,
  disabled: 0,
  prevMouse: {
    x: 0,
    y: 0,
  },
  currentLine: {
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
  newLine: () => {
    const x0 = Math.floor(Math.random() * 250);
    const y0 = Math.floor(Math.random() * 250) + 250;
    const x1 = Math.floor(Math.random() * 250) + 250;
    const y1 = Math.floor(Math.random() * 250);

    const distance = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
    
    const px = new Array(500).fill(0).map(() => new Array(500).fill(0));
    let count = 0;
    for(let i = 0; i < distance; i+= 0.5) {
      const x = Math.floor(x0 + (x1 - x0) * (i / distance));
      const y = Math.floor(y0 + (y1 - y0) * (i / distance));
      if(px[x][y] == 0) {
        count++;
      }
      px[x][y] = 1;
    }

    linetracing.currentLine = {
      x0,
      y0,
      x1,
      y1,
      pixels: px,
      count
    };
    linetracing.drawingCount = 0;
    linetracing.correct = 0;
    linetracing.drawing = new Array(500).fill(0).map(() => new Array(500).fill(0));
    linetracing.disabled = 1000;
  }
};

//const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), { ssr: false }); 


const LineTracing = () => {
  const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), { ssr: false });

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(500, 500).parent(canvasParentRef);
    linetracing.newLine();
    p5.background(0);
    p5.stroke(0, 255, 0);
    p5.strokeWeight(5);
    p5.line(linetracing.currentLine.x0, linetracing.currentLine.y0, linetracing.currentLine.x1, linetracing.currentLine.y1);
  }
  
  const draw = (p5: p5Types) => {
    if(linetracing.disabled > 0) {
      linetracing.disabled -= p5.deltaTime;
      if(linetracing.disabled <= 0) {
        linetracing.disabled = 0;
      }
    }
    p5.stroke(0);
    p5.fill(255);
    p5.textSize(20);
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.text(`Score: ${linetracing.score}`, 0, 0)
  
    p5.stroke(255, 0, 0);
    if(p5.mouseIsPressed && p5.mouseX > 0 && p5.mouseX < 500 && p5.mouseY > 0 && p5.mouseY < 500 && linetracing.disabled == 0) {
      p5.line(linetracing.prevMouse.x, linetracing.prevMouse.y, p5.mouseX, p5.mouseY);
      const distance = Math.sqrt((p5.mouseX - linetracing.prevMouse.x) ** 2 + (p5.mouseY - linetracing.prevMouse.y) ** 2);
      for(let i = 0; i < distance; i+= 0.5) {
        const x = Math.floor(linetracing.prevMouse.x + (p5.mouseX - linetracing.prevMouse.x) * i / distance);
        const y = Math.floor(linetracing.prevMouse.y + (p5.mouseY - linetracing.prevMouse.y) * i / distance);
        if(linetracing.drawing[x][y] == 0) {
          linetracing.drawingCount++;
          if(linetracing.currentLine.pixels[x][y] == 1 || linetracing.currentLine.pixels[x+1][y] == 1 || linetracing.currentLine.pixels[x-1][y] == 1 || linetracing.currentLine.pixels[x][y+1] == 1 || linetracing.currentLine.pixels[x][y-1] == 1) {
            console.log("correct");
            linetracing.correct++;
          }
        }
        linetracing.drawing[x][y] = 1;
      }
      if(linetracing.drawingCount > linetracing.currentLine.count) {
        console.log(linetracing.correct / linetracing.drawingCount);
        if(linetracing.correct / linetracing.drawingCount > 0.3)
          linetracing.score += 1;
        linetracing.newLine();
        p5.background(0);
        p5.stroke(0, 255, 0);
        p5.strokeWeight(5);
        p5.line(linetracing.currentLine.x0, linetracing.currentLine.y0, linetracing.currentLine.x1, linetracing.currentLine.y1);
      }
    }
    linetracing.prevMouse.x = p5.mouseX;
    linetracing.prevMouse.y = p5.mouseY;
  }

  return <Sketch setup={setup} draw={draw} />;
}

export default LineTracing;
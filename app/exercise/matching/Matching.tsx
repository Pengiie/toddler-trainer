
import type p5Types from "p5";
import dynamic from 'next/dynamic';

const matching = {
  score: 0,
  holes: {
    square: {
      x: 65,
      y: 50,
      size: 75,
      color: "red"
    },
    circle: {
      x: 50,
      y: 170,
      size: 75,
      color: "blue"
    },
    triangle: {
      x: 50,
      y: 300,
      size: 75,
      color: "green"
    }
  },
  currentShape: {
    type: "square",
    x: 0,
    y: 0,
    size: 75,
  },
  dragging: false,
  newShape: () => {
    const shapes = ["square", "circle", "triangle"];
    const type = shapes[Math.floor(Math.random() * shapes.length)];
    const x = 400 - Math.floor(Math.random() * 200);
    const y = 100 + Math.floor(Math.random() * 300);
    matching.currentShape = {
      type,
      x,
      y,
      size: 75,
    };
  }
};

//const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), { ssr: false }); 


const Matching = () => {
  const Sketch = dynamic(() => import('react-p5'), { ssr: false });

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(500, 500).parent(canvasParentRef);
    matching.newShape();
  }
  
  const mouseReleased = (p5: p5Types) => {
    const squareDistance = Math.sqrt(Math.pow(matching.currentShape.x - matching.holes.square.x, 2) + Math.pow(matching.currentShape.y - matching.holes.square.y, 2));
    const circleDistance = Math.sqrt(Math.pow(matching.currentShape.x - matching.holes.circle.x, 2) + Math.pow(matching.currentShape.y - matching.holes.circle.y, 2));
    const triangleDistance = Math.sqrt(Math.pow(matching.currentShape.x - matching.holes.triangle.x, 2) + Math.pow(matching.currentShape.y - matching.holes.triangle.y, 2));
  
    if(squareDistance < matching.holes.square.size / 2 && matching.currentShape.type === "square") {
      matching.score++;
      matching.newShape();
    } else if(circleDistance < matching.holes.circle.size / 2 && matching.currentShape.type === "circle") {
      matching.score++;
      matching.newShape();
    }
    else if(triangleDistance < matching.holes.triangle.size / 2 && matching.currentShape.type === "triangle") {
      matching.score++;
      matching.newShape();
    }
  }
  
  const draw = (p5: p5Types) => {
    if(p5.mouseX > matching.currentShape.x && p5.mouseX < matching.currentShape.x + matching.currentShape.size && p5.mouseY > matching.currentShape.y && p5.mouseY < matching.currentShape.y + matching.currentShape.size) {
      p5.cursor("pointer");
    } else {
      p5.cursor("unset");
    }
  
    if(p5.mouseIsPressed) {
      if(p5.mouseX > matching.currentShape.x && p5.mouseX < matching.currentShape.x + matching.currentShape.size && p5.mouseY > matching.currentShape.y && p5.mouseY < matching.currentShape.y + matching.currentShape.size) {
        matching.dragging = true;
      }
    } else {
      matching.dragging = false;
    }
  
    if(matching.dragging) {
      
      matching.currentShape.size = 100;
      matching.currentShape.x = p5.mouseX - matching.currentShape.size / 2;
      matching.currentShape.y = p5.mouseY - matching.currentShape.size / 2;
    } else {
      matching.currentShape.size = 75;
    }
  
    p5.clear();
    p5.background(0);
    p5.fill(255);
    p5.textSize(20);
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.text(`Score: ${matching.score}`, 0, 0)
  
    p5.fill(matching.holes.square.color);
    p5.rect(matching.holes.square.x, matching.holes.square.y, matching.holes.square.size, matching.holes.square.size);
  
    p5.fill(matching.holes.circle.color);
    p5.circle(matching.holes.circle.x + matching.holes.circle.size / 2, matching.holes.circle.y + matching.holes.circle.size / 2, matching.holes.circle.size);
  
    p5.fill(matching.holes.triangle.color);
    p5.triangle(matching.holes.triangle.x, matching.holes.triangle.y + matching.holes.triangle.size, matching.holes.triangle.x + matching.holes.triangle.size / 2, matching.holes.triangle.y, matching.holes.triangle.x + matching.holes.triangle.size, matching.holes.triangle.y + matching.holes.triangle.size);
  
    p5.fill("purple");
    if(matching.currentShape.type === "square") {
      p5.rect(matching.currentShape.x, matching.currentShape.y, matching.currentShape.size, matching.currentShape.size);
    } else if(matching.currentShape.type === "circle") {
      p5.circle(matching.currentShape.x + matching.currentShape.size / 2, matching.currentShape.y + matching.currentShape.size / 2, matching.currentShape.size);
    } else if(matching.currentShape.type === "triangle") {
      p5.triangle(matching.currentShape.x, matching.currentShape.y + matching.currentShape.size, matching.currentShape.x + matching.currentShape.size / 2, matching.currentShape.y, matching.currentShape.x + matching.currentShape.size, matching.currentShape.y + matching.currentShape.size);
    }
  }

  return <Sketch setup={setup} draw={draw} mouseReleased={mouseReleased}/>;
}

export default Matching;

import type p5Types from "p5";
import dynamic from 'next/dynamic';
//import Sketch from "react-p5"

const van = {
  score: 0,
  currentVan: {
    x: 0,
    y: 0,
  },
  currentKid: {
    x: 0,
    y: 0,
  },
  dragging: false,
  new: () => {
    van.currentVan = {
      x: Math.floor(Math.random() * 190) + 250,
      y: Math.floor(Math.random() * 400),
    };
    van.currentKid = {
      x: Math.floor(Math.random() * 200),
      y: Math.floor(Math.random() * 400),
    };
  },
  sound: null as any,
  kid: null as any,
  van: null as any
};

//const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), { ssr: false }); 


const Matching = () => {
  const Sketch = dynamic(() => import('react-p5').then((mod) => {
    require('p5/lib/addons/p5.sound');
    return mod.default;
  }), { ssr: false });

  const preload = (p5: p5Types & { loadSound: (s: string) => any}) => {
    van.sound = p5.loadSound('/ding.mp3');
    van.van = p5.loadImage('/van.png');
    van.kid = p5.loadImage('/kid.png');
  }

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(500, 500).parent(canvasParentRef);
    van.new();
  }
  
  const mouseReleased = (p5: p5Types) => {
    const distance = Math.sqrt(Math.pow(van.currentKid.x - van.currentVan.x, 2) + Math.pow(van.currentKid.y - van.currentVan.y, 2));
  
    if(distance < 50) {
      van.score++;
      (van.sound as unknown as { play: () => void }).play();
      van.new();
    }
  }
  
  const draw = (p5: p5Types) => {
    if(p5.mouseX > van.currentKid.x && p5.mouseX < van.currentKid.x + 50 && p5.mouseY > van.currentKid.y && p5.mouseY < van.currentKid.y + 50) {
      p5.cursor("pointer");
    } else {
      p5.cursor("unset");
    }
  
    if(p5.mouseIsPressed) {
      if(p5.mouseX > van.currentKid.x && p5.mouseX < van.currentKid.x + 50 && p5.mouseY > van.currentKid.y && p5.mouseY < van.currentKid.y + 50) {
        van.dragging = true;
      }
    } else {
      van.dragging = false;
    }

    if(van.dragging) {
      van.currentKid.x = p5.mouseX - 50 / 2;
      van.currentKid.y = p5.mouseY - 50 / 2;
    }

    p5.clear();
    p5.background(0);
    p5.fill(255);
    p5.textSize(20);
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.text(`Score: ${van.score}`, 0, 0)
  
    p5.image(van.van, van.currentVan.x, van.currentVan.y, 50, 50);
    p5.image(van.kid, van.currentKid.x, van.currentKid.y, 50, 50);
  }

  return <Sketch preload={preload as (p5: p5Types) => void } setup={setup} draw={draw} mouseReleased={mouseReleased}/>;
}

export default Matching;
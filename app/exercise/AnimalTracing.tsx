
import p5Types from "p5";
import dynamic from 'next/dynamic';

const ss = 50;
const ssize = 400;
const srat = ssize/512;

const animaltracing = {
  score: 0,
  disabled: 0,
  prevMouse: {
    x: 0,
    y: 0,
  },
  currentAnimal: {
    paths: [""],
    name: "",
    pixels: new Array(500).fill(0).map(() => new Array(500).fill(0)),
    count: 0
  },
  animals: [] as unknown as { paths: string[], name: string }[],
  drawing: new Array(500).fill(0).map(() => new Array(500).fill(0)),
  drawingCount: 0,
  correct: 0, 
  newAnimal: () => {
    const { paths, name } = animaltracing.animals[Math.floor(Math.random() * animaltracing.animals.length)];
    console.log(paths);

    const px = new Array(500).fill(0).map(() => new Array(500).fill(0));
    let count = 0;

    paths.forEach(path => {
      let pos = 0;
      let x = 0, y = 0;
      while(pos < path.length) {
        const match = path.substring(pos).match(/[mMLlHhVvCcSsQqTtAaz][^mMLlHhVvCcSsQqTtAaz]+/);
        if(!match) break;
        pos += match[0].length;
        const cmd = match[0];
        //console.log(cmd, x, y);
        if(cmd[0] === 'M') {
          const [x1, y1] = cmd.substring(1).match(/(-)?(\d|\.)+/g)!!.map(s => parseFloat(s) * srat + ss);
          x = x1
          y = y1
        } else if(cmd[0] === 'l') {
          const [x1, y1] = cmd.substring(1).match(/(-)?(\d|\.)+/g)!!.map(s => parseFloat(s) * srat);
        
          const distance = Math.sqrt(x1 ** 2 + y1 ** 2);
      
          for(let i = 0; i < distance; i+= 0.5) {
            const cx = Math.floor(x + x1 * (i / distance));
            const cy = Math.floor(y + y1 * (i / distance));
            if(px[cx][cy] == 0) {
              count++;
            }
            px[cx][cy] = 1;
          }

          x += x1;
          y += y1;
        } else if(cmd[0] === 'L') {
          const [x1, y1] = cmd.substring(1).match(/(-)?(\d|\.)+/g)!!.map(s => parseFloat(s) * srat + ss);
          
          const distance = Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
      
          for(let i = 0; i < distance; i+= 0.5) {
            const cx = Math.floor(x + (x1 - x) * (i / distance));
            const cy = Math.floor(y + (y1 - y) * (i / distance));
            if(px[cx][cy] == 0) {
              count++;
            }
            px[cx][cy] = 1;
          }

          x = x1;
          y = y1;
        } else if(cmd[0] === 'H') {
          const x1 = parseFloat(cmd.substring(1)) * srat + ss;
          
          for(let i = 0; i < Math.abs(x1 - x); i+= 0.5) {
            const cx = Math.floor(x + (x1 - x) * (i / Math.abs(x1 - x)));
            const cy = Math.floor(y);
            if(px[cx][cy] == 0) {
              count++;
            }
            px[cx][cy] = 1;
          }

          x = x1;
        } else if(cmd[0] === 'V') {
          const y1 = parseFloat(cmd.substring(1)) * srat + ss;
          
          for(let i = 0; i < Math.abs(y1 - y); i+= 0.5) {
            const cx = Math.floor(x);
            const cy = Math.floor(y + (y1 - y) * (i / Math.abs(y1 - y)));
            if(px[cx][cy] == 0) {
              count++;
            }
            px[cx][cy] = 1;
          }

          y = y1;
        } else if(cmd[0] === 'h') {
          const x1 = parseFloat(cmd.substring(1)) * srat;
          
          for(let i = 0; i < Math.abs(x1); i+= 0.5) {
            const cx = Math.floor(x + i * (x1 > 0 ? 1 : -1));
            const cy = Math.floor(y);
            if(px[cx][cy] == 0) {
              count++;
            }
            px[cx][cy] = 1;
          }

          x += x1;
        } else if(cmd[0] === 'v') {
          const y1 = parseFloat(cmd.substring(1)) * srat;
          
          for(let i = 0; i < Math.abs(y1); i+= 0.5) {
            const cx = Math.floor(x);
            const cy = Math.floor(y + (y1 > 0 ? 1 : -1) * i);
            if(px[cx][cy] == 0) {
              count++;
            }
            px[cx][cy] = 1;
          }

          y += y1;
        } else if(cmd[0] === 'c') {
          const [dx1, dy1, dx2, dy2, dx3, dy3] = cmd.substring(1).match(/(-)?(\d|\.)+/g)!!.map(s => parseFloat(s) * srat);
          
          const distance = Math.sqrt(dx3 ** 2 + dy3 ** 2);
          for(let t = 0; t < distance; t+= 0.5) {
            const normalizedT = t / distance;
            const cx = Math.floor((1 - normalizedT) ** 3 * x + 3 * (1 - normalizedT) ** 2 * normalizedT * (x+dx1) + 3 * (1 - normalizedT) * normalizedT ** 2 * (x+dx2) + normalizedT ** 3 * (x+dx3));
            const cy = Math.floor((1 - normalizedT) ** 3 * y + 3 * (1 - normalizedT) ** 2 * normalizedT * (y+dy1) + 3 * (1 - normalizedT) * normalizedT ** 2 * (y+dy2) + normalizedT ** 3 * (y+dy3));
            if(px[cx][cy] == 0) {
              count++;
            }
            px[cx][cy] = 1;
          }

          x += dx3;
          y += dy3;
        } else if(cmd[0] === 'C') {
          const [x1, y1, x2, y2, x3, y3] = cmd.substring(1).match(/(-)?(\d|\.)+/g)!!.map(s => parseFloat(s) * srat + ss);
          
          const distance = Math.sqrt((x3 - x) ** 2 + (y3 - y) ** 2);
          for(let t = 0; t < distance; t+= 0.5) {
            const normalizedT = t / distance;
            const cx = Math.floor((1 - normalizedT) ** 3 * x + 3 * (1 - normalizedT) ** 2 * normalizedT * x1 + 3 * (1 - normalizedT) * normalizedT ** 2 * x2 + normalizedT ** 3 * x3);
            const cy = Math.floor((1 - normalizedT) ** 3 * y + 3 * (1 - normalizedT) ** 2 * normalizedT * y1 + 3 * (1 - normalizedT) * normalizedT ** 2 * y2 + normalizedT ** 3 * y3);
            if(px[cx][cy] == 0) {
              count++;
            }
            px[cx][cy] = 1;
          }

          x = x3;
          y = y3;
        } else if(cmd[0] === 's') {
          const [dx2, dy2, dx3, dy3] = cmd.substring(1).match(/(-)?(\d|\.)+/g)!!.map(s => parseFloat(s) * srat);
          
          const distance = Math.sqrt(dx3 ** 2 + dy3 ** 2);
          for(let t = 0; t < distance; t+= 0.5) {
            const normalizedT = t / distance;
            const cx = Math.floor((1- normalizedT) ** 2 * x + 2 * (1 - normalizedT) * normalizedT * (x+dx2) + normalizedT ** 2 * (x+dx3));
            const cy = Math.floor((1- normalizedT) ** 2 * y + 2 * (1 - normalizedT) * normalizedT * (y+dy2) + normalizedT ** 2 * (y+dy3));
            if(px[cx][cy] == 0) {
              count++;
            }
            px[cx][cy] = 1;
          }

          x += dx3;
          y += dy3;
        } else if(cmd[0] === 'z') {
          break;
        }
      }
    });
    // let pos = 0;
    // let x = 0, y = 0;
    // while(pos < path.length) {
    //   const match = path.substring(pos).match(/^[mMLlHhVvCcSsQqTtAa][^mMLlHhVvCcSsQqTtAa]+/);
    //   if(!match) break;
    //   pos += match[0].length;
    //   const cmd = match[0];
    //   console.log(cmd);
    //   if(cmd[0] === 'M') {
    //     const [x1, y1] = cmd.substring(1).match(/(-)?\d+/)!!.map(s => parseFloat(s));
    //     x = x1;
    //     y = y1;
    //   } else if(cmd[0] === 'l') {
    //     const [x1, y1] = cmd.substring(1).match(/(-)?\d+/)!!.map(s => parseFloat(s));
        
    //     const distance = Math.sqrt(x1 ** 2 + y1 ** 2);
      
      
    //     for(let i = 0; i < distance; i+= 0.5) {
    //       const cx = Math.floor(x + x1  * (i / distance));
    //       const cy = Math.floor(y + y1 * (i / distance));
    //       if(px[cx][cy] == 0) {
    //         count++;
    //       }
    //       px[cx][cy] = 1;
    //     }

    //     x += x1;
    //     y += y1;
    //   } else if(cmd[0] === 'H') {
    //     const x1 = parseFloat(cmd.substring(1));
    //     const distance = Math.abs(x1 - x);
    //     for(let i = 0; i < distance; i+= 0.5) {
    //       const cx = Math.floor(x + (x1 - x) * (i / distance));
    //       const cy = Math.floor(y);
    //       if(px[cx][cy] == 0) {
    //         count++;
    //       }
    //       px[cx][cy] = 1;
    //     }
    //     x = x1;
    //   } else if(cmd[0] === 'V') {
    //     const y1 = parseFloat(cmd.substring(1));
    //     const distance = Math.abs(y1 - y);
    //     for(let i = 0; i < distance; i+= 0.5) {
    //       const cx = Math.floor(x);
    //       const cy = Math.floor(y + (y1 - y) * (i / distance));
    //       if(px[cx][cy] == 0) {
    //         count++;
    //       }
    //       px[cx][cy] = 1;
    //     }
    //     y = y1;
    //   } else if(cmd[0] === 'c') {
    //     const [dx1, dy1, dx2, dy2, dx3, dy3] = cmd.substring(1).match(/(-)?\d+/)!!.map(s => parseFloat(s));
    //     const distance = Math.sqrt(dx3 ** 2 + dy3 ** 2);
    //     for(let t = 0; t < distance; t+= 0.5) {
    //       const normalizedT = t / distance;
    //       const cx = Math.floor(x + ((1 - normalizedT) ** 2 * dx1 + 2 * (1 - normalizedT) * normalizedT * dx2 + normalizedT ** 2 * dx3));
    //       const cy = Math.floor(y + ((1 - normalizedT) ** 2 * dy1 + 2 * (1 - normalizedT) * normalizedT * dy2 + normalizedT ** 2 * dy3));
    //       if(px[cx][cy] == 0) {
    //         count++;
    //       }
    //       px[cx][cy] = 1;
    //     }
    //     x += dx3;
    //     y += dy3;
    //   }
    // }

    // new FileReader().
    // const animal = Math.floor(Math.random() * 4);
    // const x1 = Math.floor(Math.random() * 250) + 250;
    // const y1 = Math.floor(Math.random() * 250);

    

    animaltracing.currentAnimal = {
      paths,
      name,
      pixels: px,
      count
    };
    animaltracing.drawingCount = 0;
    animaltracing.correct = 0;
    animaltracing.drawing = new Array(500).fill(0).map(() => new Array(500).fill(0));
    animaltracing.disabled = 1000;
  },
  sound: null,
  setup: false
};

//const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), { ssr: false }); 

const AnimalTracing = () => {
  const Sketch = dynamic(() => import('react-p5').then((mod) => {
    require('p5/lib/addons/p5.sound');
    return mod.default;
  }), { ssr: false });

  const drawAnimal = (p5: p5Types) =>{
    console.log(srat);
    p5.background(0);
    p5.stroke(0, 255, 0);
    p5.strokeWeight(5);
    p5.noFill();

    animaltracing.newAnimal();
    console.log(`Drawing ${animaltracing.currentAnimal.name}`);
    
   
    const { paths } = animaltracing.currentAnimal;
    paths.forEach(path => {
      let pos = 0;
      let x = 0, y = 0;
      while(pos < path.length) {
        const match = path.substring(pos).match(/[mMLlHhVvCcSsQqTtAaz][^mMLlHhVvCcSsQqTtAaz]+/);
        if(!match) break;
        pos += match[0].length;
        const cmd = match[0];
        //console.log(cmd, x, y);
        if(cmd[0] === 'M') {
          const [x1, y1] = cmd.substring(1).match(/(-)?(\d|\.)+/g)!!.map(s => parseFloat(s) * srat + ss);
          x = x1
          y = y1
        } else if(cmd[0] === 'l') {
          const [x1, y1] = cmd.substring(1).match(/(-)?(\d|\.)+/g)!!.map(s => parseFloat(s) * srat);
          p5.line(x, y, x + x1, y + y1);

          x += x1;
          y += y1;
        } else if(cmd[0] === 'L') {
          const [x1, y1] = cmd.substring(1).match(/(-)?(\d|\.)+/g)!!.map(s => parseFloat(s) * srat + ss);
          p5.line(x, y, x1, y1);

          x = x1;
          y = y1;
        } else if(cmd[0] === 'H') {
          const x1 = parseFloat(cmd.substring(1)) * srat + ss;
          p5.line(x, y, x1, y);
          x = x1;
        } else if(cmd[0] === 'V') {
          const y1 = parseFloat(cmd.substring(1)) * srat + ss;
          p5.line(x, y, x, y1);
          y = y1;
        } else if(cmd[0] === 'h') {
          const x1 = parseFloat(cmd.substring(1)) * srat;
          p5.line(x, y, x + x1, y);
          x += x1;
        } else if(cmd[0] === 'v') {
          const y1 = parseFloat(cmd.substring(1)) * srat;
          p5.line(x, y, x, y + y1);
          y += y1;
        } else if(cmd[0] === 'c') {
          const [dx1, dy1, dx2, dy2, dx3, dy3] = cmd.substring(1).match(/(-)?(\d|\.)+/g)!!.map(s => parseFloat(s) * srat);
          p5.bezier(x, y, x + dx1, y + dy1, x + dx2, y + dy2, x + dx3, y + dy3);
          x += dx3;
          y += dy3;
        } else if(cmd[0] === 'C') {
          const [x1, y1, x2, y2, x3, y3] = cmd.substring(1).match(/(-)?(\d|\.)+/g)!!.map(s => parseFloat(s) * srat + ss);
          p5.bezier(x, y, x1, y1, x2, y2, x3, y3);
          x = x3;
          y = y3;
        } else if(cmd[0] === 's') {
          const [dx2, dy2, dx3, dy3] = cmd.substring(1).match(/(-)?(\d|\.)+/g)!!.map(s => parseFloat(s) * srat);
          p5.bezier(x, y, x + dx2, y + dy2, x + dx3, y + dy3, x + dx3, y + dy3);
          x += dx3;
          y += dy3;
        } else if(cmd[0] === 'z') {
          break;
        }
      }
    });

    p5.stroke(255, 0, 0);

    // animaltracing.currentAnimal.pixels.forEach((row, y) => {
    //   row.forEach((col, x) => {
    //     if(col === 1) {
    //       p5.point(y, x);
    //     }
    //   });
    // });
  }

  const preload = (p5: p5Types & { loadSound: (s: string) => any}) => {
    animaltracing.sound = p5.loadSound('/ding.mp3');
    const animals = ["bunny"];

    const promises = animals.map((animal) => {
      return fetch(`/animals/${animal}.svg`).then(async (res) => {
        const doc = new DOMParser().parseFromString(await res.text(), "text/xml");
        const paths = Array.from(doc.getElementsByTagName("path")).map((path) => path.getAttribute("d")!!);
        return {
          paths,
          name: animal
        }
      })
    })
    Promise.all(promises).then((animals) => {
      animaltracing.animals = animals;
    });
  }

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(500, 500).parent(canvasParentRef);
    p5.background(0);
    p5.stroke(0, 255, 0);
    p5.strokeWeight(5);
  }
  
  const draw = (p5: p5Types) => {
    if(animaltracing.disabled > 0) {
      animaltracing.disabled -= p5.deltaTime;
      if(animaltracing.disabled <= 0) {
        animaltracing.disabled = 0;
      }
    }
    p5.noFill();
    p5.stroke(0);
    p5.fill(255);
    p5.textSize(20);
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.text(`Score: ${animaltracing.score}`, 2, 2)
    p5.textAlign(p5.RIGHT, p5.TOP);
    p5.fill(0);
    p5.rect(p5.width - 202, 5, 202, 45);
    p5.fill(255);
    p5.text(`Completion: %${Math.floor((animaltracing.drawingCount / animaltracing.currentAnimal.count) * 100)}`, 498, 2);
    p5.text(`Grade: %${Math.floor(Math.min(animaltracing.correct / animaltracing.drawingCount || 0, 0.7) * (10/7) * 100)}`, 498, 22);
  
    p5.stroke(255, 0, 0);
    if(p5.mouseIsPressed && p5.mouseX > 0 && p5.mouseX < 500 && p5.mouseY > 0 && p5.mouseY < 500 && animaltracing.disabled == 0) {
      p5.line(animaltracing.prevMouse.x, animaltracing.prevMouse.y, p5.mouseX, p5.mouseY);
      const distance = Math.sqrt((p5.mouseX - animaltracing.prevMouse.x) ** 2 + (p5.mouseY - animaltracing.prevMouse.y) ** 2);
      for(let i = 0; i < distance; i+= 0.5) {
        const x = Math.floor(animaltracing.prevMouse.x + (p5.mouseX - animaltracing.prevMouse.x) * i / distance);
        const y = Math.floor(animaltracing.prevMouse.y + (p5.mouseY - animaltracing.prevMouse.y) * i / distance);
        if(animaltracing.drawing[x][y] == 0) {
          animaltracing.drawingCount++;
          if(animaltracing.currentAnimal.pixels[x][y] == 1 || animaltracing.currentAnimal.pixels[x+1][y] == 1 || animaltracing.currentAnimal.pixels[x-1][y] == 1 || animaltracing.currentAnimal.pixels[x][y+1] == 1 || animaltracing.currentAnimal.pixels[x][y-1] == 1) {
            console.log("correct");
            animaltracing.correct++;
          }
        }
        animaltracing.drawing[x][y] = 1;
      }
      if(animaltracing.drawingCount > animaltracing.currentAnimal.count) {
        console.log(animaltracing.correct / animaltracing.drawingCount);
        const score = animaltracing.correct / animaltracing.drawingCount;
        animaltracing.score += Math.floor(Math.min(score, 0.7) / 0.7 * 10);
        if(score > 0.4) {
          (animaltracing.sound as unknown as { play: () => void }).play();
        }
        p5.background(0);
        p5.stroke(0, 255, 0);
        p5.strokeWeight(5);
        drawAnimal(p5);
      }
    }
    animaltracing.prevMouse.x = p5.mouseX;
    animaltracing.prevMouse.y = p5.mouseY;
    if(!animaltracing.setup && animaltracing.animals) {
      drawAnimal(p5);
      animaltracing.setup = true;
    }
  }

  return <Sketch preload={preload as (p5: p5Types) => void } setup={setup} draw={draw} />;
}

export default AnimalTracing;
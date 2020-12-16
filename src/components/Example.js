import react, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

const divStyles = {
  width: '200px',
  backgroundColor: 'red',
  color: 'black',
};

export default function ColorSlides() {
  let imageList = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(Draggable);

    console.log(imageList.children);

    Draggable.create('.slides-container', {
      trigger: '.slides-inner',
      type: 'x',
      onClick: function () {
        console.log('clicked');
      },
      onPress: function () {
        //record the starting values so we can compare them later...
        startX = this.x;
      },
      onDrag: function () {
        let totalChange = this.x + startX,
          direction = [];
        if (totalChange > startX) {
          direction.push('right');
        } else if (totalChange < startX) {
          direction.push('left');
        }
        console.log(direction);
      },
    });
  }, [imageList]);

  // const proxy = document.createElement('div');

  let startX;

  return (
    <>
      <main style={{ height: '100%' }}>
        <div
          style={{
            width: '200px',
            height: '500px',
          }}
          className="slides-container"
        >
          <div
            style={{ marginLeft: '400px', width: '200px', height: '1000px' }}
            ref={(el) => (imageList = el)}
            className="slides-inner"
          >
            <div style={divStyles} className="slide">
              1
            </div>
            <div style={divStyles} className="slide">
              2
            </div>
            <div style={divStyles} className="slide">
              3
            </div>
            <div style={divStyles} className="slide">
              4
            </div>
            <div style={divStyles} className="slide">
              5
            </div>
            <div style={divStyles} className="slide">
              6
            </div>
            <div style={divStyles} className="slide">
              7
            </div>
            <div style={divStyles} className="slide">
              8
            </div>
            <div style={divStyles} className="slide">
              9
            </div>
            <div style={divStyles} className="slide">
              10
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

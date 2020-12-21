import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
} from 'react';
import { gsap, TweenLite, Power3 } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import './ImageSlider.css';

// Helper function to implement ref for <ul> containing images
function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useCallback((node) => {
    if (node !== null) {
      setRect(node.children);
    }
  }, []);
  return [rect, ref];
}

export default function ImageSlider() {
  const [rect, ref] = useClientRect();

  let [active, setActive] = useState('0');
  console.log(active);

  const [viewPort, setViewPort] = useState(590);

  const [size, setSize] = useState([0, 0]);

  // Update dimensions on image on resize
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.visualViewport, window.visualViewport]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(Draggable, TweenLite);
    console.log(rect);

    if (window.visualViewport.width >= 590) {
      setViewPort(590);
    } else if (window.visualViewport.width < 590) {
      setViewPort(size);
    }
  }, [rect, size]);

  // Left direction equals -1 and right direction equals 1
  //Image transition functions
  // const slide = (index, duration, multiplied = 1, direction) => {
  //   TweenLite.to(rect[index], duration, {
  //     x: direction * multiplied,
  //     ease: Power3.easeOut,
  //   });
  // };

  const slideLeft = (index, duration, multiplied = 1) => {
    TweenLite.to(rect[index], duration, {
      x: -viewPort * multiplied,
      ease: Power3.easeOut,
    });
  };

  const slideRight = (index, duration, multiplied = 1) => {
    TweenLite.to(rect[index], duration, {
      x: viewPort * multiplied,
      ease: Power3.easeOut,
    });
  };

  const nextSlide = () => {
    if (rect[0].id === '0') {
      setActive('1');

      //Image transition
      slideLeft(0, 1);
      slideLeft(1, 1);
      slideLeft(2, 1);
      slideLeft(2, 0);
      slideLeft(3, 1);
      slideLeft(3, 0);
    } else if (rect[1].id === '1') {
      setActive('2');
      //Image transition
      slideRight(0, 1, 2);
      slideLeft(1, 1, 2);
      slideLeft(2, 1, 2);
      slideLeft(3, 1, 2);
      slideLeft(3, 0, 2);
    } else if (rect[2].id === '2') {
      setActive('3');
      //Image transition
      slideRight(1, 1);
      slideLeft(2, 1, 3);
      slideLeft(3, 1, 3);
      slideRight(0, 0, 1);
    } else if (rect[3].id === '3') {
      setActive('0');
      // Image transition
      slideRight(3, 0, 3);
      slideLeft(0, 1, 0);
      slideLeft(1, 0, 0);
      slideLeft(2, 0, 0);
    }
  };

  const prevSlide = () => {
    if (rect[0].id === '0') {
      setActive('3');
      //Image transition
      slideLeft(3, 0, 4);
      slideLeft(3, 1, 3);
      slideLeft(2, 0, 3);
      slideRight(0, 1);
      slideRight(1, 1);
    } else if (rect[1].id === '1') {
      setActive('0');
      //Image transition
      slideLeft(1, 0, 2);
      slideRight(0, 1, 0);
      slideRight(2, 1, 1);
      slideRight(3, 1, 1);
    } else if (rect[2].id === '2') {
      setActive('1');
      slideLeft(2, 1);
      slideLeft(1, 0, 2);
      slideLeft(1, 1);
      slideLeft(0, 0, 4);
    } else if (rect[3].id === '3') {
      setActive('2');
      slideRight(3, 1, 4);
      slideLeft(2, 1, 2);
      slideLeft(1, 0, 0);
      slideLeft(1, 1, 0);
      slideLeft(0, 0, 0);
    }
  };

  return (
    <div className="container">
      <main>
        <Query
          query={gql`
            {
              mediaItems {
                edges {
                  node {
                    id
                    caption
                    mediaItemUrl
                    altText
                  }
                }
              }
            }
          `}
        >
          {(data, error) => {
            if (!data.data) {
              return <h1>Loading...</h1>;
            }

            let startX;
            // Indicate if image is moving left or right
            let globalDirection;

            Draggable.create('.list-item', {
              trigger: '#product-image',
              type: 'x',
              onPress: function () {
                //record the starting values so we can compare them later...
                startX = this.x;
              },
              onDrag: function () {
                let currentX = this.x,
                  direction = [];
                if (currentX > startX) {
                  globalDirection = direction[0] = 'right';
                } else if (currentX < startX) {
                  globalDirection = direction[0] = 'left';
                }
              },
              onDragEnd: function () {
                if (globalDirection === 'right') {
                  prevSlide();
                } else if (globalDirection === 'left') {
                  nextSlide();
                }
              },
            });

            return (
              <>
                <main>
                  <div>
                    <div>
                      <div id="image-container" className="image-container">
                        <div className="image-inner">
                          <ul className="image-list" ref={ref}>
                            {data.data.mediaItems.edges.map((image, index) => {
                              return (
                                <li
                                  className="list-item"
                                  id={
                                    active === index.toString()
                                      ? index.toString()
                                      : ''
                                  }
                                >
                                  <img
                                    id="product-image"
                                    alt={image.node.alt}
                                    src={image.node.mediaItemUrl}
                                  />
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </>
            );
          }}
        </Query>
      </main>
    </div>
  );
}

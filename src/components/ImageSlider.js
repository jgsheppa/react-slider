import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap, TweenLite, Power3 } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import './ImageSlider.css';

function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useCallback((node) => {
    if (node !== null) {
      setRect(node.children);
      console.log('node', node.children);
    }
  }, []);
  return [rect, ref];
}

export default function ImageSlider() {
  const [rect, ref] = useClientRect();

  const [state, setState] = useState({
    isActive1: true,
    isActive2: false,
    isActive3: false,
    isActive4: false,
  });

  console.log(state);

  const imageWidth = 590;

  useEffect(() => {
    gsap.registerPlugin(Draggable, TweenLite);

    if (rect) {
      console.log('ref effect', rect[0].id);
    }

    let startX;
    let globalDirection;

    Draggable.create('.list-item', {
      trigger: '#product-image',
      type: 'x',
      onPress: function () {
        //record the starting values so we can compare them later...
        startX = this.x;
        console.log(startX);
      },
      onDrag: function () {
        let currentX = this.x,
          direction = [];
        if (currentX > startX) {
          // direction.push('right');
          globalDirection = direction[0] = 'right';
        } else if (currentX < startX) {
          // direction.push('left');
          globalDirection = direction[0] = 'left';
        }
        // console.log(direction);
      },
      onDragEnd: function () {
        console.log('ref effect', rect);
        if (globalDirection === 'right') {
          prevSlide();
          console.log('right', rect);
        } else if (globalDirection === 'left') {
          nextSlide();
          console.log('left', rect);
        }
      },
    });

    // const slideRight = () => {
    //   if (imageList.children[0]) {
    //     setState({ isActive1: false, isActive2: true });
    //     TweenLite.to(imageList.children, 1, {
    //       x: 0,
    //       ease: Power3.easeOut,
    //     });
    //   } else if (imageList.children[1]) {
    //     setState({ isActive2: false, isActive3: true });
    //     TweenLite.to(imageList.children, 1, {
    //       x: imageWidth * 2,
    //       ease: Power3.easeOut,
    //     });
    //   } else if (imageList.children[2]) {
    //     TweenLite.to(imageList.children, 1, {
    //       x: imageWidth * 3,
    //       ease: Power3.easeOut,
    //     });
    //   }
    //   console.log('slide right');
    // };

    // const slideLeft = () => {
    //   if (imageList.children[0]) {
    //     TweenLite.to(imageList.children, 1, {
    //       x: -imageWidth * 1,
    //       ease: Power3.easeOut,
    //     });
    //   } else if (imageList.children[1]) {
    //     TweenLite.to(imageList.children, 1, {
    //       x: -imageWidth * 2,
    //       ease: Power3.easeOut,
    //     });
    //   }
    //   console.log('slide left');
    // };

    //Image transition
    const slideLeft = (index, duration, multiplied = 1) => {
      TweenLite.to(rect[index], duration, {
        x: -imageWidth * multiplied,
        ease: Power3.easeOut,
      });
    };

    const slideRight = (index, duration, multiplied = 1) => {
      TweenLite.to(rect[index], duration, {
        x: imageWidth * multiplied,
        ease: Power3.easeOut,
      });
    };

    const nextSlide = () => {
      if (rect[0].id === 'active') {
        setState({ isActive1: false, isActive2: true });
        //Image transition
        slideLeft(0, 1);
        slideLeft(1, 1);

        slideLeft(2, 1);
        slideLeft(2, 0);
      } else if (rect[1].id === 'active') {
        setState({ isActive2: false, isActive3: true });
        //Image transition
        slideRight(0, 1);
        slideLeft(1, 1, 2);
        slideLeft(2, 1, 2);
      } else if (rect[2].id === 'active') {
        setState({ isActive1: true, isActive3: false });
        //Image transition
        slideLeft(2, 1, 3);
        slideLeft(0, 1, 0);
        slideLeft(1, 0, 0);
      }
    };

    const prevSlide = () => {
      if (rect[0].id === 'active') {
        setState({ isActive1: false, isActive3: true });
        //Image transition
        slideLeft(2, 0, 3);
        slideLeft(2, 1, 2);

        slideRight(0, 1);
        slideRight(1, 1);
      } else if (rect[1].id === 'active') {
        setState({ isActive2: false, isActive1: true });
        //Image transition
        slideLeft(0, 0);
        slideRight(0, 1, 0);
        slideRight(1, 1, 0);
        slideRight(2, 1, 2);
      } else if (rect[2].id === 'active') {
        setState({ isActive2: true, isActive3: false });
        slideLeft(2, 1);
        slideLeft(1, 0, 2);
        slideLeft(1, 1);
      }
    };
  }, [rect]);

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
            console.log('data', data);

            if (!data.data) {
              return <h1>Loading...</h1>;
            }

            return (
              <>
                <main>
                  <div>
                    <div>
                      <div id="image-container" className="image-container">
                        <div className="image-inner">
                          <ul
                            className="image-list"
                            // ref={(el) => (imageList = el)}
                            ref={ref}
                          >
                            {/* {data.data.mediaItems.edges.map((images, index) => (
                              <li
                               className={state.isActive1 ? 'active' : ''}
                              >
                                <img
                                  id="product-image"
                                  alt={images.node.alt}
                                  src={images.node.mediaItemUrl}
                                />
                              </li>
                            ))} */}
                            <li
                              className="list-item"
                              id={state.isActive1 ? 'active' : ''}
                              // className={state.isActive1 ? 'active' : ''}
                              // id="list-item"
                              // id={state.isActive1 ? 'active' : ''}
                            >
                              <img
                                id="product-image"
                                alt={data.data.mediaItems.edges[0].node.alt}
                                src={
                                  data.data.mediaItems.edges[0].node
                                    .mediaItemUrl
                                }
                              />
                            </li>
                            <li
                              className="list-item"
                              id={state.isActive2 ? 'active' : ''}
                              // id="list-item"
                              // className={state.isActive2 ? 'active' : ''}
                              // id={state.isActive1 ? 'active' : ''}
                            >
                              <img
                                id="product-image"
                                alt={data.data.mediaItems.edges[1].node.alt}
                                src={
                                  data.data.mediaItems.edges[1].node
                                    .mediaItemUrl
                                }
                              />
                            </li>
                            <li
                              // className={state.isActive3 ? 'active' : ''}
                              // id="list-item"
                              className="list-item"
                              id={state.isActive3 ? 'active' : ''}
                            >
                              <img
                                id="product-image"
                                alt={data.data.mediaItems.edges[2].node.alt}
                                src={
                                  data.data.mediaItems.edges[2].node
                                    .mediaItemUrl
                                }
                              />
                            </li>
                            <li
                              className="list-item"
                              id={state.isActive4 ? 'active' : ''}
                              // className="list-item"
                              // id="list-item"
                              // className={state.isActive4 ? 'active' : ''}
                              // id={state.isActive1 ? 'active' : ''}
                            >
                              <img
                                id="product-image"
                                alt={data.data.mediaItems.edges[3].node.alt}
                                src={
                                  data.data.mediaItems.edges[3].node
                                    .mediaItemUrl
                                }
                              />
                            </li>
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

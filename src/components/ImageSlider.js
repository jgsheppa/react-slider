import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { gsap, TweenLite, Power3 } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import './ImageSlider.css';
import arrowLeft from '../assets/arrow-left.svg';
import arrowRight from '../assets/arrow-right.svg';

export default function ImageSlider() {
  let imageList = useRef(null);
  let myTween = useRef(null);

  const imageWidth = 590;

  useEffect(() => {
    gsap.registerPlugin(Draggable, TweenLite);

    let startX;

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
          direction[0] = 'right';
        } else if (currentX < startX) {
          // direction.push('left');
          direction[0] = 'left';
        }
        // console.log(totalChange);
        console.log(direction);
      },
    });
  }, []);

  return (
    <div className="container">
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

          //Image transition
          const slide = (index, duration, multiplied = 1, direction) => {
            if (direction[0] === 'left') {
              TweenLite.to(imageList.children[index], duration, {
                x: -imageWidth * multiplied,
                ease: Power3.easeOut,
              });
            } else if (direction[0] === 'right') {
              TweenLite.to(imageList.children[index], duration, {
                x: imageWidth * multiplied,
                ease: Power3.easeOut,
              });
            }
          };

          const slideRight = (index, duration, multiplied = 1) => {};

          const scale = (index, duration) => {
            TweenLite.from(imageList.children[index], duration, {
              scale: 1.2,
              ease: Power3.easeOut,
            });
          };

          // let startX;

          // Draggable.create('.list-item', {
          //   trigger: '#product-image',
          //   type: 'x',
          //   onPress: function () {
          //     //record the starting values so we can compare them later...
          //     startX = this.x;
          //   },
          //   onDrag: function () {
          //     let totalChange = this.x + startX,
          //       direction = [];
          //     if (totalChange > startX) {
          //       direction.push('right');
          //     } else if (totalChange < startX) {
          //       direction.push('left');
          //     }
          //     console.log(direction);
          //   },
          // });

          return (
            <>
              <main>
                <div>
                  <div>
                    <div id="image-container" className="image-container">
                      <div className="image-inner">
                        <ul
                          className="image-list"
                          ref={(el) => (imageList = el)}
                        >
                          <li
                            className="list-item"
                            // className={state.isActive1 ? 'active' : ''}
                            // id={state.isActive1 ? 'active' : ''}
                          >
                            <img
                              id="product-image"
                              alt={data.data.mediaItems.edges[0].node.alt}
                              src={
                                data.data.mediaItems.edges[0].node.mediaItemUrl
                              }
                            />
                          </li>
                          <li
                            className="list-item"
                            // className={state.isActive2 ? 'active' : ''}
                            // id={state.isActive1 ? 'active' : ''}
                          >
                            <img
                              id="product-image"
                              alt={data.data.mediaItems.edges[1].node.alt}
                              src={
                                data.data.mediaItems.edges[1].node.mediaItemUrl
                              }
                            />
                          </li>
                          <li
                            className="list-item"
                            // className={state.isActive3 ? 'active' : ''}
                            // id={state.isActive1 ? 'active' : ''}
                          >
                            <img
                              id="product-image"
                              alt={data.data.mediaItems.edges[2].node.alt}
                              src={
                                data.data.mediaItems.edges[2].node.mediaItemUrl
                              }
                            />
                          </li>
                          <li
                            className="list-item"
                            // className={state.isActive4 ? 'active' : ''}
                            // id={state.isActive1 ? 'active' : ''}
                          >
                            <img
                              id="product-image"
                              alt={data.data.mediaItems.edges[3].node.alt}
                              src={
                                data.data.mediaItems.edges[3].node.mediaItemUrl
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
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import './ScrollTop.scss';
import * as Scroll from 'react-scroll';

const ScrollTop: React.FC = () => {
  const [isShow, setIsShow] = useState(false);
  const scroll = Scroll.animateScroll;
  useEffect(() => {
    const scrollHandler = () => {
      if (window.scrollY > 280) return setIsShow(true);
      if (window.scrollY < 260) return setIsShow(false);
    };
    window.addEventListener('scroll', scrollHandler);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);
  // console.log('this is scroll top!')
  return (
    <div className="scroll-top-background d-flex justify-content-center align-items-end">
      <div className="scroll-top-container d-flex">
        <div className={`scroll-top-item p-2 ${isShow?'show-item':'hide-item'}`}>
          <button
          className='rs-button'
            onClick={() => {
              scroll.scrollToTop({ smooth: 'easeOutQuint' });
            }}
          >
            <i className="fas fa-arrow-circle-up "></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScrollTop;

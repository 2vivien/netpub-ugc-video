import React from 'react';
import { getOptimizedVideoUrls } from '../utils/mediaUtils';

interface OptimizedVideoProps
  extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src'> {
  /** URL du MP4 de référence. Le WebM est déduit et servi en premier. */
  src: string;
}

/**
 * `<video>` qui sert le WebM avant le MP4.
 *
 * Les WebM pèsent environ trois fois moins lourd que les MP4 équivalents
 * (3,6 Mo contre 12,9 Mo sur une vidéo UGC). Chrome, Firefox et Edge les
 * lisent nativement ; seul Safari force le MP4 via la seconde source.
 *
 * La ref est transmise pour que les cartes puissent piloter la lecture.
 */
export const OptimizedVideo = React.forwardRef<HTMLVideoElement, OptimizedVideoProps>(
  ({ src, children, ...rest }, ref) => {
    const { webm, mp4 } = getOptimizedVideoUrls(src);

    return (
      <video ref={ref} {...rest}>
        {webm && <source src={webm} type="video/webm" />}
        {mp4 && <source src={mp4} type="video/mp4" />}
        {children}
      </video>
    );
  }
);

OptimizedVideo.displayName = 'OptimizedVideo';

export default OptimizedVideo;
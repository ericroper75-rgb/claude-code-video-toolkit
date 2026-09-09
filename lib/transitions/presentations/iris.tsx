/**
 * Iris Transition
 *
 * Classic cinematic circle (or diamond) wipe that opens/closes around an
 * origin point, like an old film iris shutter. The incoming scene reveals
 * through a growing shape while the outgoing scene is masked away outside it.
 *
 * Best for: Cinematic reveals, spotlight moments, vintage film aesthetic
 */
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from '@remotion/transitions';
import React, { useMemo, useId } from 'react';
import { AbsoluteFill, interpolate } from 'remotion';

export type IrisOrigin =
  | 'center'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type IrisProps = {
  /** Shape of the iris. Default: 'circle' */
  shape?: 'circle' | 'diamond';
  /** Point the iris grows from/to. Default: 'center' */
  origin?: IrisOrigin;
  /** Soft glow ring following the iris edge. Default: true */
  edgeGlow?: boolean;
};

const ORIGIN_POINTS: Record<IrisOrigin, [number, number]> = {
  center: [50, 50],
  'top-left': [0, 0],
  'top-right': [100, 0],
  'bottom-left': [0, 100],
  'bottom-right': [100, 100],
};

// Radius (in 0-100 objectBoundingBox space) needed for a shape centered at
// (ox, oy) to fully cover the frame, based on the farthest corner.
const maxRadiusForOrigin = (ox: number, oy: number): number => {
  const corners: [number, number][] = [[0, 0], [100, 0], [0, 100], [100, 100]];
  return Math.max(...corners.map(([cx, cy]) => Math.hypot(cx - ox, cy - oy)));
};

// A full circle drawn as two arcs, usable as one closed subpath.
const circleSubpath = (cx: number, cy: number, r: number): string => {
  if (r <= 0) return '';
  return `M ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} Z`;
};

// A diamond (square rotated 45deg) with "radius" as half-diagonal.
const diamondSubpath = (cx: number, cy: number, r: number): string => {
  if (r <= 0) return '';
  return `M ${cx} ${cy - r} L ${cx + r} ${cy} L ${cx} ${cy + r} L ${cx - r} ${cy} Z`;
};

const shapeSubpath = (shape: 'circle' | 'diamond', cx: number, cy: number, r: number): string =>
  shape === 'diamond' ? diamondSubpath(cx, cy, r) : circleSubpath(cx, cy, r);

const FULL_RECT = 'M 0 0 H 100 V 100 H 0 Z';

const IrisPresentation: React.FC<
  TransitionPresentationComponentProps<IrisProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const { shape = 'circle', origin = 'center', edgeGlow = true } = passedProps;

  const enteringClipId = useId().replace(/:/g, '-');
  const exitingClipId = useId().replace(/:/g, '-');

  const [ox, oy] = ORIGIN_POINTS[origin];
  const maxRadius = useMemo(() => maxRadiusForOrigin(ox, oy), [ox, oy]);

  // Both directions share the same growing-radius timeline so the entering
  // shape and the hole cut out of the exiting layer always line up.
  const radius = useMemo(
    () =>
      interpolate(presentationProgress, [0, 1], [0, maxRadius], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    [presentationProgress, maxRadius]
  );

  const isFullyOpen = radius >= maxRadius - 0.1;
  const isFullyClosed = radius <= 0.1;

  // Exiting layer is masked to a "donut": everything except the growing
  // shape, so the entering layer shows through where the iris has opened.
  const exitingPath = useMemo(() => {
    if (isFullyOpen) return 'M 0 0 Z'; // fully covered, hide exiting entirely
    if (isFullyClosed) return FULL_RECT; // nothing opened yet, show exiting fully
    return `${FULL_RECT} ${shapeSubpath(shape, ox, oy, radius)}`;
  }, [isFullyOpen, isFullyClosed, shape, ox, oy, radius]);

  // Entering layer only shows within the growing shape.
  const enteringPath = useMemo(() => {
    if (isFullyClosed) return 'M 0 0 Z';
    if (isFullyOpen) return FULL_RECT;
    return shapeSubpath(shape, ox, oy, radius);
  }, [isFullyClosed, isFullyOpen, shape, ox, oy, radius]);

  const isEntering = presentationDirection === 'entering';
  const clipPath = isEntering ? enteringPath : exitingPath;
  const clipId = isEntering ? enteringClipId : exitingClipId;
  const fullyVisible = isEntering ? isFullyOpen : isFullyClosed;
  const fullyHidden = isEntering ? isFullyClosed : isFullyOpen;

  const glowOpacity = edgeGlow
    ? interpolate(presentationProgress, [0, 0.15, 0.85, 1], [0, 0.5, 0.5, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: fullyVisible ? undefined : `url(#${clipId})`,
          WebkitClipPath: fullyVisible ? undefined : `url(#${clipId})`,
          opacity: fullyHidden ? 0 : 1,
        }}
      >
        {children}
      </AbsoluteFill>

      {isEntering && edgeGlow && glowOpacity > 0 && (
        <AbsoluteFill
          style={{
            opacity: glowOpacity,
            pointerEvents: 'none',
            background: `radial-gradient(
              circle at ${ox}% ${oy}%,
              transparent ${Math.max(radius - 4, 0)}%,
              rgba(255, 255, 255, 0.6) ${radius}%,
              transparent ${radius + 4}%
            )`,
          }}
        />
      )}

      {!fullyVisible && !fullyHidden && (
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <path d={clipPath} fillRule="evenodd" transform="scale(0.01)" />
            </clipPath>
          </defs>
        </svg>
      )}
    </AbsoluteFill>
  );
};

export const iris = (props: IrisProps = {}): TransitionPresentation<IrisProps> => {
  return { component: IrisPresentation, props };
};

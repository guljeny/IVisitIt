interface IParams {
  maxScale?: number;
  minScale?: number;
}

interface IImageState {
  initialScale: number;
  initialRect: DOMRect | null;
  scale: number;
  left:number;
  top: number;
  width: number;
  height: number;
}

export default class ImageObserver {
  private container: any;
  private containerRect: any;
  private image: any;
  private imageState: IImageState;
  private prevMousePosition: any;
  private prevScale: number = 1;
  private params: IParams;

  constructor (container, params: IParams) {
    this.imageState = {
      initialScale: 1,
      initialRect: null,
      scale: 1,
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    };

    this.params = params;

    this.setContainer(container);
  }

  setContainer (container) {
    this.container = container;
    this.containerRect = container.getBoundingClientRect();
    this.image = container.querySelector('svg');
    this.calculateSizes();
    window.addEventListener('resize', this.calculateSizes);
    this.container.addEventListener('wheel', this.onWheel);
    this.container.addEventListener('gesturestart', this.onGesureStart);
    this.container.addEventListener('mousedown', this.onMouseDown);
    this.container.addEventListener('gesturechange', this.onGesureChange);
    this.container.addEventListener('gestureend', this.onGesureEnd);
  }

  private calculateSizes = () => {
    this.containerRect = this.container.getBoundingClientRect();
    const imgRect = this.image.getBoundingClientRect();
    if (!this.image.width || !this.image.height) return;

    const imgWidth = this.image.width.baseVal.value;
    const imgHeight = this.image.height.baseVal.value;

    const scale = Math.min(this.containerRect.width / imgWidth, 1);
    const left = (1 - scale) * this.containerRect.width;

    const top = this.containerRect.width / imgWidth <= 1
      ? (1 - scale) * this.containerRect.height
      : (this.containerRect.height - imgHeight) / 2;

    this.imageState = {
      initialScale: scale,
      initialRect: imgRect,
      scale,
      left,
      top,
      width: imgWidth,
      height: imgHeight,
    };

    this.updateSizes();
  };

  private updateSizes = () => {
    const { scale, left, top } = this.imageState;
    this.image.style.transform = `translate(${left}px, ${top}px) scale(${scale}, ${scale})`;
  };

  private zoom = (nextScale, e) => {
    if (!this.imageState.initialRect) return;
    const eInImgX = e.clientX - this.imageState.initialRect.left - this.imageState.left;
    const eInImgY = e.clientY - this.imageState.initialRect.top - this.imageState.top;
    const centerX = eInImgX / (this.imageState.width * this.imageState.scale);
    const centerY = eInImgY / (this.imageState.height * this.imageState.scale);
    const { width, height, initialScale, scale } = this.imageState;
    const prevWidth = width * scale;
    const prevHeight = height * scale;

    this.imageState.scale = Math.max(Math.min(nextScale, (this.params.maxScale || 10)), initialScale / (this.params.minScale || 3));
    this.imageState.left -= (width * this.imageState.scale - prevWidth) * centerX;
    this.imageState.top -= (height * this.imageState.scale - prevHeight) * centerY;

    this.updateSizes();
  };

  private onWheel = e => {
    e.preventDefault();
    if (!this.imageState.initialRect) return;
    const scale = this.imageState.scale - e.deltaY * 0.001;

    this.zoom(scale, e);
  };

  private onMouseDown = e => {
    this.prevMousePosition = { x: e.clientX, y: e.clientY };
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };

  private onMouseUp = () => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  private onMouseMove = event => {
    const { clientX, clientY } = event;
    this.imageState.left -= this.prevMousePosition.x - clientX;
    this.imageState.top -= this.prevMousePosition.y - clientY;

    this.prevMousePosition.x = clientX;
    this.prevMousePosition.y = clientY;

    this.updateSizes();
  };

  private onGesureStart = e => {
    e.stopPropagation();
    e.preventDefault();
    this.prevScale = this.imageState.scale;
  };

  private onGesureEnd = e => {
    e.preventDefault();
  };

  private onGesureChange = e => {
    e.preventDefault();
    this.zoom(this.prevScale * e.scale, e);
  };

  removeListeners = () => {
    this.image.removeEventListener('load', this.calculateSizes);
    window.removeEventListener('resize', this.calculateSizes);
    this.container.removeEventListener('wheel', this.onWheel);
    this.container.removeEventListener('mousedown', this.onMouseDown);
    this.container.removeEventListener('gesturestart', this.onGesureStart);
    this.container.removeEventListener('gesturechange', this.onGesureChange);
    this.container.removeEventListener('gestureend', this.onGesureEnd);
  };
}

export type TImageObserver = ImageObserver;

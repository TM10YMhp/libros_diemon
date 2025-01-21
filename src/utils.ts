export const cx = (...args: unknown[]) =>
  args.filter((x) => typeof x === "string").join(" ");

export const debounce = (
  callback: (...args: unknown[]) => void,
  delay: number,
) => {
  let timer: NodeJS.Timeout;

  return function (...args: unknown[]) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const throttle = (
  callback: (...args: unknown[]) => void,
  delay: number,
) => {
  let timerFlag: NodeJS.Timeout | null = null;

  return (...args: unknown[]) => {
    if (timerFlag === null) {
      callback(...args);
      timerFlag = setTimeout(() => {
        timerFlag = null;
      }, delay);
    }
  };
};

const getOrigins = (element: Element) => {
  const rect = element.getBoundingClientRect();
  const width = window.innerWidth;
  const height = window.innerHeight;
  const originX = (rect.x + 0.5 * rect.width) / width;
  const originY = (rect.y + 0.5 * rect.height) / height;

  return { x: originX, y: originY };
};

export const launchConfetti = (element: Element, options: confetti.Options) => {
  const { x, y } = getOrigins(element);

  import("canvas-confetti").then(({ default: confetti }) => {
    confetti({
      zIndex: 10,
      origin: { x, y },
      ...options,
    });
  });
};

export const delay = (delay: number) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

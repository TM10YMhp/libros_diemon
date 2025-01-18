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

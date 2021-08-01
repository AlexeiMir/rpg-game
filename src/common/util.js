export function clamp(x, from_x, to_x) {
  if (x < from_x) x = from_x;
  if (x > to_x) x = to_x;

  return x;
}

export function animateEx(dx, startTime, currentTime, speed, looped = false) {
  // dx - расстояние между начальной и конечной точкой объекта
  // currentTime из lastRenderTime
  // speed - за какое время должен пройти dx
  // looped - зациклена анимация или нет
  const diff = currentTime - startTime;
  let time = (speed && diff / speed) || 0; // текущий прогресс движения от 0 до 1. 0 - движение только началось,
  // 1- закончилось
  // > 1 когда предыдущий рендер был немного раньше времени когда движение должно было закончиться
  // а текущий рендер немного позже
  if (looped) {
    time %= 1; // получаем дробную часть, удалив целую
  } else if (time > 1) {
    time = 1;
  }
  return { offset: dx * time, progress: time };
}

const getSVGLocation = (clientX, clientY, svg) => {
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const location = point.matrixTransform(svg.getScreenCTM().inverse());
  return [location.x, location.y];
};

export default getSVGLocation;

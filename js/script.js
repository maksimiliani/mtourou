const frames_p = 60;

let nIntervId;
let startValue, endValue, aniimation_time;

let cell_tmp = {col: "", row: ""};
let oldmap = {col: "", row: ""};
let beforeopenmap = {col: "", row: ""};

let cursorX, cursorY;
let cell = {lastTriggered: null};
let animation_interrupted = false;

document.addEventListener("DOMContentLoaded", (event) => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    let htm = document.querySelector('html[data-scheme]');
    htm.setAttribute('data-scheme', "dark");
  }

  if (cell_tmp.col == "") {
    for (let i = 1; i <= getStringCount(window.getComputedStyle(document.querySelector('.container'), null)["grid-template-columns"], "px"); i++) {
      cell_tmp.col += '1fr ';
    }
    for (let i = 1; i <= getStringCount(window.getComputedStyle(document.querySelector('.container'), null)["grid-template-rows"], "px"); i++) {
      cell_tmp.row += '1fr ';
    }
    oldmap = cell_tmp;
    document.querySelector('.container').style.gridTemplateColumns = oldmap.col;
    document.querySelector('.container').style.gridTemplateRows = oldmap.row;
  }
  
  document.getElementById('container').addEventListener("mousemove", handleMouseMove);
  document.getElementById('container').addEventListener("mouseout", handleMouseOut);
  document.querySelectorAll('.container > div').forEach(item => {
    item.addEventListener("mouseenter", handleMouseOver);
    item.addEventListener("click", (e) => {
      expandCell(e);
    });
    });
  
  startValue = {x: window.innerWidth * 1.5, y: window.innerHeight * 1.5};
  endValue = {x: 0, y: 0};
  aniimation_time = {duration: 500, currentTime: 0};
  
  nIntervId = setInterval(() => {
    animate()
    }, 50);

});

function expandCell(target, double_click = true, scale = "15") {
  if ((cell.lastTriggered == target.target) && !double_click) return;
  if (beforeopenmap.col == "") {
    for (let i = 1; i <= getStringCount(window.getComputedStyle(document.querySelector('.container'), null)["grid-template-columns"], "px"); i++) {
      beforeopenmap.col += '1fr ';
    }
    for (let i = 1; i <= getStringCount(window.getComputedStyle(document.querySelector('.container'), null)["grid-template-rows"], "px"); i++) {
      beforeopenmap.row += '1fr ';
    }
    oldmap = beforeopenmap;
  }

  let newmap = {col: "", row: ""};

  let inx = {
    h:1 + getOrderIndex(target.target)%getStringCount(oldmap.col, "fr"),
    v:1 + Math.floor(getOrderIndex(target.target)/getStringCount(oldmap.col, "fr"))
  };

  let maxcount = {
    col: getStringCount(oldmap.col, "fr"),
    row: getStringCount(oldmap.row, "fr"),
  }
  for (let i = 1; i <= maxcount.col; i++) {
    newmap.col += ((i == inx.h) ? (scale + 'fr ') : (((maxcount.col - Math.abs(inx.h - i))/(maxcount.col)) + 'fr '));
  }
  for (let i = 1; i <= maxcount.row; i++) {
    newmap.row += ((i == inx.v) ? (scale + 'fr ') : (((maxcount.row - Math.abs(inx.v - i))/(maxcount.row)) + 'fr '));
  }
  
    if ((newmap.col == oldmap.col) && (newmap.row == oldmap.row) && double_click) {
      document.querySelector('.container').style.gridTemplateColumns = beforeopenmap.col;
      document.querySelector('.container').style.gridTemplateRows = beforeopenmap.row;
      beforeopenmap.col = "";
      beforeopenmap.row = "";
    } else {
      document.querySelector('.container').style.gridTemplateColumns = newmap.col;
      document.querySelector('.container').style.gridTemplateRows = newmap.row;
      beforeopenmap = oldmap;
    }

    oldmap = newmap;

    cell.lastTriggered = target.target;
}

function animate() {
  if (animation_interrupted) {
    clearInterval(nIntervId);
    return;
  }
  // Update currentTime (you may use requestAnimationFrame for smoother animations)
  aniimation_time.currentTime += aniimation_time.duration/frames_p; // Assuming 60 frames per second

  // Calculate deducted value with ease effect
  let deductedValue = deductWithValueEase(startValue, endValue, aniimation_time.duration, aniimation_time.currentTime);
  document.querySelectorAll('.container > div').forEach(item => {
    let itemRect = item.getBoundingClientRect();
    let dx = deductedValue.x - itemRect.x;
    let dy = deductedValue.y - itemRect.y;
    let opacity = calculateOpacity(Math.sqrt(dx * dx + dy * dy));
    item.style.backgroundColor = `rgba(255, 122, 0, ${opacity})`;
  });
  // Check if the animation is still in progress
  if (aniimation_time.currentTime >= aniimation_time.duration) {
    clearInterval(nIntervId);
  }
}

function deductWithValueEase(startValue, endValue, duration, currentTime) {
  aniimation_time.currentTime = Math.min(duration, currentTime);
  let easedProgress = easeInOutQuad(aniimation_time.currentTime / duration);
  return {x: startValue.x + (endValue.x - startValue.x) * easedProgress, y: startValue.y + (endValue.y - startValue.y) * easedProgress};
}



    function handleMouseMove(event) {
      cursorX = event.clientX;
      cursorY = event.clientY;
      //updateRoundedCorners();
    }

    function handleMouseOut(event) {
      document.querySelector('.container').style.gridTemplateColumns = cell_tmp.col;
      document.querySelector('.container').style.gridTemplateRows = cell_tmp.row;
      cell.lastTriggered = null;
    }

    function updateRoundedCorners() {
      let gridItems = document.querySelectorAll('.container > div');
      let containerRect = document.getElementById('container').getBoundingClientRect();

      gridItems.forEach(item => {
        let roundedCornersX = (cursorX - containerRect.left) / containerRect.width * 100 + '%';
        let roundedCornersY = (cursorY - containerRect.top) / containerRect.height * 100 + '%';
        item.style.borderRadius = `${roundedCornersY} 0 ${roundedCornersX} ${roundedCornersY}`;
      });
    }

    function handleMouseOver(e) {
      animation_interrupted = true;

      document.querySelectorAll('.container > div').forEach(item => {
        let distance = calculateDistance(e.target, item);
        let opacity = calculateOpacity(distance);
        item.style.backgroundColor = `rgba(255, 122, 0, ${opacity})`;
      });

      expandCell(e, false, "1.2");
    }
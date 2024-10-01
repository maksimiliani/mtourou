function easeOutElastic(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

function easeInOutQuad(x) {
return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function getStringCount(string, lookfor) {
    return string.match(new RegExp(lookfor, 'g')).length
}

function getOrderIndex(node) {
    return Array.prototype.indexOf.call(node.parentNode.children, node);
  }

  function calculateDistance(target, item) {
    let targetRect = target.getBoundingClientRect();
    let itemRect = item.getBoundingClientRect();
    let dx = targetRect.x - itemRect.x;
    let dy = targetRect.y - itemRect.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function calculateOpacity(distance) {
    // Adjust the parameters of the parabolic function as needed
    let maxDistance = window.innerWidth * 0.9; // Maximum distance at which opacity is 0
    let minOpacity = 0; // Minimum opacity
    let opacity = 1 - Math.pow(distance / maxDistance, 1);
    return Math.max(minOpacity, opacity);
  }
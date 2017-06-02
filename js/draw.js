    var container = document.getElementById('canvas');

    var isDrawing = false;
    var drawingPoints;
    var drawingPath;
    var defaultPathStyle = {
        strokeWidth: "3px",
        stroke: "#000",
        fill: "none",
    };
    container.addEventListener('mousedown', function(e) {
        isDrawing = true;
        drawingPoints = [];
    });
    container.addEventListener('mousemove', function(e) {
        if (isDrawing) {
            drawingPoints.push({
                x: e.clientX,
                y: e.clientY
            });
            if (drawingPath) {
                container.removeChild(drawingPath);
            }
            drawingPath = createPath(drawingPoints);
            Object.assign(drawingPath.style, defaultPathStyle);
            container.appendChild(drawingPath);
        }
    });
    container.addEventListener('mouseup', function(e) {
        isDrawing = false;
        if (!drawingPath) {
            return;
        }
        container.removeChild(drawingPath);
        drawingPath = null;
        var path;
        path = createPath(drawingPoints);
        Object.assign(path.style, defaultPathStyle);
        container.appendChild(path);
    });
    function createPath(points) {
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        var attribute = '';
        points.forEach((point, index) => {
            if (index === 0) {
                attribute += `M${point.x}, ${point.y}`;
            } else {
                attribute += `L${point.x}, ${point.y}`;
            }
        });
        path.setAttributeNS(null, 'd', attribute);
        return path;
    }
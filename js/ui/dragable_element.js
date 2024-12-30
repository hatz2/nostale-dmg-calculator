
export function makeDraggable(html_element) {
    var init_pos = {x: 0, y: 0};
    var shift_offset = {x: 0, y: 0};

    html_element.onmousedown = mouseDown;

    function mouseDown(event) {    
        init_pos = {
            x: event.clientX,
            y: event.clientY
        };
    
        document.onmouseup = mouseUp;
        document.onmousemove = mouseMove;
    }
    
    function mouseUp(event) {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function mouseMove(event) {
        shift_offset = {
            x: init_pos.x - event.clientX,
            y: init_pos.y - event.clientY
        };

        init_pos = {
            x: event.clientX,
            y: event.clientY
        };

        html_element.style.top = (html_element.offsetTop - shift_offset.y) + "px";
        html_element.style.left = (html_element.offsetLeft - shift_offset.x) + "px";
    }
}
let direction = -1;
let disableMovement = false;
let offset = { topRow: 0, btmRow: 0 }
let rowArray = []

/************************************************************************/

function calcOffsetValues(rowName){
    const row = $("." + rowName);
    const node = direction == -1? row.children(":first"): row.children(":last"); 

    offset[rowName] += (node.width() * direction)
}

// Call the right method for moving the images based on the choosen direction
function shiftImages(row){
    const moveHandler = {
        left: () => handleLeftShiftMove(row),
        right: () => handleRightShiftMove(row),
    }
    moveHandler[direction == -1? "left": "right"]();
}

function handleLeftShiftMove(row){
    // Clone the first element in the list and append the clone to the list
    const node = $("." + row).children(":first").clone(true);
    $("." + row).append(node);

    // Set the 'translateX' propery of every image in a way that the appended 
    //  element is not seen
    $("." + row).children("img").each(function(i){
        $(this).css('transform','translateX('+ node.width() +'px)');
    })

    // Short delay so the last 'translateX' doesnt get overwriten. Change
    //  the 'translateX' property to 0 and add the transition class to every
    //  image 
    setTimeout(() => {
        $("." + row).children("img").each(function(i){
            $(this).css('transform','translateX(0px)');
            $(this).addClass("transition");
        }, 10)
    })
}


function handleRightShiftMove(row){
    // Offset all the image element by the previously set offset value + 10(margin) 
    //  and add a transition class
    $("." + row).children("img").each(function(i){
        $(this).css('transform','translateX('+ (offset[row] + 10) +'px)');
        $(this).addClass("transition");
    })
}

/************************************************************************/

// Update the rows based on the selected direction and reset the 'translateX'
//  propery and transition class of each image in the row. Also set the row
//  offset to 0
function updateRow(row){
    const updateHandler = {
        left: () => handleLeftShiftUpdate(row),
        right: () => handleRightShiftUpdate(row),
    }
    updateHandler[direction == -1? "left": "right"]();

    $("." + row).children("img").each(function(i){
        $(this).css('transform','translateX(0px)');
        $(this).removeClass("transition");
    })

    offset[row] = 0;
}

// When elements get shifted to the left, detach the first element in the 
//  list because it goes off screen. The element get appended to the back
//  of the list in the 'handleLeftShiftMove()' function
function handleLeftShiftUpdate(row){
    const node = $("." + row).children(':first')
    node.detach();
}

// When elements get shifted to the right detach the last element of the row
//  and add it to the start of the list
function handleRightShiftUpdate(row){
    const node = $("." + row).children(':last')
    node.detach();
    $("." + row).prepend(node);   
}

/************************************************************************/

// Check if the movement is enabled, if it is calculate the offset value 
//  and move the image in each row. After the transition in finished,
//  update each row and enable the movement again.
function moveImages(newDirection){
    if(disableMovement) return;
    disableMovement = true;
    
    direction = newDirection;
 
    rowArray.forEach(row => {
        calcOffsetValues(row);
        shiftImages(row);
    })

    setTimeout(() => {
        rowArray.forEach(row => updateRow(row))
        disableMovement = false;
    }, 600)
}

// Get class of each of the rows that will allow us to control the rows 
function getRows(){
    $(".slider").children("div").each(function(i){
        const classList = $(this).attr('class').split(" ");
        rowArray.push(classList[1]);
    })
}

$(document).ready(function(){
    getRows();

    $(".leftBtn").on("click", () => moveImages(-1));
    $(".rightBtn").on("click", () => moveImages(1));
})
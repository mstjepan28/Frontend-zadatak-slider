let offset = { topRow: 0, btmRow: 0 }
let direction = "left";
let isDisabled = false;

console.log($)

/************************************************************************/

function calcOOBPixels(row){ // OOB - Out-Of-Bounds
    // Width of the row
    const rowWidth = document.querySelector("div." + row).offsetWidth;

    // Sum the width of every img in the row
    const imageList = Array.from(document.querySelectorAll("div." + row + " img"));
    const totalImgWidth = imageList.map(element => element.offsetWidth).reduce((prev, cur) => prev + cur);

    // Sum width of all the images and offset for the given row
    const totalContentWidth = totalImgWidth + Math.abs(offset[row]);

    // Number of pixels that are out of bounds, if the row is wider then its content, return 0 
    return rowWidth >= totalContentWidth? 0: Math.abs(rowWidth - totalContentWidth);
}

// Checks if the given row is filled with content(img elements)
function isRowFull(row){
    return (calcOOBPixels(row) - offset[row]) > 0;
}

/************************************************************************/

function updateRows(row){
    const imageList = document.querySelectorAll("div." + row + " img");
    const firstElem = imageList[0]; // first element in the list 
    const lastElem = imageList[imageList.length - 1]; // last element in the list

    // Move element to the first/last place in the row
    const setElement = {
        left: () => document.querySelector("div." + row).appendChild(firstElem),
        right: () => document.querySelector("div." + row).insertBefore(lastElem, firstElem)
    }
    setElement[direction]();

    // Reset the offset
    offset[row] = 0;
    Array.from(imageList).forEach(image => {
        image.style.transition = "";
        image.style.transform = "";
    });
}

/************************************************************************/

// Adds/Subtracts the amount of pixels the images should be shifted 
//  depending on the clicked button
function updateOffsetValue(topElem, btmElem){
    let updateValue = topElem.offsetWidth;
    offset.topRow += direction == "left"? updateValue * -1: updateValue;

    updateValue = btmElem.offsetWidth;
    offset.btmRow += direction == "left"? updateValue * -1: updateValue;
}

// Apply translateX style propery to image with the set offset value
function shiftImage(image, row){
    image.style.transition = "transform 0.4s ease-in-out";
    image.style.transform = 'translateX(' + offset[row] + 'px)';
}

// Get the last element in the list thats not a filler element. The content
//  of the row is going to be shifted over by the width of that element
function getOffsetValue(imageList){
    return Array.from(imageList).reverse().find(elem => elem.src)
}

function moveImages(newDirection){
    if(isDisabled) return;
    isDisabled = true;

    direction = newDirection;

    const imageListTop = document.querySelectorAll("div.topRow img");
    const imageListBtm = document.querySelectorAll("div.btmRow img");

    updateOffsetValue(getOffsetValue(imageListTop), getOffsetValue(imageListBtm));

    imageListTop.forEach(image => shiftImage(image, "topRow"));
    imageListBtm.forEach(image => shiftImage(image, "btmRow"));

    // Wait for the images to move then update the rows
    setTimeout(() => {
        updateRows("topRow");
        updateRows("btmRow");

        isDisabled = false;
    }, 400);
}

document.querySelector("button.leftBtn").addEventListener("click", () => moveImages('left'));
document.querySelector("button.rightBtn").addEventListener("click", () => moveImages('right'));

/************************************************************************/

// Recursivly fills the given row with empty img elements until
function fillRow(rowName){
    // Recursion base case
    if(isRowFull(rowName)) return; 
    
    // Create new element and add its width/heightm minWidht because it would be too narrow otherwise
    const newFillerElem = document.createElement("img");
    newFillerElem.style.minWidth = "220px";
    newFillerElem.style.height = "200px";

    // Append the element to the row
    const row = document.querySelector("div." + rowName);
    row.appendChild(newFillerElem);

    fillRow(rowName);
}

// Fill them with empty img elements. If the row is alread full, it stoped  
//  at the recusion base case
setTimeout(() => {
    fillRow("topRow");
    fillRow("btmRow");
}, 100)

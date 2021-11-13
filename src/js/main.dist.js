"use strict";

var direction = -1;
var disableMovement = false;
var offset = {
  topRow: 0,
  btmRow: 0
};
var rowArray = ["topRow", "btmRow"];
/************************************************************************/

function calcOffsetValues(rowName) {
  var row = $("." + rowName);
  var node = direction == -1 ? row.children(":first") : row.children(":last");
  offset[rowName] += node.width() * direction;
} // Call the right method for moving the images based on the choosen direction


function shiftImages(row) {
  var moveHandler = {
    left: function left() {
      return handleLeftShiftMove(row);
    },
    right: function right() {
      return handleRightShiftMove(row);
    }
  };
  moveHandler[direction == -1 ? "left" : "right"]();
}

function handleLeftShiftMove(row) {
  // Clone the first element in the list and append the clone to the list
  var node = $("." + row).children(":first").clone(true);
  $("." + row).append(node); // Set the 'translateX' propery of every image in a way that the appended 
  //  element is not seen

  $("." + row).children("img").each(function (i) {
    $(this).css('transform', 'translateX(' + node.width() + 'px)');
  }); // Short delay so the last 'translateX' doesnt get overwriten. Change
  //  the 'translateX' property to 0 and add the transition class to every
  //  image 

  setTimeout(function () {
    $("." + row).children("img").each(function (i) {
      $(this).css('transform', 'translateX(0px)');
      $(this).addClass("transition");
    }, 10);
  });
}

function handleRightShiftMove(row) {
  // Offset all the image element by the previously set offset value + 10(margin) 
  //  and add a transition class
  $("." + row).children("img").each(function (i) {
    $(this).css('transform', 'translateX(' + (offset[row] + 10) + 'px)');
    $(this).addClass("transition");
  });
}
/************************************************************************/
// Update the rows based on the selected direction and reset the 'translateX'
//  propery and transition class of each image in the row. Also set the row
//  offset to 0


function updateRow(row) {
  var updateHandler = {
    left: function left() {
      return handleLeftShiftUpdate(row);
    },
    right: function right() {
      return handleRightShiftUpdate(row);
    }
  };
  updateHandler[direction == -1 ? "left" : "right"]();
  $("." + row).children("img").each(function (i) {
    $(this).css('transform', 'translateX(0px)');
    $(this).removeClass("transition");
  });
  offset[row] = 0;
} // When elements get shifted to the left, detach the first element in the 
//  list because it goes off screen. The element get appended to the back
//  of the list in the 'handleLeftShiftMove()' function


function handleLeftShiftUpdate(row) {
  var node = $("." + row).children(':first');
  node.detach();
} // When elements get shifted to the right detach the last element of the row
//  and add it to the start of the list


function handleRightShiftUpdate(row) {
  var node = $("." + row).children(':last');
  node.detach();
  $("." + row).prepend(node);
}
/************************************************************************/


$(".leftBtn").on("click", function () {
  return moveImages(-1);
});
$(".rightBtn").on("click", function () {
  return moveImages(1);
}); // Check if the movement is enabled, if it is calculate the offset value 
//  and move the image in each row. After the transition in finished,
//  update each row and enable the movement again.

function moveImages(newDirection) {
  if (disableMovement) return;
  disableMovement = true;
  direction = newDirection;
  rowArray.forEach(function (row) {
    calcOffsetValues(row);
    shiftImages(row);
  });
  setTimeout(function () {
    rowArray.forEach(function (row) {
      return updateRow(row);
    });
    disableMovement = false;
  }, 600);
}

class Slider{
    $slider = null;
    $rowArray = []
    
    direction = -1;
    disableMovement = false;
    offset = {}

    constructor(sliderElement){
        this.$slider = sliderElement;
        this.$rowArray = this.$slider.children("div").toArray();
    }

    calcOffsetValues($row){
        const node = this.direction == -1? $row.children(":first"): $row.children(":last"); 
        const rowName = $row.attr('class').split(" ").join("");
    
        this.offset[rowName] = this.offset[rowName]? this.offset[rowName]: 0;
        this.offset[rowName] += (node.width() * this.direction);
    }
    
    // Call the right method for moving the images based on the choosen direction
    shiftImages($row){
        const moveHandler = {
            left: () => this.handleLeftShiftMove($row),
            right: () => this.handleRightShiftMove($row),
        }
        moveHandler[this.direction == -1? "left": "right"]();
    }
    
    handleLeftShiftMove($row){
        // Clone the first element in the list and append the clone to the list
        const node = $row.children(":first").clone(true);
        $row.append(node);
    
        // Set the 'translateX' propery of every image in a way that the appended 
        //  element is not seen
        $row.children("img").each(function(i){
            $(this).css('transform',`translateX( ${node.width()}px )`);
        })
    
        // Short delay so the last 'translateX' doesnt get overwriten. Change
        //  the 'translateX' property to 0 and add the transition class to every
        //  image 
        setTimeout(() => {
            $row.children("img").each(function(i){
                $(this).css('transform','translateX(0px)');
                $(this).addClass("transition");
            }, 10)
        })
    }
    
    handleRightShiftMove($row){
        // Offset all the image element by the previously set offset value + 10(margin) 
        //  and add a transition class
        const rowName = $row.attr('class').split(" ").join("");
        const offsetValue = this.offset[rowName] + 10

        $row.children("img").each(function(i){
            $(this).addClass("transition");
            $(this).css('transform',`translateX( ${offsetValue}px )`);
        })
    }
    
    /************************************************************************/
    
    // Update the rows based on the selected direction and reset the 'translateX'
    //  propery and transition class of each image in the row. Also set the row
    //  offset to 0
    updateRow($row){
        const updateHandler = {
            left: () => this.handleLeftShiftUpdate($row),
            right: () => this.handleRightShiftUpdate($row),
        }
        updateHandler[this.direction == -1? "left": "right"]();
    
        $row.children("img").each(function(i){
            $(this).css('transform','translateX(0px)');
            $(this).removeClass("transition");
        })
        
        const rowName = $row.attr('class').split(" ").join("");;
        this.offset[rowName] = 0;
    }
    
    // When elements get shifted to the left, detach the first element in the 
    //  list because it goes off screen. The element get appended to the back
    //  of the list in the 'handleLeftShiftMove()' function
    handleLeftShiftUpdate($row){
        const node = $row.children(':first')
        node.detach();
    }
    
    // When elements get shifted to the right detach the last element of the row
    //  and add it to the start of the list
    handleRightShiftUpdate($row){
        const node = $row.children(':last')
        node.detach();
        $row.prepend(node);   
    }


    // Check if the movement is enabled, if it is calculate the offset value 
    //  and move the image in each row. After the transition in finished,
    //  update each row and enable the movement again.
    moveImages(newDirection){
        if(this.disableMovement) return;
        this.disableMovement = true;
        
        this.direction = newDirection;
    
        this.$rowArray.forEach(row => {
            this.calcOffsetValues($(row));
            this.shiftImages($(row));
        })

        setTimeout(() => {
            this.$rowArray.forEach(row => this.updateRow($(row)))
            this.disableMovement = false;
        }, 600)
    }
}

$(document).ready(function(){
    const slider = new Slider($(".slider"));

    $(".leftBtn").on("click", () => slider.moveImages(-1));
    $(".rightBtn").on("click", () => slider.moveImages(1));
})
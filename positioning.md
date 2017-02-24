Hi Etan!

For **Assignment 3: HTML & CSS**, the instructions ask for me to differentiate between _relative_ and _absolute_ positioning for an element.

To begin, I'll first explain _normal flow_ of a page.  A normal flow in stock form typically means that elements are stacked on top of each other in a "block-level" format.  If we have 3 elements under normal flow and in a _static_ position (which means it remains in a set place already determined by the browser), then they would stack on top of each other in a vertical line.  

_Relative_ positioning means we are moving an element in relation to **where it's supposed to be** under _normal flow_ and a _static_ position.


_Absolute_ positioning means we are ignoring that _normal flow_ and putting an element in an exact position where we want it to be, without regard for the other elements.  They all essentially "ignore" this element while it goes and does its own thing.


For the second part of this assignment, I'll explain how **box-sizing: border-box** is different than default **box-sizing**.

Typical default **box-sizing** includes content, padding, and border.  It means that when we add padding to the outer box, the overall height and width increases.

**box-sizing: border-box** rather keeps height and width the same when we add padding and borders.  This means the content will get pushed inward rather than stay static.




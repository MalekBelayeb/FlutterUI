
import interact from 'https://cdn.interactjs.io/v1.10.11/interactjs/index.js';


function dragMoveListener(event) {
  
  
  var target = event.target;
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}


interact('.droppable')
.dropzone({
  accept: '.draggable', 
  overlap: 0.75,
  ondropactivate: function (event) {
    event.target.classList.add('drop-active');
  },
  ondragenter: function (event) {
    var draggableElement = event.relatedTarget;
    var dropzoneElement = event.target;

    dropzoneElement.classList.add('drop-target');
    draggableElement.classList.add('can-drop');
    draggableElement.textContent = 'Dragged in';
  },
  ondragleave: function (event) {
    event.target.classList.remove('drop-target');
    event.relatedTarget.classList.remove('can-drop');
    event.relatedTarget.textContent = 'Dragged out';
  },
  ondrop: function (event) {
    event.relatedTarget.textContent = 'Dropped';
  },
  ondropdeactivate: function (event) {
    event.target.classList.remove('drop-active');
    event.target.classList.remove('drop-target');
  }
});

interact('.draggable')
.draggable({
  inertia: true,
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: 'parent',
      endOnly: true
    })
  ],
  autoScroll: true,
  
  listeners: { move: dragMoveListener }
}).resizable({

  edges: { left: true, right: true, bottom: true, top: true },

  listeners: {
    move(event) {
      var target = event.target;
      var x = (parseFloat(target.getAttribute('data-x')) || 0);
      var y = (parseFloat(target.getAttribute('data-y')) || 0);
      
      console.log(x,y);
      target.style.width = event.rect.width + 'px';
      target.style.height = event.rect.height + 'px';
      
      x += event.deltaRect.left;
      y += event.deltaRect.top;
      
      target.style.transform = 'translate(' + x + 'px,' + y + 'px)';

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);

      target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);

    }
  },
  modifiers: [
    
    

    interact.modifiers.restrictSize({
      min: { width: 100, height: 50 }
    })
  ],

  inertia: true
});


  
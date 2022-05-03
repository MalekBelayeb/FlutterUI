
import interact from 'https://cdn.interactjs.io/v1.10.11/interactjs/index.js';

const flutterSkeleton = "import 'package:flutter/material.dart'; \n class ExportedFUIKit extends StatelessWidget {ExportedFUIKit(); @override Widget build(BuildContext context) {return Scaffold(body: ${{body}},);}}";
const flutterEmptySkeleton = "import 'package:flutter/material.dart'; \n class ExportedFUIKit extends StatelessWidget { \n ExportedFUIKit(); \n @override \n Widget build(BuildContext context) { \n \t \t return Scaffold(body:  Text('')); \n } \n }";

const vscode = acquireVsCodeApi();


var projectName = ''
var projectPath = ''

const flutterElements = [

  {
    name: "fuikit-text",
    code: " \n Text('lorem ipsum') \n"
  },

  {
    name: "fuikit-column",
    code: " \n Column(children: [ \n ${{column_children}} \n ]) \n",
    tag: "${{column_children}}"
  },

  {
    name: "fuikit-row",
    code: " \n Row(children: [ \n ${{row_children}} \n]) \n ",
    tag: "${{row_children}}"
  }

];

var resultOutput = "";

function getFlutterElement(className) {
  return flutterElements.filter((item) => { return item.name === className; })[0];
}

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
    overlap: 0.3,
    ondropactivate: function (event) {
      event.target.classList.add('drop-active');
    },
    ondragenter: function (event) {
      var draggableElement = event.relatedTarget;
      var dropzoneElement = event.target;

      dropzoneElement.classList.add('drop-target');
      draggableElement.classList.add('can-drop');

      //draggableElement.textContent = 'Dragged in';

    },
    ondragleave: function (event) {

      event.target.classList.remove('drop-target');
      event.relatedTarget.classList.remove('can-drop');
      //event.relatedTarget.textContent = 'Dragged out';
    },
    ondrop: function (event) {
      var draggableElement = event.relatedTarget;
      var dropzoneElement = event.target;

      draggableElement.textContent += ' Dropped';

      draggableElement.style.zIndex = '-1';
      draggableElement.style.transform = 'translate(' + 0 + 'px, ' + 0 + 'px)';
      draggableElement.style.height = '20px';

      dropzoneElement.appendChild(draggableElement);

      var newParentHeight = 60 * dropzoneElement.children.length;
      dropzoneElement.style.height = `${newParentHeight}px`;

    },
    ondropdeactivate: function (event) {
      event.target.classList.remove('drop-active');
      event.target.classList.remove('drop-target');
    }
  });

interact('.draggable')
  .draggable({
    inertia: true,
    autoScroll: true,
    listeners: { move: dragMoveListener }
  });


// ouakteli user yenzel aala button export laazem itelechargi fichier dart fih koll chay eli khedmou houa
// haja hedhi besh tsir ala deux methodes
// awel haja naamelou link fih fichier blob eli houa fih l code dart (function generateBlobLink) 
// theni haja lazem link hedheka isirlou l click programmatically (function createVirtualLink)

function generateBlobLink(text) {
  //variable hedha houa l output mtaa function hedhi
  var textFile = null;

  // donc houni l creation mtaa l blob mteena
  var data = new Blob([text], { type: 'text/plain' });

  // ken l textFile fih data donc revoke l url khater lazem textfile dima feragh 
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  // houni l textfile besh yekhou link eli besh tsir l creation mteou
  textFile = window.URL.createObjectURL(data);

  return textFile;

}

function invokeVirtualLink(fileName, content) {

  // naamelou creation mtaa balise <a>
  var link = document.createElement('a');

  // naatiwha esm l fichier eli besh tsirlou l export
  link.setAttribute('download', fileName);

  // nhotou link eli aamalna l creation mteeou l fouk
  link.href = generateBlobLink(content);

  // o nhotou l balise jdida mteena fel document
  document.body.appendChild(link);
  // houni naamelou creation mtaa mouse event click (click mtaa souris)
  var event = new MouseEvent('click');
  // o nhotou l click hedheka aal link mteena (comme quoi user nzel aal link) o akeka tetlaaalou l popup mtaa save as ..
  link.dispatchEvent(event);

  // o fel ekher nfaskhou link mel document
  document.body.removeChild(link);

}

// ken user nzel aal export
document.getElementById('export-button').addEventListener('click', function () {

  //invokeVirtualLink("export.dart", resultOutput);
  console.log(projectPath,resultOutput)
  synchronizeProject(projectPath,resultOutput);

});

// ["fuikit-text","fuikit-column","fuikit-row"]
flutterElements.map(item => { return item.name; }).forEach((className) => {

  let element = document.getElementsByClassName(className)[0];

  element.addEventListener('click', function () {

    const clone = element.cloneNode(true);
    clone.classList.add('draggable');
    clone.classList.add('droppable');

    if (document.getElementById("main-dropzone").children.length === 0) {

      document.getElementById("main-dropzone").appendChild(clone);

    } else {

      document.body.appendChild(clone);

    }

  });

});

document.getElementById('new-project-button').addEventListener('click', () => {

  vscode.postMessage({
    command: 'NEW_PROJECT',
    text: ' '
  });

})


window.addEventListener('message', event => {

  const message = event.data; // The JSON data our extension sent

  switch (message.command) {

    case 'ON_PROJECT_CREATED':

      projectPath = message.path
      projectName = message.name

      synchronizeProject(projectPath, flutterEmptySkeleton)

    break;
  }

});



document.getElementById('save-button').addEventListener('click', function () {

  var mainDropzone = document.getElementById("main-dropzone");


  mainDropzone.childNodes.forEach((item) => {

    console.log(item.childNodes)

    var parentElement;
    
    if (item.className) {

      parentElement = getFlutterElement(item.className.split(" ")[1]);

      resultOutput = flutterSkeleton.replace('${{body}}', parentElement.code);

    }

    var children = "";
    item.childNodes.forEach((item) => {

      if (item.className) {

        children += getFlutterElement(item.className.split(" ")[1]).code + ",";
        // Text("lorem ipsum"), Text("lorem ipsum")
      
      }

    });

    if (parentElement) {
        resultOutput = resultOutput.replace(parentElement.tag, children);
    }

  });


});


function synchronizeProject(projectPath, content) {

  vscode.postMessage({

    command: 'SYNCHRONIZE_PROJECT',
    projectPath: projectPath,
    content: content

  });

}
// Author:

/*******************************************************************************
                          Global UI Variables

  canvasDiv, textDiv, buttonDiv
  In the project's HTML, the divs that will contain various elements that may
  be created in setup(). Useful for styling (e.g., keeping them all centered).

  canvas
  The p5.js canvas. This is where all the magic happens!

  textP
  This is where you will print any kind of text (e.g., the label of an image).

  buttons
  If included, these are for user interaction (e.g., training a model, inputting
  data).
*******************************************************************************/

let canvasDiv;
let canvas;
let textDiv;
let textP;
let buttonDiv;
let happyButton;
let sadButton;
let trainButton;


/*******************************************************************************
                            Global ML Variables

  featureExtractor
  An object that can extract the features from the MobileNet model.

  classifier
  The new model we have created from MobileNet's features.

  video
  A video loaded into the program for object detection.

  happies, sads
  The number of times the user has clicked the "happy" and "sad" buttons.

  isModelReady, isTrainingComplete
  Initialized to false in setup(). Set to true when the model has been loaded
  successfully, or when training is complete.
*******************************************************************************/

let featureExtractor;
let classifier;
let video;
let happies;
let sads;
let isModelReady;
let isTrainingComplete;

/******************************************************************************
                                  setup()

  This is a built-in p5.js function that is automatically called when the
  program starts, just before draw(). This is used for initializing global
  variables, building the UI, and loading images, video, data, and models.
*******************************************************************************/

function setup() {
  canvasDiv = createDiv();
  canvas = createCanvas(640, 480);
  canvas.parent(canvasDiv);
  textDiv = createDiv();
  textP = createP("Model loading, please wait...");
  textP.parent(textDiv);
  buildButtons();
  happies = 0;
  sads = 0;
  isModelReady = false;
  isTrainingComplete = false;
  video = createCapture(VIDEO, videoReady);
}

/******************************************************************************
                                  draw()

  This is a built-in p5.js function that is automatically called in a repeated
  loop, just after setup(). This is used for handling animations, or running
  anything over and over again throughout a program.
*******************************************************************************/

function draw() {
  if(isModelReady) {
    image(video, 0, 0);
  }
  if(isTrainingComplete) {
    classifier.classify(canvas, gotResults);
  }
}

/******************************************************************************
                               buildButtons()

  Builds all of the app's buttons: happy, sad, and train. When the happy and
  sad buttons are clicked, they increment the happies and sads variables,
  respectively. They also add the current image on the canvas to the training
  data, with the label "Happy" or "Sad".

  When the training button is clicked, the model begins training on its current
  training data, and a function called whileTraining() is passed as a callback
  to run while this is happening.
*******************************************************************************/

function buildButtons() {
  buttonDiv = createDiv();
  happyButton = createButton("Happy");
  happyButton.parent(buttonDiv);
  happyButton.mousePressed(function () {
    happies += 1;
    textP.html("Happies: " + happies + " - Sads: " + sads);
    classifier.addImage(canvas, "Happy");
  });
  sadButton = createButton("Sad");
  sadButton.parent(buttonDiv);
  sadButton.mousePressed(function () {
    sads += 1;
    textP.html("Happies: " + happies + " - Sads: " + sads);
    classifier.addImage(canvas, "Sad");
  });
  trainButton = createButton("Train Model");
  trainButton.parent(buttonDiv);
  trainButton.mousePressed(function () {
    // new code blow

    textP.html("New model training, please wait...");
    classifier.train(whileTraining);
  });
  // new code below

  buttonDiv.style("display", "none");
}

/******************************************************************************
                               videoReady()

  A callback function. Called after the video has been loaded. First, we'll
  hide the video (remember, there will be two videos if we don't do this) using:

  video.display("display", "none");

  Then, now that we have video, we extract the features from the MobileNet
  model with:

  featureExtractor = ml5.featureExtractor("MobileNet", featureExtractorLoaded);
*******************************************************************************/

function videoReady() {
  video.style("display", "none");
  featureExtractor = ml5.featureExtractor("MobileNet", featureExtractorLoaded);
}

/******************************************************************************
                               featureExtractorLoaded()

  A callback function. Called after the MobileNet model has been loaded and its
  feature extractor has been created. Here we load the new classification model
  based on the features of MobileNet. We'll simply call the model "classifier",
  and pass modelReady() as a callback for when the model has loaded.
*******************************************************************************/

function featureExtractorLoaded() {
  classifier = featureExtractor.classification(canvas, modelReady);
}

/******************************************************************************
                                  modelReady()

  A callback function. Called after the classifier model has been loaded. Here
  we set isModelReady to true, print some instructional text ("Add training
  data, then click train!"), then reveal the button div so users can interact
  with the app.
*******************************************************************************/

function modelReady() {
  isModelReady = true;
  textP.html("Add training data, then click train!");
  buttonDiv.style("display", "block");
}

/******************************************************************************
                                  whileTraining()

  A callback function. Called continuously as the new classifier model is being
  trained. If there is a loss (error) value reported by the model's training
  process, log it to the console. Otherwise, the model is done training, so set
  isTrainingComplete to true, and show the save button. You should notice the
  loss value going down as the model becomes better at its classification task
  over time.
*******************************************************************************/

function whileTraining(loss) {
  if(loss) {
    console.log(loss);
  } else {
    // new code below

    isTrainingComplete = true;
  }
}

/******************************************************************************
                          gotResults(error, results)

  This function is a callback for classify(). In other words, after our new
  classifier model has classified the image, it should call this function next.

  parameters
  - error: If there was an error while running classify(), it should be brought
  up here and the function shouldn't do anything else.
  - results: The results of classify(). This will be an object we can use to
  get some useful information, such as the predicted label of the image, as
  well as how confident the model is about that assigned label.
*******************************************************************************/

function gotResults(error, results) {
  if(error) {
    console.error(error);
  } else {
    let label = results[0].label;
    let confidence = round(results[0].confidence, 2);
    textP.html("Label: " + label + " - Confidence " + confidence);
  }
}

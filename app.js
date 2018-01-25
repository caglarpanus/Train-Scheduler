
var config = {
    apiKey: "AIzaSyAo0qnRIlsTAFpNv_1iLBjl9z2fLRDpbCs",
    authDomain: "train-schedule-81433.firebaseapp.com",
    databaseURL: "https://train-schedule-81433.firebaseio.com",
    projectId: "train-schedule-81433",
    storageBucket: "train-schedule-81433.appspot.com",
    messagingSenderId: "386966865044"
  };

  firebase.initializeApp(config);

  var database = firebase.database().ref('trains');

  $("#add-train").click(function(){

    event.preventDefault();

    var trainNew = {

        name:$("#train-name-input").val().trim(),
        destination:$("#destination-input").val().trim(),
        firstTrainTime: moment($("#first-train-input").val().trim(), "HH:mm").format("X"),
        frequency: $("#frequency-input").val().trim(),
        
    }

    database.push(trainNew);

    console.log(trainNew);

  });

  database.on("child_added", function(childSnapshot, prevChildKey){


    var trainNew =  childSnapshot.val()
    console.log(trainNew);

    // Calculation for the next train's arrival.

    var tFrequency = $("#frequency-input").val().trim();
    var firstTime = moment($("#first-train-input").val().trim(), "HH:mm");
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    var tRemainder = diffTime % tFrequency;
    var tMinutesTillTrain = tFrequency - tRemainder;

    const nextTrain = moment().add(tMinutesTillTrain, "minutes");

    trainNew.nextArrival = nextTrain;

    trainNew.minAway = tMinutesTillTrain;

    

    $("#train-table").append(trainRowAdd(trainNew));

  });

  function trainRowAdd (train){

    var trow = $('<tr>');
	trow.append(`<td>${train.name}</td>`)
    	.append(`<td>${train.destination}</td>`)
    	.append(`<td>${train.frequency}</td>`)
    	.append(`<td>${train.nextArrival}</td>`)
    	.append(`<td>${train.minAway}</td>`)

	return trow;
  }



 $("#remove-train").click(function(){

    $("tr").last().remove();

 });
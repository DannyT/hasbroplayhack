////////// Server only logic //////////

Meteor.methods({
  updateScores : function(wasUserRight) {
    // increment score for all those who guessed correctly

    var opposite;
    if(wasUserRight == "win"){
      opposite = "fail";
    }else{
      opposite = "win";
    }

    Players.update({currentGuess:wasUserRight},
      { $inc:{score : 1}, $set: {currentGuess: ''}
    });

    // reset others

    Players.update({currentGuess:opposite}, {$set: {currentGuess: ''}});
    //Tracker.flush();
  }
});
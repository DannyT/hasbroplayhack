////////// Server only logic //////////

Meteor.methods({
  updateScores : function(wasUserRight) {
    // increment score for all those who guessed correctly
    Players.update({currentGuess:wasUserRight}, 
      { $inc:{score : 1} 
    });
    
    // reset all guesses
    Players.update({isAdmin:false}, 
      { $set: {currentGuess: ''}
    });
  }
})
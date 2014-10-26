////////////////////////////////
// Client side application logic
////////////////////////////////

// Helper functions
var loggedIn = function(){
  return Session.get('player_id');
};

var player = function () {
  return Players.findOne(Session.get('player_id'));
};

var isAdmin = function () {
  if(player())
    return player().isAdmin;
  return false;
}

var deletePlayer = function(playerId){
  Players.remove({_id:playerId});
}

var updateScores = function(wasUserRight) {
  Meteor.call('updateScores', wasUserRight);
}

// sign up form
Template.signupform.events({
  // when user submits username
  'submit': function () {
      console.log("Sign up");
      var username = $('input.js-username').val();

      // check if player already exists
      var player = Players.findOne({name:username});
      
      // if not create them
      var player_id = player ? player._id : Players.insert({name : username, isAdmin : username == 'admin', score : 0});
      
      // set player on session
      Session.set('player_id', player_id);
      return false;
  }
});

Template.signupform.helpers({show: function () {
  return !loggedIn();
}});

Template.loggedIn.helpers({show:function () {
  // only show lobby if we're not in a game
  return loggedIn() && !player().isAdmin;
}});

Template.loggedIn.helpers({player:function() {
  return player();
}});


// Leaderboard
Template.leaderboard.events({
  'click' : function (e) {
    if(e.altKey) {
      deletePlayer(this._id);
    }
  }
});

Template.leaderboard.helpers({show: function() {
  return isAdmin();
}});

Template.leaderboard.helpers({players: function () {
  return Players.find({isAdmin:false}, {sort: {score: -1, name: 1}});
}});

Template.outcomebar.events({
  'click .js-lost' : function(e) {
    updateScores('fail');
  },
  'click .js-won' : function(e) {
    updateScores('win');
  }
});

Template.outcomebar.helpers({show :function () {
  return isAdmin();
}});

// Non admin view
Template.yourscore.helpers({show: function () {
  return player() && !isAdmin();
},
player: function(){
 return player();
}
});

Template.votebar.events({
  'click button.js-will-win' : function() {
    Players.update({_id : Session.get('player_id')}, {$set: {currentGuess: 'win'}});
  },
  'click button.js-will-fail' : function() {
    Players.update({_id : Session.get('player_id')}, {$set: {currentGuess: 'fail'}});
  }
});

Template.votebar.helpers({show: function () {
  return player() && !isAdmin();
}});

Template.votebar.helpers(
    {
      winSelected: function () {
        return player().currentGuess == 'win' ? 'selected' : '';
      }
    });

Template.votebar.helpers({
  failSelected: function () {
    return player().currentGuess == 'fail' ? 'selected' : '';
  }
});


//////
////// Initialization
//////

Meteor.startup(function () {

});
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

// sign up form
Template.signupform.events({
  // when user submits username
  'click input.js-signup': function () {
      
      var username = $('input.js-username').val();

      // check if player already exists
      var player = Players.findOne({name:username});
      
      // if not create them
      var player_id = player ? player._id : Players.insert({name : username, isAdmin: username == 'admin'});
      
      // set player on session
      Session.set('player_id', player_id);
  }
});

Template.signupform.show = function () {
  return !loggedIn();
}

Template.loggedIn.show = function () {
  // only show lobby if we're not in a game
  return loggedIn();
};

Template.loggedIn.player = function() {
  return player();
};


// Leaderboard
Template.leaderboard.events({
  'click': function (e) {
    if(e.altKey) {
      deletePlayer(this._id);
    }
    else {
      Session.set('selected_player', this._id);
    }
  }
});

Template.leaderboard.show = function() {
  return isAdmin();
}

Template.leaderboard.players = function () {
  return Players.find({isAdmin:false}, {sort: {score: -1, name: 1}});
};

Template.player.selected = function () {
  return Session.equals('selected_player', this._id) ? 'selected' : '';
};

// Admin view
Template.outcomebar.show = function () {
  return isAdmin();
};

// Non admin view
Template.yourscore.show = function () {
  return player() && !isAdmin();
};

Template.votebar.events({
  'click button.js-will-win' : function() {
    Players.update({_id : Session.get('player_id')}, {$set: {currentGuess: true}});
  },
  'click button.js-will-fail' : function() {
    Players.update({_id : Session.get('player_id')}, {$set: {currentGuess: false}});
  }
});

Template.votebar.show = function () {
  return player() && !isAdmin();
};

Template.votebar.winSelected = function () {
  return player().currentGuess ? 'selected' : '';
};

Template.votebar.failSelected = function () {
  return !player().currentGuess ? 'selected' : '';
};


//////
////// Initialization
//////

Meteor.startup(function () {
  
});
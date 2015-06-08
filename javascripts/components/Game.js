
var React = require('react');
var DocumentTitle = require('react-document-title');
var classSet = require('react-classset');

var Router = require('react-router');
var Navigation = Router.Navigation;

var Comment = require('./Comment');

var StoreListener = require('./mixins/StoreListener');
var GameStore = require('../stores/GameStore');
var GamesStore = require('../stores/GamesStore');

var getGame = require('../actions/getGame');
var upvoteGame = require('../actions/upvoteGame');
var gameName = require('../actions/gameName');

var If = require('./helpers/If');
var Loading = require('./helpers/Loading');
var assign = require('object-assign');

var Game = React.createClass({
  mixins: [Navigation, Router.State, StoreListener],

  statics: {
    storeListeners: [GameStore]
  },

  onClose: function(e) {
    if(this.isActive('index')) {
      this.transitionTo('index');
    } else if(this.isActive('submissions')) {
      this.transitionTo('submissions');
    }
  },

  getInitialState: function() {
    return assign(window.dispatcher.getStore(GameStore).getState());
  },

  onChange: function() {
    this.setState(assign(window.dispatcher.getStore(GameStore).getState()));
  },

  componentDidMount: function() {
    getGame(this.props.params.gameId, window.dispatcher);

    React.findDOMNode(this.refs.gameContent).focus();
  },

  modalClick: function(e){
    e.stopPropagation();
  },

  vote: function(){
    upvoteGame(this.state.game.id, true, window.dispatcher);
  },

  keyPress: function(e){
    var gamePath = "";
    if(this.isActive('index')) {
      gamePath = "game";
    } else if(this.isActive('submissions')) {
      gamePath = "submission";
    }

    if(e.keyCode === 37) {
      var p = window.dispatcher.getStore(GamesStore).getPreviousGame(this.state.game.id);
      this.transitionTo(gamePath, {name: gameName(p.name), gameId: p.id});
      getGame(p.id, dispatcher);
    } else if(e.keyCode === 39) {
      var n = window.dispatcher.getStore(GamesStore).getNextGame(this.state.game.id);
      this.transitionTo(gamePath, {name: gameName(n.name), gameId: n.id});
      getGame(n.id, dispatcher);
    }
  },

  render: function(){
    var voteClasses = classSet({
      'game-upvote': true,
      'game-upvoted': this.state.game.upvoted
    });

    var images = this.state.game.images.map((link, i) => {
      return (
        <div key={i} className="game-screenshot">
          <img src={link}/>
        </div>
      );
    });

    var upvoters = this.state.upvoters.map((avatar, i) => {
      return (
        <div key={i} className="game-upvoter">
          <img src={avatar}/>
        </div>
      );
    });

    // <button className="button-steam button-icon"><img src="http://i.imgur.com/1uzEf94.png"/> Play on Steam</button>

    var title = this.state.game.name || "Game";

    return (
      <DocumentTitle title={title + " | Gamedation"}>
        <div className="game-overlay" onClick={this.onClose}>
          <div className="game">
            <div tabIndex="0" ref="gameContent" className="game-content" onKeyDown={this.keyPress} onClick={this.modalClick}>
              <div className="game-header">
                <div className="game-vote" onClick={this.dontPropagate}>
                  <div className={voteClasses} onClick={this.vote}></div>
                  <div className="game-points">{this.state.game.points}</div>
                </div>
                <div className="game-info">
                  <div className="game-title">{this.state.game.name}</div>
                  <div className="game-description">{this.state.game.description}</div>
               </div>
              </div>
              <div className="game-all-info">
                <Loading loaded={this.state.game.name != false}>
                  <div>
                    <div className="game-section">
                      <If test={this.state.game.site === "gamejolt"}>
                        <a target="_blank" href={this.state.game.link} className="button-gamejolt button-icon button-link"><img src="https://s4i8m4c6.ssl.hwcdn.net/app/img/favicon-1.689bf878.png"/> Play on GameJolt</a>
                      </If>
                      <If test={this.state.game.site === "steam"}>
                        <a target="_blank" href={this.state.game.link} className="button-steam button-icon button-link"><img src="http://i.imgur.com/1uzEf94.png"/> Play on Steam</a>
                      </If>
                      <If test={this.state.game.site === "other"}>
                        <a target="_blank" href={this.state.game.link} className="button-black button-link">Play game</a>
                      </If>
                    </div>

                    <div className="game-section">
                      <div className="game-section-header">available for</div>
                      <If test={this.state.game.platforms.windows}>
                        <div className="game-platform-windows"></div>
                      </If>
                      <If test={this.state.game.platforms.mac}>
                        <div className="game-platform-mac"></div>
                      </If>
                      <If test={this.state.game.platforms.linux}>
                        <div className="game-platform-linux"></div>
                      </If>
                      <If test={this.state.game.platforms.browser}>
                        <div className="game-platform-browser"></div>
                      </If>
                      <If test={this.state.game.platforms.iOS}>
                        <div className="game-platform-ios"></div>
                      </If>
                      <If test={this.state.game.platforms.android}>
                        <div className="game-platform-android"></div>
                      </If>
                    </div>

                    <div className="game-section">
                      <div className="game-section-header">upvoters</div>
                      {upvoters}
                    </div>

                    <div className="game-section game-screenshots">
                      <div className="game-section-header">media</div>
                      {images}
                    </div>

                    <div className="game-section">
                      <div className="game-section-header">comments</div>
                      <Comment/>
                      <Comment reply={true}/>
                      <Comment/>
                      <Comment/>

                      <Comment/>

                      <Comment/>

                      <Comment/>

                      <Comment/>
                    </div>
                  </div>
                </Loading>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }

});

module.exports = Game;

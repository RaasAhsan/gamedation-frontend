
var React = require('react');
var Router = require('react-router');
var classSet = require('react-classset');

var Comment = React.createClass({

  propTypes: {
    reply: React.PropTypes.bool
  },

  render: function(){
    var commentClasses = classSet({
      'game-comment': true,
      'game-comment-reply': this.props.reply
    });

    return (
      <div className={commentClasses}>
        <div className="game-comment-avatar">
          <img src="https://secure.gravatar.com/avatar/802540db8043503a3c3ead05d51c0139?s=64"/>
        </div>
        <div className="game-comment-content">
          <div className="game-comment-poster">Posted by Agro, 3 days ago</div>
          Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.  
        </div>
      </div>
    );
  }

});

module.exports = Comment;
//cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react.min.js
//cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react-dom.min.js
//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// + babel

// FCC: Build a Camper Leaderboard
// User Story: I can see a table of the Free Code Camp campers who've earned the most brownie points in the past 30 days.
// User Story: I can see how many brownie points they've earned in the past 30 days, and how many they've earned total.
// User Story: I can toggle between sorting the list by how many bronwie points they've earned in the past 30 days and by how many brownie points they've earned total.

var Everything = React.createClass({
  getInitialState: function() {
    return {
      isRecentActive: true,
      isAlltimeActive: false
    };
  },
  handleClick: function(e) {
    if(e.target.id === 'recent') {
      var recentActive = !this.state.isRecentActive;
      this.setState({ isRecentActive: recentActive, 
                      isAlltimeActive: false });
      e.target.style.background = '#bad9ce';
      document.getElementById('alltime').style.background = '#ebf4f1';
      console.log(e.target.style.background);
    }
    else if(e.target.id === 'alltime') {
       var alltimeActive = !this.state.isAlltimeActive;
       this.setState({ isAlltimeActive: alltimeActive,
                       isRecentActive: false });
       e.target.style.background = '#bad9ce';
       document.getElementById('recent').style.background = '#ebf4f1';
    }
  },
  
  render: function() {
    var recentUrl = '//fcctop100.herokuapp.com/api/fccusers/top/recent';
    var alltimeUrl = '//fcctop100.herokuapp.com/api/fccusers/top/alltime';
    var url = '';

    if(this.state.isAlltimeActive) {
      url = alltimeUrl;
    }  
    else {
      url = recentUrl;
    }
    
    return (
      <div className='everything'>
        <div className='bigTitle'>
          <a href='//freecodecamp.com'>
          <img className='bigTitle__image' src='//res.cloudinary.com/timolawl/image/upload/v1457483901/FCClogo.png' /></a>
        </div>
        <div className='bigList'>  
          <table>
            <caption className='heading__title'>Leaderboard</caption>
            <thead>
              <tr className='heading__sortBar'>
                <th className='sortBar__index'>#</th>
                <th colSpan="2" className='sortBar__name'>Camper Name</th>
                <th id='recent' className='sortBar__recent' onClick={this.handleClick}>Points - past 30 days</th>
                <th id='alltime' className='sortBar__alltime' onClick={this.handleClick}>Points - all time</th>
              </tr>
            </thead>
              <TopCampers url={url} />
          </table>
        </div>
      </div>
    );
  }
});

var Entry = React.createClass({
  getIndex: (function() {
    var index = 0;
    return function() { if(index===100) index -= 100; return ++index };
  }()),
  render: function() {
    return (
      <tr className='entry'>
        <td className='entry__index'>
          {this.getIndex()}
        </td>
        <td className='entry__avatar'>
          <img className='entry__avatar--image' src={this.props.img} height='50' width='50' />
        </td>
        <td className='entry__username'>
          <a href={'//freecodecamp.com/' + this.props.username}>{this.props.username}</a>
        </td>
        <td className='entry__recentPoints'>
          {this.props.recent}
        </td>
        <td className='entry__alltimePoints'>
          {this.props.alltime}
        </td>
      </tr>
    );
  }
});

var EntryList = React.createClass({
  render: function() {
    var listNodes = this.props.data.map(function(listItem, index) {
      return (
         /* <div className='entry__index'>{index+1}</div> */
          <Entry key={index} img={listItem.img} username={listItem.username} recent={listItem.recent} alltime={listItem.alltime}>
          </Entry>
      );
    });
    return (
      <tbody className='entryList'>
        {listNodes}
      </tbody>
    );
  }
});

var TopCampers = React.createClass({
  getInitialState: function() {
    return {data: []};        
  },
  updateContent: function() {
     $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  
  componentDidMount: function() {
    this.updateContent();
  },        
  render: function() {
    if(this.state.url !== this.props.url) {
      this.updateContent();
    }
    return (
        <EntryList data={this.state.data} />
    );
  }
});

ReactDOM.render(
  <Everything />, document.body
);

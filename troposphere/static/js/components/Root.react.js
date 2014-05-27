/** @jsx React.DOM */

define(
  [
    'react',
    './Header.react',
    './sidebar/Sidebar.react',
    './Footer.react',
    './Notifications.react'
  ],
  function (React, Header, Sidebar, Footer, Notifications) {

    return React.createClass({

      getInitialState: function () {
        return {
          loggedIn: this.props.session.isValid()
        };
      },

      render: function () {
        return (
          <div>
            <Header profile={this.props.profile}/>
            <Sidebar loggedIn={this.state.loggedIn}
                     currentRoute={this.props.route}
            />
            <Notifications/>
            <div id='main'>
              {this.props.content}
            </div>
            <Footer/>
          </div>
        );
      }

    });

  });
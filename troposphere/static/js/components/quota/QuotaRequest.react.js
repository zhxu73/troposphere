define(function (require) {
  "use strict";

  var React = require('react'),
      Router = require('react-router'),
      stores = require('stores'),
      RouteHandler = Router.RouteHandler;

  return React.createClass({

    mixins: [Router.State],

    handleClick: function() {
        this.props.onClick(this);
    },

    render: function () {
      var id = this.props.id;
      var request = stores.QuotaRequestStore.get(id);

      if(!request) return <div className="loading"></div>;

      var jsonRequest = request.toJSON();

      return (
          <tr>
              <td className="user-name">{jsonRequest['created_by']}</td>
              <td className="status">{jsonRequest['status']}</td>
              <td className="quota-admin-message">{jsonRequest['admin_message']}</td>
              <td className="quota">{jsonRequest['quota']}</td>
              <td className="request">{jsonRequest['request']}</td>
              <td className="description">{jsonRequest['description']}</td>
          </tr>
      );
    }


  });

});
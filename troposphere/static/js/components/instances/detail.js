define(['react', 'components/page_header', 'components/mixins/loading',
'models/instance', 'rsvp', 'components/common/time',
'controllers/instances', 'url'], function(React, PageHeader, LoadingMixin,
Instance, RSVP, Time, InstanceController, URL) {

    var InstanceAttributes = React.createClass({
        renderPair: function(k, v) {
            return [React.DOM.dt({}, k), React.DOM.dd({}, v)];
        },
        renderIdentity: function(identity) {
            var text = identity.id + " on provider ";
            if (this.props.providers) {
                var provider = this.props.providers.get(identity.provider);
                text += provider.get('name');
            } else
                text += identity.provider;
            return text;
        },
        render: function() {
            var instance = this.props.instance;
            var addr = instance.get('public_ip_address');
            return React.DOM.div({},
                React.DOM.h2({}, "Details"),
                React.DOM.dl({},
                    this.renderPair("Status", instance.get('status')),
                    this.renderPair("IP Address", addr ? addr : React.DOM.em({}, "Unknown")),
                    this.renderPair("Identity", this.renderIdentity(instance.get('identity'))),
                    this.renderPair("ID", instance.id),
                    this.renderPair("Date Launched", Time({date: instance.get('start_date')}))));
        }
    });

    var InstanceLinks = React.createClass({
        renderLink: function(text, url) {
            return React.DOM.li({},
                React.DOM.a({href: url,
                    target: '_blank', 
                    className: 'new-window'}, text));
        },
        render: function() {
            var instance = this.props.instance;
            return React.DOM.div({},
                React.DOM.h2({}, "Links"),
                React.DOM.ul({},
                    this.renderLink("Web Shell", instance.get('shell_url')),
                    this.renderLink("Remote Desktop", instance.get('vnc_url'))));
        }
    });

    var ActionList = React.createClass({
        renderButton: function(text, onClick, disabled) {
            return React.DOM.button({className: 'btn btn-default',
                                     onClick: onClick,
                                     disabled: disabled},
                                     text);
        },
        renderStartStopButton: function() {
            if (!this.props.is_openstack)
                return null;

            if (this.props.instance.get('status') == 'shutoff')
                return this.renderButton("Start");
            else
                return this.renderButton("Stop");
        },
        renderSuspendButton: function() {
            if (!this.props.is_openstack)
                return null;

            if (this.props.instance.get('status') == 'suspended')
                return this.renderButton('Resume');
            else
                return this.renderButton('Suspend');
        },
        renderRebootButton: function() {
            // TODO: Make a button group that works in React
            var disabled = !this.props.instance.get('is_active');
            var items = [React.DOM.li({}, React.DOM.a({}, "Soft reboot"))];
            if (this.props.is_openstack)
                items.push(React.DOM.li({}, React.DOM.a({}, "Hard reboot")));

            return React.DOM.div({className: 'btn-group'},
                React.DOM.button({className: 'btn btn-default dropdown-doggle', 'data-toggle': 'dropdown', disabled: disabled},
                    "Reboot ", React.DOM.span({className: 'caret'})),
                React.DOM.ul({className: 'dropdown-menu', role: 'menu'}, items));
        },
        renderTerminateButton: function() {
            var handleClick = InstanceController.terminate.bind(null, this.props.instance);
            return this.renderButton("Terminate", handleClick);
        },
        renderResizeButton: function() {
            if (!this.props.is_openstack)
                return null;

            var disabled = this.props.instance.is_resize();
            return this.renderButton("Resize", null, disabled);
        },
        renderImageRequestButton: function() {
            var disabled = !this.props.instance.get('is_active');
            return this.renderButton("Image", null, disabled);
        },
        renderReportButton: function() {
            var disabled = !this.props.instance.get('is_active');
            var onClick = function() {
                var url = URL.reportInstance(this.props.instance);
                Backbone.history.navigate(url, {trigger: true});
            }.bind(this);
            return this.renderButton("Report", onClick, disabled);
        },
        render: function() {
            return React.DOM.div({},
                React.DOM.h2({}, "Actions"),
                React.DOM.div({},
                    this.renderStartStopButton(), // OS only
                    this.renderSuspendButton(), // OS only
                    this.renderRebootButton(),
                    this.renderTerminateButton(),
                    this.renderResizeButton(), // OS only
                    this.renderImageRequestButton(),
                    this.renderReportButton()));
        }
    });

    var InstancePage = React.createClass({
        render: function() {
            var instance = this.props.instance;
            return React.DOM.div({},
                PageHeader({title: "Instance: " + instance.get('name_or_id')}),
                ActionList({instance: instance}),
                InstanceAttributes({instance: instance, 
                    providers: this.props.providers}),
                InstanceLinks({instance: instance}));
        }
    });
    
    var InstanceDetail = React.createClass({
        componentDidMount: function() {
            if (!this.props.instance)
                this.props.onRequestInstance();
        },
        render: function() {
            if (this.props.instance)
                return InstancePage({instance: this.props.instance, providers: this.props.providers});
            else
                return React.DOM.div({className: 'loading'});
        }
    });

    return InstanceDetail;
});

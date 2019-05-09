import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import globals from 'globals';

export default React.createClass({
    displayName: "InstanceStopModal",

    mixins: [BootstrapModalMixin],

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        this.hide();
        this.props.onConfirm();
    },

    //
    // Render
    // ------
    //

    renderBody: function() {
        return (
            <div>
                <p>{"Would you like to stop this instance?"}</p>
                <div className="alert alert-warning clearfix" role="alert">
                <p>
                    <strong>NOTE:</strong> A stopped instance will still consume
                    some of your resources. To fully preserve your resources,
                    please shelve or suspend.
                </p>
                { globals.EXTERNAL_ALLOCATION &&
                    <a
                        style={{marginTop: "8px"}}
                        className="pull-right"
                        target="_blank"
                        href="http://wiki.jetstream-cloud.org/XSEDE+Service+Units+and+Jetstream"
                    >
                        LEARN MORE
                    </a>
                }
                </div>
            </div>
        );
    },

    render: function() {
        return (
            <div className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.renderCloseButton()}
                            <h1 className="t-title">Stop Instance</h1>
                        </div>
                        <div className="modal-body">{this.renderBody()}</div>
                        <div className="modal-footer">
                            <RaisedButton
                                style={{marginRight: "10px"}}
                                onTouchTap={this.cancel}
                                label="Cancel"
                            />
                            <RaisedButton
                                primary
                                onTouchTap={this.confirm}
                                label="Yes, stop this instance"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

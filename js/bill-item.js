/** @jsx React.DOM */

var ESCAPE_KEY = 27;

var BillItem = React.createClass({
    handleSubmit: function () {
        var val = this.state.editText.trim();
        if (val) {
            this.props.onSave(val);
            this.setState({editText: val});
        } else {
            this.props.onDestroy();
        }
        return false;
    },

    handleEdit: function () {
        // react optimizes renders by batching them. This means you can't call
        // parent's `onEdit` (which in this case triggeres a re-render), and
        // immediately manipulate the DOM as if the rendering's over. Put it as a
        // callback. Refer to app.js' `edit` method
        this.props.onEdit(function () {
            var node = this.refs.editField.getDOMNode();
            node.focus();
            node.setSelectionRange(node.value.length, node.value.length);
        }.bind(this));
        this.setState({editText: this.props.item.title});
    },

    handleKeyDown: function (event) {
        if (event.which === ESCAPE_KEY) {
            this.setState({editText: this.props.item.title});
            this.props.onCancel();
        } else if (event.which === ENTER_KEY) {
            this.handleSubmit();
        }
    },

    handleChange: function (event) {
        this.setState({editText: event.target.value});
    },

    getInitialState: function () {
        return {editText: this.props.item.title};
    },

    /**
     * This is a completely optional performance enhancement that you can implement
     * on any React component. If you were to delete this method the app would still
     * work correctly (and still be very performant!), we just use it as an example
     * of how little code it takes to get an order of magnitude performance improvement.
     */
    shouldComponentUpdate: function (nextProps, nextState) {
        return (
            nextProps.todo !== this.props.item ||
            nextProps.editing !== this.props.editing ||
            nextState.editText !== this.state.editText
            );
    },

    render: function () {

        var leftQuantity = this.props.model.getItemLeftQuantity(this.props.item);

        return (
            <li className={React.addons.classSet({
                completed: this.props.item.completed,
                editing: this.props.editing
            })}>
                <div className="view">
                    <input
                    className="toggle"
                    type="checkbox"
                    checked={this.props.item.completed}
                    onChange={this.props.onToggle}
                    />
                    <label onDoubleClick={this.handleEdit}>
							{this.props.item.title}|{this.props.item.count}|{this.props.item.amount} Left: {leftQuantity}
                    </label>
                    <button className="destroy" onClick={this.props.onDestroy} />
                </div>
                <input
                ref="editField"
                className="edit"
                value={this.state.editText}
                onBlur={this.handleSubmit}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                />
            </li>
            );
    }

});
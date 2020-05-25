import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {TextField, Button} from '@shopify/polaris'
import {changeOrderNote} from '../../../services/api/OrderAdminServices'

class OrderNote extends Component {
    state = {
        note: '',
        loading: false,
    }

    componentDidMount() {
        this._mapNote(this.props.note)
    }

    componentDidUpdate() {
        if (this.props.isOrderChanged) this._mapNote(this.props.note)
    }

    _mapNote = (note) => this.setState({note})

    _onChange = (note) => {
        this.setState({note}, () => this._changeOrder())
    }

    _changeOrder = () => {
        const {note} = this.state
        this.props.onChange({note}, 'notes')
    }

    _clickSubmit = async () => {
        const {note, loading} = this.state
        const {orderId} = this.props
        if (loading) return

        try {
            this.setState({loading: true})

            const {success, message} = await changeOrderNote(orderId, {
                note,
            })
            this.setState({loading: false})
            if (!success) return alert(message)
        } catch (e) {
            this.setState({loading: false})
            alert(e.message)
        }
    }

    render() {
        const {loading} = this.state

        return (
            <>
                <TextField
                    value={this.state.note}
                    label="Note"
                    onChange={this._onChange}
                    multiline
                />
                <div className="pt-2">
                    <Button
                        primary
                        disabled={loading}
                        onClick={this._clickSubmit}
                    >
                        Save
                    </Button>
                </div>
            </>
        )
    }
}

OrderNote.propTypes = {
    onChange: PropTypes.func.isRequired,
    note: PropTypes.string.isRequired,
    isOrderChanged: PropTypes.bool.isRequired,
    orderId: PropTypes.number.isRequired,
}

export default OrderNote

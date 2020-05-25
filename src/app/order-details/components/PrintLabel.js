import React, {Component, createRef} from 'react'
import ReactToPrint from 'react-to-print'
import {Document, Page} from 'react-pdf/dist/entry.webpack'

class ComponentToPrint extends React.Component {
    onDocumentLoadSuccess = () => {
        this.props.loadSuccess()
    }

    render() {
        return (
            <Document
                file={this.props.link}
                // onLoadSuccess={this.onDocumentLoadSuccess}
                onSourceSuccess={this.onDocumentLoadSuccess}
            >
                <Page pageNumber={1} />
            </Document>
        )
    }
}

export default class PrintLabel extends Component {
    state = {
        loaded: false,
    }

    button = createRef()

    componentDidUpdate(prevProps, prevState) {
        // if (!prevState.loaded && this.state.loaded) this.button.click()
        window.open(this.props.link, 'PRINT', 'height=400,width=600')
    }

    removeLink = () => {
        this.props.removeLink()
    }

    _loadSuccess = () => {
        this.setState({loaded: true}, () => {
            this.setState({loaded: false})
        })
    }

    render() {
        return (
            <>
                <ReactToPrint
                    trigger={() => (
                        <button ref={(el) => (this.button = el)}></button>
                    )}
                    onAfterPrint={this.removeLink}
                    content={() => this.componentRef}
                />
                <div style={{display: 'none'}}>
                    <ComponentToPrint
                        loadSuccess={this._loadSuccess}
                        ref={(el) => (this.componentRef = el)}
                        link={this.props.link}
                    />
                </div>
            </>
        )
    }
}

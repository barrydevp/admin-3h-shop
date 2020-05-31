import React from 'react'
import {Badge, DataTable, Stack, TextStyle} from '@shopify/polaris'
import moment from 'moment'
import PropTypes from 'prop-types'
import UpdateWarrantyModal from './UpdateWarrantyModal'

const defaultHeader = ['Code', 'Month', 'Trial', 'Description', 'Category id']
const defaultColumnContentTypes = ['text', 'text', 'text', 'text', 'text']

const _formatDate = (date, format = 'llll') =>
    date ? moment(date).format(format) : ''

class WarrantyTable extends React.Component {
    state = {
        warrantyId: 0,
    }

    toggleUpdate = (_id) => () => {
        this.setState({
            warrantyId: _id,
        })
    }

    makeRow = (warranties) => {
        const rows = []

        warranties.forEach(({_id, code, description, month, trial, category_id}) => {
            const codeCol = (
                <span className="cursor-pointer text-blue-500" onClick={this.toggleUpdate(_id)}>
                    {code}
                </span>
            )

            const descriptionCol = description

            const monthCol = (
                <Stack spacing="none">
                    <Badge
                        status={'attention'}
                    >
                        {month + ' months'}
                    </Badge>
                    ))}
                </Stack>
            )

            const trialCol = (
                <Stack spacing="none">
                    <Badge
                        status={'info'}
                    >
                        {trial + ' days'}
                    </Badge>
                    ))}
                </Stack>
            )

            const categoryIdCol = (
                <TextStyle variation="positive">
                    {category_id}
                </TextStyle>
            )

            rows.push([
                codeCol,
                monthCol,
                trialCol,
                descriptionCol,
                categoryIdCol,
            ])
        })

        return rows
    }

    makeColumns = () => {
        const vHeading = [...defaultHeader]
        const vColumnContentTypes = [...defaultColumnContentTypes]

        return {
            heading: vHeading.map((text) => <b>{text}</b>),
            columnContentTypes: vColumnContentTypes,
        }
    }

    render() {
        const {warranties, page, limit, total, onUpdateWarranty} = this.props
        const {warrantyId} = this.state

        const rows = this.makeRow(warranties || [])
        const {heading, columnContentTypes} = this.makeColumns()
        const footer = `Showing ${(page - 1) * limit + 1} - ${
            page * limit
        } of ${total} results`
        return (
            <React.Fragment>
                <DataTable
                    headings={heading}
                    rows={rows}
                    columnContentTypes={columnContentTypes}
                    footerContent={footer}
                />
                <UpdateWarrantyModal warrantyId={warrantyId} toggle={this.toggleUpdate(0)}
                                     onUpdateWarranty={onUpdateWarranty} warranties={warranties}/>
            </React.Fragment>
        )
    }
}

WarrantyTable.propTypes = {
    warranties: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    query: PropTypes.object.isRequired,
    onUpdateWarranty: PropTypes.func.isRequired,
}

export default WarrantyTable

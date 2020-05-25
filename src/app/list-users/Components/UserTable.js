import React from 'react'
import {Badge, DataTable, Stack, TextStyle} from '@shopify/polaris'
import {Link} from 'react-router-dom'
import moment from 'moment'
import PropTypes from 'prop-types'
import {getLabelUserRole} from '../../../static/userRoles'

const defaultHeader = ['Name', 'Email', 'Role', 'Status', 'Updated', 'Created']
const defaultColumnContentTypes = ['text', 'text', 'text', 'text', 'text']

const _formatDate = (date) => {
    return date ? moment(date).format('llll') : ''
}

class UserTable extends React.Component {
    getUserDetailLink = (user) => {
        const {_id} = user
        return `/d/users/${_id}`
    }

    makeRow = (users) => {
        const rows = []

        users.forEach((user) => {
            const nameCol = (
                <span className="cursor-pointer text-blue-500">
                    <Link to={this.getUserDetailLink(user)}>{user.name}</Link>
                </span>
            )

            const roleLabel = getLabelUserRole(user.role)

            const roleCol = (
                <Stack spacing="none">
                    <Badge
                        status={roleLabel === 'Admin' ? 'attention' : 'info'}
                    >
                        {roleLabel}
                    </Badge>
                    ))}
                </Stack>
            )
            const statusCol = (
                <Stack spacing="none">
                    <Badge
                        status={user.status === 'active' ? 'success' : ''}
                        progress={
                            user.status === 'active' ? 'complete' : 'incomplete'
                        }
                    >
                        {user.status}
                    </Badge>
                    ))}
                </Stack>
            )
            const emailCol = <TextStyle>{user.email}</TextStyle>
            const updatedAtCol = (
                <TextStyle variation="positive">
                    {_formatDate(user.updated_at)}
                </TextStyle>
            )
            const createdAtCol = (
                <TextStyle variation="strong">
                    {_formatDate(user.created_at)}
                </TextStyle>
            )

            rows.push([
                nameCol,
                emailCol,
                roleCol,
                statusCol,
                updatedAtCol,
                createdAtCol,
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
        const {users, page, limit, total} = this.props

        const rows = this.makeRow(users || [])
        const {heading, columnContentTypes} = this.makeColumns()
        const footer = `Showing ${(page - 1) * limit + 1} - ${
            page * limit
        } of ${total} results`
        return (
            <DataTable
                headings={heading}
                rows={rows}
                columnContentTypes={columnContentTypes}
                footerContent={footer}
            />
        )
    }
}

UserTable.propTypes = {
    users: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    query: PropTypes.object.isRequired,
}

export default UserTable

import React from 'react'
import {ChoiceList, Filters} from '@shopify/polaris'
import PropTypes from 'prop-types'
import keys from '../static/keys'

const _queryValueKeys = {
    name: 'Name',
    tags: 'Tags',
}

class FilterTableProduct extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchBy: 'name',
            datePicker: {
                month: (props[`start_date`] || new Date()).getMonth(),
                year: (props[`end_date`] || new Date()).getFullYear(),
            },
        }
    }

    onChangeText = (key) => (v) => this.props.onChangeQuery({[key]: v}, true)

    onClearQuery = (key) => (v) => this.props.onChangeQuery({[key]: ''}, true)

    onQueryClearAll = () => {
        const {onChangeQuery} = this.props

        const newQuery = {
            name: '',
            tags: '',
            created_at_from: '',
            created_at_to: '',
        }

        // const newPaging = {
        //     page: 1,
        //     limit: 20,
        // }

        onChangeQuery(newQuery, true)
        // onChangePaging(newPaging, true)
    }

    getFilter = () => {
        const {searchBy} = this.state

        return [
            {
                key: 'searchBy',
                label: 'Search By',
                filter: (
                    <ChoiceList
                        title="Search By"
                        titleHidden
                        choices={Object.keys(_queryValueKeys).map((key) => ({
                            value: key,
                            label: _queryValueKeys[key],
                        }))}
                        selected={searchBy}
                        onChange={([v]) => this.setState({searchBy: v})}
                    />
                ),
                shortcut: true,
            }
        ]
    }

    getAppliedFilters = () => {
        const {query: filter} = this.props

        const result = []

        Object.keys(filter).forEach((key) => {
            if (key === 'end_date' || key === 'start_date') return

            const label = keys[key]
            if (!label) return ``

            const value = filter[key]
            if (!value) return

            result.push({
                key,
                label: `${label}: ${value.toString()}`,
                onRemove: this.onClearQuery(key),
            })
        })

        return result
    }

    render() {
        const {loading, query} = this.props
        const {searchBy} = this.state

        const filter = this.getFilter()
        const appliedFilters = this.getAppliedFilters()

        return (
            <Filters
                disabled={loading}
                queryValue={query[searchBy]}
                filters={filter}
                queryPlaceholder={`Find by ${_queryValueKeys[searchBy]}`}
                appliedFilters={appliedFilters}
                onQueryChange={this.onChangeText(searchBy)}
                onQueryClear={() => this.props.onChangeQuery({[searchBy]: ''})}
                onClearAll={this.onQueryClearAll}
            />
        )
    }
}

FilterTableProduct.propTypes = {
    loading: PropTypes.bool.isRequired,
    query: PropTypes.object.isRequired,
    onChangeQuery: PropTypes.func.isRequired,
    onChangePaging: PropTypes.func.isRequired,
}

export default FilterTableProduct

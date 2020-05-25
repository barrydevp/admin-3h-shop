export const DisplayUserRoles = [
    {value: 0, label: 'Unknown', stringValue: ''},
    {value: 1, label: 'Admin', stringValue: 'admin'},
    {value: 11, label: 'User', stringValue: 'user'},
    {value: 21, label: 'Seller', stringValue: 'seller'},
]

export const getLabelUserRole = role => {
    return (DisplayUserRoles.find(_role => _role.value === parseInt(role)) || DisplayUserRoles[0]).label
}

export const getStringValueOfRole = role => {
    return (DisplayUserRoles.find(_role => _role.value === parseInt(role)) || DisplayUserRoles[0]).stringValue
}

export const getValueFromStringValueOfRole = stringValue => {
    return (DisplayUserRoles.find(_role => _role.stringValue === stringValue) || DisplayUserRoles[0]).value
}

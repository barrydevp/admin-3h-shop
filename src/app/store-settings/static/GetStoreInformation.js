import {getStoreSettings} from '../../../services/api/StoreSettingServices'

const getStoreInformation = async (keys) => {
    try {
        const {success, data, message} = await getStoreSettings(keys)
        if (!success) {
            alert(message)
        }
        return data.reduce((itemList, item) => {

            return {
                ...itemList,
                [item.key]: item
            }
        }, {})

    } catch (e) {
        alert(e.message)
    }
}

export default getStoreInformation
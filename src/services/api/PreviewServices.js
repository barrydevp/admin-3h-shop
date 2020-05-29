const baseUrl =
    process.env.NODE_ENV === 'production' && process.env.REACT_APP_PRIMARY_DOMAIN
        ? `https://${process.env.REACT_APP_PRIMARY_DOMAIN}/preview`
        : 'https://tile.merch8.com/preview'

const getPreviewBaseURL = () => {
    return baseUrl
}

export const getPreviewOriginalImageURL = (path) => {
    const baseUrl = getPreviewBaseURL()

    return `${baseUrl}/image/original/${path}`
}

export const getPreviewImageWithResizeURL = (path, size) => {
    const baseUrl = getPreviewBaseURL()

    return `${baseUrl}/image/resize/${size}/${path}`
}

export const getPreviewImageURL = (path, size, croppedImage) => {
    const baseUrl = getPreviewBaseURL()
    if (!croppedImage) return `${baseUrl}/image/resize/${size}/${path}`

    const {top, left, width, height, rotate} = croppedImage

    return `${baseUrl}/image/v3/crop-resize/${size}/${width}/${height}/${top}/${left}/${rotate}/${path}`
}

export const getPreviewImageWithCropAndResizeURL = (path, size, croppedImage) => {
    const baseUrl = getPreviewBaseURL()

    const {top, left, width, height, rotate} = croppedImage

    return `${baseUrl}/image/v3/crop-resize/${size}/${width}/${height}/${top}/${left}/${rotate}/${path}`
}

export const getPreviewImageWithCropURL = (path, croppedImage) => {
    const baseUrl = getPreviewBaseURL()

    const {top, left, width, height, rotate} = croppedImage

    return `${baseUrl}/image/v3/crop/${width}/${height}/${top}/${left}/${rotate}/${path}`
}

export const getPreviewImageURLV2 = (path, size, croppedImage) => {
    const baseUrl = getPreviewBaseURL()
    if (!croppedImage) return `${baseUrl}/image/resize/${size}/${path}`

    const {top, left, width, height, rotate} = croppedImage

    return `${baseUrl}/image/v2/crop-resize/${size}/${width}/${height}/${top}/${left}/${rotate}/${path}`
}

export const getPreviewImageWithCropAndResizeURLV2 = (path, size, croppedImage) => {
    const baseUrl = getPreviewBaseURL()

    const {top, left, width, height, rotate} = croppedImage

    return `${baseUrl}/image/v2/crop-resize/${size}/${width}/${height}/${top}/${left}/${rotate}/${path}`
}

export const getPreviewImageWithCropURLV2 = (path, croppedImage) => {
    const baseUrl = getPreviewBaseURL()

    const {top, left, width, height, rotate} = croppedImage

    return `${baseUrl}/image/v2/crop/${width}/${height}/${top}/${left}/${rotate}/${path}`
}

export const getPreviewImageURLV1 = (path, size, croppedImage) => {
    const baseUrl = getPreviewBaseURL()
    if (!croppedImage) return `${baseUrl}/image/resize/${size}/${path}`

    const {top, left, width, height} = croppedImage

    return `${baseUrl}/image/crop-resize/${size}/${width}/${height}/${top}/${left}/${path}`
}

export const getPreviewImageWithCropAndResizeURLV1 = (path, size, croppedImage) => {
    const baseUrl = getPreviewBaseURL()

    const {top, left, width, height} = croppedImage

    return `${baseUrl}/image/crop-resize/${size}/${width}/${height}/${top}/${left}/${path}`
}

export const getPreviewImageWithCropURLV1 = (path, croppedImage) => {
    const baseUrl = getPreviewBaseURL()

    const {top, left, width, height} = croppedImage

    return `${baseUrl}/image/crop/${width}/${height}/${top}/${left}/${path}`
}

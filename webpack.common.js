function getDistFolderName (mode, forChrome, forFirefox) {
    let folderName = 'dist-'

    if (mode === 'development') {
        folderName += 'dev-'
    }
    if (forChrome) {
        return folderName + 'chrome'
    } else if (forFirefox) {
        return folderName + 'firefox'
    } else {
        return folderName + 'unknown'
    }
}
module.exports.getDistFolderName = getDistFolderName


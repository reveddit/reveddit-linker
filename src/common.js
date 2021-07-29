const regex_pc = /^\/(r|user)\/([^/]+)\/comments\/([^/]+)\/[^/]*(?:\/([^/?&#]+))?/
const regex_user = /^\/(?:user|y|u)\/([^/?&#]+)\/?/

export const getFullIDsFromPath = (path) => {
    let postID = undefined, commentID = undefined, user = undefined, subreddit = undefined
    const matches_pc = path.match(regex_pc)
    const matches_user = path.match(regex_user)
    if (matches_pc) {
        const type = matches_pc[1]
        if (type === 'user') {
            subreddit = 'u_' + matches_pc[2]
        } else {
            subreddit = matches_pc[2]
        }
        if (matches_pc[3]) postID = 't3_'+matches_pc[3]
        if (matches_pc[4]) commentID = 't1_'+matches_pc[4]
    } else if (matches_user) {
        user = matches_user[1]
    }
    return [postID, commentID, subreddit]
}

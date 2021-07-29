import {getFullIDsFromPath} from './common.js'

export const redditModifications = () => {
  const isNewReddit = document.querySelector('#SHORTCUT_FOCUSABLE_DIV') !== null
  if ( ! isNewReddit ) {
    const selector = '.thing.link, .thing.comment'
    addLinks_oldReddit($(selector))
    $(document).arrive(selector, (element) => {
      addLinks_oldReddit([element])
    })
  }
}

const addLinks_oldReddit = (elements) => {
    $(elements).each((idx, element) => {
      let id = element.getAttribute('data-fullname')
      const permalink = element.getAttribute('data-permalink')
      if (! id) {
        const [postID, commentID, subreddit] = getFullIDsFromPath(permalink || '')
        if (commentID) {
          id = commentID
        } else if (postID) {
          id = postID
        }
      }
      if (! id) return
      const buttons = element.querySelector('ul.buttons')
      if (! buttons) return
      const isComment = element.classList.contains('comment')
      let commentRemoved = false
      let path = permalink
      if (isComment) {
        path += '?context=3'
        let commentBody = ''
        const bodyElement = element.querySelector('.usertext-body')
        const userTextElement = element.querySelector('.usertext')
        const authorElement = element.querySelector('.tagline em')
        if (bodyElement && id.match(/^t1_/)) {
          commentBody = bodyElement.textContent.trim()
        }
        if (commentBody === '[removed]' &&
            userTextElement && userTextElement.classList.contains('grayed') &&
            authorElement && authorElement.textContent.trim() === '[deleted]'
          ) {
            commentRemoved = true
        }
      }
      if (! isComment || commentRemoved) {
        const newButton = $(`<a href="https://www.reveddit.com${path}">`).html('<span style="font-style:italic; text-decoration: underline">rev</span>eddit').wrap('<li>').parent()
        if (isComment) {
          $(buttons).prepend(newButton)
        } else {
          $(buttons).append(newButton)
        }
      }
    })
}

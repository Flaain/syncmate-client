export const getScrollBottom = <T extends HTMLElement>(element: T) => {
    console.log(element.scrollHeight - element.scrollTop - element.clientHeight)
    return element.scrollHeight - element.scrollTop - element.clientHeight
};
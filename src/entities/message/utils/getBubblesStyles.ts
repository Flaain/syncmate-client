export const getBubblesStyles = ({ isMessageFromMe, isFirst, isLast }: { isMessageFromMe: boolean, isLast: boolean, isFirst: boolean }) => {
    if (isMessageFromMe) {
        return {
            ['dark:bg-primary-white bg-primary-dark-50']: true,
            ['rounded-se-[15px] rounded-es-[15px] rounded-ee-[5px] rounded-ss-[15px]']: isFirst,
            ['rounded-se-[5px] rounded-ss-[15px] rounded-es-[15px] rounded-ee-[0px]']: isLast,
            ['rounded-se-[5px] rounded-ee-[5px] rounded-ss-[15px] rounded-es-[15px]']: !isFirst && !isLast,
            ['rounded-se-[15px] rounded-ee-[0px]']: isFirst && isLast,
        }
    } else {
        return {
            ['dark:bg-primary-dark-50 bg-primary-gray rounded-se-[15px] rounded-ee-[15px]']: true,
            ['rounded-ss-[5px] rounded-es-[0px] rounded-ee-[15px]']: isLast,
            ['rounded-ss-[15px] rounded-es-[5px]']: isFirst,
            ['rounded-es-[5px] rounded-ee-[15px] rounded-ss-[5px]']: !isFirst && !isLast,
            ['rounded-ss-[15px] rounded-es-[0px]']: isFirst && isLast,
        }
    }
}
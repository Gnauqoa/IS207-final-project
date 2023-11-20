import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'

import 'dayjs/locale/vi.js'

dayjs.extend(relativeTime)
dayjs.locale('vi')

export default dayjs

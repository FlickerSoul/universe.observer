import DCERedef from './DCERedef.vue'
import DCEUnused from './DCEUnused.vue'
import DCENative from './DCENative.vue'
import DCEMultiPass from './DCEMultipass.vue'

export const DCECycle = [DCERedef, DCEUnused, DCENative, DCEMultiPass]

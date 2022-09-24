//no tree punching!
onEvent('block.modification', event => {
  event.modify(/.*log.*/, block => {
    block.requiresTool = true
  })
})

//remove leaf collision

onEvent('block.modification', e => {
  e.modify(/.*leaves.*/, b => b.hasCollision = false)
})
